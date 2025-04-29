
import { supabase } from '@/integrations/supabase/client';

/**
 * Check if the current user is a super admin using the RPC function
 * @returns Promise<boolean>
 */
export const checkIsSuperAdminRPC = async (): Promise<boolean> => {
  try {
    const { data, error } = await supabase.rpc('check_is_super_admin');
    
    if (error) {
      console.error('Error checking super admin status via RPC:', error);
      throw error;
    }
    
    return !!data;
  } catch (error) {
    console.error('Error in checkIsSuperAdminRPC:', error);
    throw error;
  }
};

/**
 * Alternative method to check if the current user is a super admin using direct query
 * @returns Promise<boolean>
 */
export const checkIsSuperAdminDirect = async (userId: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('admin_users')
      .select('is_super_admin')
      .eq('user_id', userId)
      .maybeSingle();
    
    if (error) {
      console.error('Error checking super admin status via direct query:', error);
      throw error;
    }
    
    return !!data?.is_super_admin;
  } catch (error) {
    console.error('Error in checkIsSuperAdminDirect:', error);
    throw error;
  }
};
