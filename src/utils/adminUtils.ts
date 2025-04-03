
import { supabase } from '@/integrations/supabase/client';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '@/integrations/supabase/constants';

/**
 * Diagnostic utility to check and log admin status for a user
 * @param email Email of the user to check
 * @returns Promise with admin check results
 */
export const checkAdminStatusByEmail = async (email: string): Promise<{
  success: boolean;
  message: string;
  details?: any;
}> => {
  try {
    // Step 1: Find the user ID for this email
    console.log(`Checking admin status for email: ${email}`);
    
    const { data: userProfile, error: userError } = await supabase
      .from('user_profiles')
      .select('id')
      .eq('email', email)
      .maybeSingle();
      
    if (userError) {
      console.error("Error finding user:", userError);
      return { 
        success: false, 
        message: `Error finding user: ${userError.message}` 
      };
    }
    
    if (!userProfile) {
      return { 
        success: false, 
        message: `User with email ${email} not found in user_profiles` 
      };
    }
    
    const userId = userProfile.id;
    console.log(`Found user with ID: ${userId}`);
    
    // Step 2: Check if this user is in admin_users table using direct fetch to avoid RLS issues
    try {
      const response = await fetch(`${SUPABASE_URL}/rest/v1/admin_users?user_id=eq.${userId}`, {
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`API request failed: ${response.statusText}`);
      }
      
      const adminData = await response.json();
      
      if (!adminData || adminData.length === 0) {
        return { 
          success: false, 
          message: `User ${email} (${userId}) is not in admin_users table` 
        };
      }
      
      // User is in admin table, check super admin status
      if (adminData[0].is_super_admin) {
        return { 
          success: true, 
          message: `User ${email} (${userId}) is a super admin`,
          details: adminData[0]
        };
      } else {
        return { 
          success: true, 
          message: `User ${email} (${userId}) is an admin but NOT a super admin`,
          details: adminData[0]
        };
      }
    } catch (apiError) {
      console.error("Error in direct API check:", apiError);
      
      // Try using RPC as fallback - use create_first_super_admin instead
      try {
        const { data: isAdmin, error: rpcError } = await supabase.rpc('create_first_super_admin', {
          admin_email: email
        });
        
        if (rpcError) {
          throw rpcError;
        }
        
        if (isAdmin) {
          return { 
            success: true, 
            message: `User ${email} (${userId}) is a super admin (via RPC check)`,
            details: { is_super_admin: true, user_id: userId }
          };
        } else {
          return { 
            success: false, 
            message: `User ${email} (${userId}) is not a super admin (via RPC check)` 
          };
        }
      } catch (rpcError) {
        console.error("Error in RPC fallback:", rpcError);
        throw rpcError;
      }
    }
  } catch (error) {
    console.error("Error in checkAdminStatusByEmail:", error);
    return { 
      success: false, 
      message: `Unexpected error: ${(error as Error).message}` 
    };
  }
};

/**
 * Utility to force set a user as super admin (for emergency access recovery)
 * @param email Email of the user to make super admin
 * @returns Promise with the operation result
 */
export const forceSetSuperAdmin = async (email: string): Promise<{
  success: boolean;
  message: string;
}> => {
  try {
    // Step 1: Find the user ID for this email
    const { data: userProfile, error: userError } = await supabase
      .from('user_profiles')
      .select('id')
      .eq('email', email)
      .maybeSingle();
      
    if (userError) {
      console.error("Error finding user:", userError);
      return { success: false, message: `Error finding user: ${userError.message}` };
    }
    
    if (!userProfile) {
      return { success: false, message: `User with email ${email} not found in user_profiles` };
    }
    
    const userId = userProfile.id;
    console.log(`Found user ID for emergency admin access: ${userId}`);
    
    // Step 2: Try direct REST API approach to bypass RLS
    try {
      // Check if admin record already exists
      const checkResponse = await fetch(`${SUPABASE_URL}/rest/v1/admin_users?user_id=eq.${userId}`, {
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!checkResponse.ok) {
        throw new Error(`API check request failed: ${checkResponse.statusText}`);
      }
      
      const adminData = await checkResponse.json();
      
      if (adminData && adminData.length > 0) {
        // Update existing record
        const updateResponse = await fetch(`${SUPABASE_URL}/rest/v1/admin_users?id=eq.${adminData[0].id}`, {
          method: 'PATCH',
          headers: {
            'apikey': SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=representation'
          },
          body: JSON.stringify({ is_super_admin: true })
        });
        
        if (!updateResponse.ok) {
          throw new Error(`Update API request failed: ${updateResponse.statusText}`);
        }
        
        // Update local cache
        try {
          localStorage.setItem(`adminStatus-${userId}`, JSON.stringify({
            isAdmin: true,
            timestamp: Date.now()
          }));
        } catch (cacheError) {
          console.error('Error updating admin cache:', cacheError);
        }
        
        return { success: true, message: `User ${email} updated to super admin successfully via direct API` };
      } else {
        // Insert new record
        const insertResponse = await fetch(`${SUPABASE_URL}/rest/v1/admin_users`, {
          method: 'POST',
          headers: {
            'apikey': SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=representation'
          },
          body: JSON.stringify({ 
            user_id: userId,
            is_super_admin: true
          })
        });
        
        if (!insertResponse.ok) {
          throw new Error(`Insert API request failed: ${insertResponse.statusText}`);
        }
        
        // Update local cache
        try {
          localStorage.setItem(`adminStatus-${userId}`, JSON.stringify({
            isAdmin: true,
            timestamp: Date.now()
          }));
        } catch (cacheError) {
          console.error('Error updating admin cache:', cacheError);
        }
        
        return { success: true, message: `User ${email} added as super admin successfully via direct API` };
      }
    } catch (apiError) {
      console.error("Error in direct API approach:", apiError);
      
      // Try RPC fallback - use create_first_super_admin instead
      try {
        const { data: rpcResult, error: rpcError } = await supabase.rpc('create_first_super_admin', {
          admin_email: email
        });
        
        if (rpcError) {
          throw rpcError;
        }
        
        // Update local cache
        try {
          localStorage.setItem(`adminStatus-${userId}`, JSON.stringify({
            isAdmin: true,
            timestamp: Date.now()
          }));
        } catch (cacheError) {
          console.error('Error updating admin cache:', cacheError);
        }
        
        return { success: true, message: `User ${email} set as super admin successfully via RPC` };
      } catch (rpcError) {
        console.error("Error in RPC fallback:", rpcError);
        return { success: false, message: `Error in RPC approach: ${rpcError.message}` };
      }
    }
  } catch (error) {
    console.error("Error in forceSetSuperAdmin:", error);
    return { success: false, message: `Unexpected error: ${(error as Error).message}` };
  }
};
