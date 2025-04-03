
import { supabase } from '@/integrations/supabase/client';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '@/integrations/supabase/constants';
import { setCachedAdminStatus } from './adminCache';

/**
 * Checks admin status using the direct REST API approach
 * @param userId User ID to check
 * @returns Promise<boolean> True if user is a super admin
 */
export const checkAdminViaRestApi = async (userId: string): Promise<boolean> => {
  console.log("Checking admin via direct REST API for:", userId);
  const response = await fetch(`${SUPABASE_URL}/rest/v1/admin_users?user_id=eq.${userId}&select=is_super_admin`, {
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
    setCachedAdminStatus(userId, false);
    return false;
  }
  
  setCachedAdminStatus(userId, adminData[0].is_super_admin);
  return adminData[0].is_super_admin ?? false;
};

/**
 * Checks admin status using RPC functions
 * @param userId User ID to check
 * @returns Promise<boolean> True if user is a super admin
 */
export const checkAdminViaRpc = async (userId: string): Promise<boolean> => {
  console.log("Checking admin via RPC function for:", userId);
  
  // First try with the check_is_super_admin_user function
  try {
    const { data: isAdmin, error: rpcError } = await supabase.rpc('check_is_super_admin_user', {
      user_id_param: userId
    });
    
    if (rpcError) {
      console.error("Error in check_is_super_admin_user RPC:", rpcError);
      throw rpcError;
    }
    
    console.log("RPC check_is_super_admin_user result:", isAdmin);
    setCachedAdminStatus(userId, !!isAdmin);
    return !!isAdmin;
  } catch (userRpcError) {
    console.error("Error in check_is_super_admin_user, trying fallback:", userRpcError);
    
    // Try with the regular check_is_super_admin function
    try {
      const { data: isSuperAdmin, error: superAdminError } = await supabase.rpc('check_is_super_admin', {
        user_id_param: userId
      });
      
      if (superAdminError) {
        console.error("Error in check_is_super_admin RPC:", superAdminError);
        throw superAdminError;
      }
      
      console.log("RPC check_is_super_admin result:", isSuperAdmin);
      setCachedAdminStatus(userId, !!isSuperAdmin);
      return !!isSuperAdmin;
    } catch (superAdminRpcError) {
      console.error("Error in check_is_super_admin, trying last resort:", superAdminRpcError);
      
      // Last resort - try with first super admin creation
      try {
        const user = await supabase.auth.getUser();
        if (!user.data.user?.email) {
          throw new Error("No user email available");
        }
        
        const { data: firstAdminResult, error: firstAdminError } = await supabase.rpc('create_first_super_admin', {
          admin_email: user.data.user.email
        });
        
        if (firstAdminError) {
          console.error("Error in create_first_super_admin RPC:", firstAdminError);
          throw firstAdminError;
        }
        
        console.log("RPC create_first_super_admin result:", firstAdminResult);
        setCachedAdminStatus(userId, !!firstAdminResult);
        return !!firstAdminResult;
      } catch (firstAdminError) {
        console.error("All RPC methods failed:", firstAdminError);
        throw firstAdminError;
      }
    }
  }
};
