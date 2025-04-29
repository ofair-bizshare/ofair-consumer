
import { supabase } from '@/integrations/supabase/client';

/**
 * Check if the current user is a super admin
 * @returns Promise<boolean> True if user is super admin, false otherwise
 */
export const checkIsSuperAdmin = async (): Promise<boolean> => {
  try {
    const { data, error } = await supabase.rpc('check_is_super_admin');
    
    if (error) {
      console.error('Error checking super admin status:', error);
      throw error;
    }
    
    return !!data;
  } catch (error) {
    console.error('Error in checkIsSuperAdmin:', error);
    throw error;
  }
};

/**
 * Create a new super admin user
 * @param adminEmail The email of the user to make a super admin
 * @returns Promise<string> The ID of the created admin user
 */
export const createSuperAdmin = async (adminEmail: string): Promise<string> => {
  try {
    const { data, error } = await supabase.rpc('create_super_admin', {
      admin_email_param: adminEmail
    });
    
    if (error) {
      console.error('Error creating super admin:', error);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Error in createSuperAdmin:', error);
    throw error;
  }
};

/**
 * Check if the current user is any type of admin
 * @returns Promise<boolean> True if user is an admin, false otherwise
 */
export const checkIsAdmin = async (): Promise<boolean> => {
  try {
    const { data, error } = await supabase.rpc('is_admin_check');
    
    if (error) {
      console.error('Error checking admin status:', error);
      throw error;
    }
    
    return !!data;
  } catch (error) {
    console.error('Error in checkIsAdmin:', error);
    throw error;
  }
};
