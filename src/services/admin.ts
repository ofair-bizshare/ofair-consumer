
import { supabase } from '@/integrations/supabase/client';

/**
 * Checks if the current user is a super admin
 * @returns Promise<boolean> True if the user is a super admin, false otherwise
 */
export const checkIsSuperAdmin = async (): Promise<boolean> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return false;
    }
    
    const { data, error } = await supabase
      .from('admin_users')
      .select('is_super_admin')
      .eq('user_id', user.id)
      .maybeSingle();
    
    if (error) {
      console.error('Error checking super admin status:', error);
      return false;
    }
    
    return data?.is_super_admin ?? false;
  } catch (error) {
    console.error('Error checking super admin status:', error);
    return false;
  }
};

/**
 * Creates a new super admin
 * @param email Email of the user to make super admin
 * @returns Promise<{ success: boolean, message?: string }> Result of the operation
 */
export const createSuperAdmin = async (email: string): Promise<{ success: boolean, message?: string }> => {
  try {
    const { data, error } = await supabase.rpc('create_first_super_admin', {
      admin_email: email
    });
    
    if (error) {
      return { success: false, message: error.message };
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error creating super admin:', error);
    return { success: false, message: 'An unexpected error occurred' };
  }
};
