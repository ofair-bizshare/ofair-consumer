
import { supabase } from '@/integrations/supabase/client';
import { getCachedAdminStatus, setCachedAdminStatus } from './utils/adminCache';
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
    const cachedStatus = getCachedAdminStatus(user.id);
    if (cachedStatus) {
      console.log("Using cached admin status:", cachedStatus.isAdmin);
      return cachedStatus.isAdmin;
    }
    
    try {
      // Use the RPC function directly - this avoids recursion issues
      console.log("No cache found, checking via RPC function");
      const { data: isAdmin, error: rpcError } = await supabase.rpc('check_is_super_admin_user', {
        user_id_param: user.id
      });
      
      if (rpcError) {
        console.error("Error in RPC check:", rpcError);
        throw rpcError;
      }
      
      console.log("Admin status from RPC check:", isAdmin);
      setCachedAdminStatus(user.id, !!isAdmin);
      return !!isAdmin;
    } catch (rpcError) {
      console.error("RPC check failed, trying direct API access:", rpcError);
      
      // Fallback to direct REST API approach
      try {
        const token = (await supabase.auth.getSession()).data.session?.access_token;
        const url = `${SUPABASE_URL}/rest/v1/admin_users?user_id=eq.${user.id}&select=is_super_admin`;
        
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'apikey': SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=representation'
          }
        });
        
        if (!response.ok) {
          throw new Error(`API request failed: ${response.statusText}`);
        }
        
        const adminData = await response.json();
        console.log("Admin check result from direct API:", adminData);
        
        if (!adminData || adminData.length === 0) {
          setCachedAdminStatus(user.id, false);
          return false;
        }
        
        setCachedAdminStatus(user.id, adminData[0].is_super_admin);
        return adminData[0].is_super_admin ?? false;
      } catch (apiError) {
        console.error("API check also failed:", apiError);
        throw apiError;
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
    
    try {
      // Use the RPC function to avoid RLS issues
      console.log("Using RPC function to create super admin");
      const { data: rpcResult, error: rpcError } = await supabase.rpc('create_super_admin', {
        admin_email_param: email
      });
      
      if (rpcError) {
        console.error("Error in RPC function:", rpcError);
        throw rpcError;
      }
      
      console.log("RPC function result:", rpcResult);
      return { success: true, message: "נוסף בהצלחה כמנהל על" };
    } catch (rpcError) {
      console.error('Error using RPC function:', rpcError);
      
      // Try direct fetch approach as fallback
      try {
        console.log("Falling back to direct API approach");
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
          console.log("User is already an admin, updating super admin status");
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
        console.log("User is not an admin, creating new admin record");
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
        return { success: false, message: `שגיאה בהוספת מנהל על: ${restError.message}` };
      }
    }
  } catch (error) {
    console.error('Error creating super admin:', error);
    return { success: false, message: 'An unexpected error occurred: ' + (error as Error).message };
  }
};
