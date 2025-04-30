
import { supabase } from '@/integrations/supabase/client';
import { setCachedAdminStatus } from './utils/adminCache';

/**
 * Check if the current user is a super admin
 * @returns {Promise<boolean>} - Returns true if user is a super admin
 */
export const checkIsSuperAdmin = async (): Promise<boolean> => {
  try {
    console.log('Checking super admin status...');
    
    // Using the RPC function to check admin status
    const { data: isAdmin, error } = await supabase.rpc('check_is_super_admin');
    
    if (error) {
      console.error('Error checking super admin status:', error);
      throw error;
    }
    
    console.log('Super admin status check result:', isAdmin);
    
    // Cache the admin status if we have a valid user id
    const { data: { user } } = await supabase.auth.getUser();
    if (user?.id) {
      setCachedAdminStatus(user.id, isAdmin || false);
    }
    
    return isAdmin || false;
  } catch (error) {
    console.error('Error in checkIsSuperAdmin:', error);
    return false;
  }
};

/**
 * Creates a super admin using the email
 * @param {string} email - Email of the user to make super admin
 * @returns {Promise<{ success: boolean; message: string }>} - Result of the operation
 */
export const createSuperAdmin = async (email: string): Promise<{ success: boolean; message: string }> => {
  try {
    console.log(`Creating super admin with email: ${email}`);
    
    const { data: adminId, error } = await supabase.rpc('create_super_admin', {
      admin_email_param: email
    });
    
    if (error) {
      console.error('Error creating super admin:', error);
      return { 
        success: false, 
        message: error.message || 'Failed to create super admin'
      };
    }
    
    console.log('Super admin created successfully, ID:', adminId);
    return { 
      success: true, 
      message: `User with email ${email} was successfully made a super admin` 
    };
  } catch (error) {
    console.error('Error in createSuperAdmin:', error);
    return { 
      success: false, 
      message: (error as Error).message || 'An unexpected error occurred' 
    };
  }
};
