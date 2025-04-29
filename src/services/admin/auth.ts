
import { supabase } from '@/integrations/supabase/client';

interface AdminResult {
  success: boolean;
  message: string;
  data?: any;
}

/**
 * Check if the current user is a super admin
 * @returns Promise<boolean> True if user is super admin, false otherwise
 */
export const checkIsSuperAdmin = async (): Promise<boolean> => {
  try {
    const { data, error } = await supabase.rpc('is_super_admin_check');
    
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
 * @returns Promise<AdminResult> Result with success status and message
 */
export const createSuperAdmin = async (adminEmail: string): Promise<AdminResult> => {
  try {
    const { data, error } = await supabase.rpc('create_super_admin', {
      admin_email_param: adminEmail
    });
    
    if (error) {
      console.error('Error creating super admin:', error);
      return {
        success: false,
        message: `Failed to create super admin: ${error.message}`
      };
    }
    
    return {
      success: true,
      message: `Successfully added ${adminEmail} as super admin`,
      data
    };
  } catch (error) {
    console.error('Error in createSuperAdmin:', error);
    return {
      success: false,
      message: `An unexpected error occurred: ${(error as Error).message}`
    };
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
