
import { supabase } from '@/integrations/supabase/client';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '@/integrations/supabase/constants';

/**
 * Checks if the current user is a super admin
 * @returns Promise<boolean> True if the user is a super admin, false otherwise
 */
export const checkIsSuperAdmin = async (): Promise<boolean> => {
  try {
    console.log("Running checkIsSuperAdmin");
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      console.log("No authenticated user found in checkIsSuperAdmin");
      return false;
    }
    
    console.log("Checking admin status for user ID:", user.id);
    
    // First check local cache
    try {
      const cachedAdminStatus = localStorage.getItem(`adminStatus-${user.id}`);
      if (cachedAdminStatus) {
        const parsed = JSON.parse(cachedAdminStatus);
        if (parsed.timestamp > Date.now() - 3600000) { // Cache valid for 1 hour
          console.log("Using cached admin status:", parsed.isAdmin);
          return parsed.isAdmin;
        }
      }
    } catch (cacheError) {
      console.error('Error checking cached admin status:', cacheError);
    }
    
    // Direct approach using fetch to avoid RLS issues
    try {
      const response = await fetch(`${SUPABASE_URL}/rest/v1/admin_users?user_id=eq.${user.id}&select=is_super_admin`, {
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
      console.log("Admin check result from REST API:", adminData);
      
      if (!adminData || adminData.length === 0) {
        // Update local cache for admin status
        try {
          localStorage.setItem(`adminStatus-${user.id}`, JSON.stringify({
            isAdmin: false,
            timestamp: Date.now()
          }));
        } catch (cacheError) {
          console.error('Error updating admin cache:', cacheError);
        }
        return false;
      }
      
      // Update local cache for admin status
      try {
        localStorage.setItem(`adminStatus-${user.id}`, JSON.stringify({
          isAdmin: adminData[0].is_super_admin,
          timestamp: Date.now()
        }));
      } catch (cacheError) {
        console.error('Error updating admin cache:', cacheError);
      }
      
      return adminData[0].is_super_admin ?? false;
    } catch (apiError) {
      console.error('Error in REST API admin check:', apiError);
      
      // Fallback to direct DB query as a last resort
      try {
        console.log("Attempting direct DB query fallback");
        const { data: adminData, error: adminError } = await supabase.rpc('check_is_super_admin', {
          user_id_param: user.id
        });
        
        if (adminError) {
          console.error("Error in RPC fallback:", adminError);
          throw adminError;
        }
        
        // Update local cache for admin status
        try {
          localStorage.setItem(`adminStatus-${user.id}`, JSON.stringify({
            isAdmin: !!adminData,
            timestamp: Date.now()
          }));
        } catch (cacheError) {
          console.error('Error updating admin cache:', cacheError);
        }
        
        return !!adminData;
      } catch (fallbackError) {
        console.error('Fallback error:', fallbackError);
        throw fallbackError;
      }
    }
  } catch (error) {
    console.error('Error checking super admin status:', error);
    throw error;
  }
};

/**
 * Creates a new super admin
 * @param email Email of the user to make super admin
 * @returns Promise<{ success: boolean, message?: string }> Result of the operation
 */
export const createSuperAdmin = async (email: string): Promise<{ success: boolean, message?: string }> => {
  try {
    console.log("Creating super admin with email:", email);
    
    // First check if the user exists in user_profiles
    const { data: userResponse, error: userError } = await supabase
      .from('user_profiles')
      .select('id')
      .eq('email', email)
      .maybeSingle();
      
    if (userError) {
      console.error("Error checking if user exists:", userError);
      return { success: false, message: "Error checking if user exists: " + userError.message };
    }
    
    if (!userResponse) {
      console.log("No user found with email:", email);
      return { success: false, message: `משתמש עם הדואר ${email} לא נמצא במערכת` };
    }
    
    console.log("Found user with ID:", userResponse.id);
    
    // Use direct fetch approach to avoid RLS issues
    try {
      // First check if the user is already an admin
      const checkResponse = await fetch(`${SUPABASE_URL}/rest/v1/admin_users?user_id=eq.${userResponse.id}`, {
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
        // User is already an admin, update to super admin if needed
        if (!adminData[0].is_super_admin) {
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
          
          return { success: true, message: "המשתמש קיים כמנהל ועודכן למנהל על" };
        }
        
        return { success: true, message: "המשתמש כבר מוגדר כמנהל על" };
      }
      
      // User is not an admin, insert new record
      const insertResponse = await fetch(`${SUPABASE_URL}/rest/v1/admin_users`, {
        method: 'POST',
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation'
        },
        body: JSON.stringify({ 
          user_id: userResponse.id,
          is_super_admin: true
        })
      });
      
      if (!insertResponse.ok) {
        throw new Error(`Insert API request failed: ${insertResponse.statusText}`);
      }
      
      return { success: true, message: "נוסף בהצלחה כמנהל על" };
    } catch (restError) {
      console.error('Error using REST API approach:', restError);
      
      // Fallback to using RPC
      try {
        const { data: rpcResult, error: rpcError } = await supabase.rpc('create_super_admin', {
          admin_email_param: email
        });
        
        if (rpcError) {
          throw rpcError;
        }
        
        return { success: true, message: "נוסף בהצלחה כמנהל על באמצעות RPC" };
      } catch (rpcFailError) {
        console.error('Error using RPC fallback:', rpcFailError);
        return { success: false, message: `שגיאה בהוספת מנהל על: ${rpcFailError.message}` };
      }
    }
  } catch (error) {
    console.error('Error creating super admin:', error);
    return { success: false, message: 'An unexpected error occurred: ' + (error as Error).message };
  }
};
