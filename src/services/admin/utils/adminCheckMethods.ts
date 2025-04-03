
import { supabase } from '@/integrations/supabase/client';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '@/integrations/supabase/constants';
import { setCachedAdminStatus } from './adminCache';

/**
 * Checks admin status using the direct REST API approach
 * @param userId User ID to check
 * @returns Promise<boolean> True if user is a super admin
 */
export const checkAdminViaRestApi = async (userId: string): Promise<boolean> => {
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
 * Checks admin status using RPC functions as a fallback
 * @param userId User ID to check
 * @returns Promise<boolean> True if user is a super admin
 */
export const checkAdminViaRpc = async (userId: string): Promise<boolean> => {
  console.log("Attempting RPC function fallback");
  const { data: isAdmin, error: rpcError } = await supabase.rpc('check_is_super_admin', {
    user_id_param: userId
  });
  
  if (rpcError) {
    console.error("Error in RPC fallback:", rpcError);
    
    // Last resort - try the create_first_super_admin function
    console.log("Trying create_first_super_admin as last resort");
    const { data: adminData, error: adminError } = await supabase.rpc('create_first_super_admin', {
      admin_email: (await supabase.auth.getUser()).data.user?.email || ''
    });
    
    if (adminError) {
      console.error("Error in final fallback:", adminError);
      throw adminError;
    }
    
    setCachedAdminStatus(userId, !!adminData);
    return !!adminData;
  }
  
  setCachedAdminStatus(userId, !!isAdmin);
  return !!isAdmin;
};
