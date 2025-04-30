
import { supabase } from '@/integrations/supabase/client';
import { getCachedAdminStatus, setCachedAdminStatus } from './utils/adminCache';

/**
 * Check if the current user is a super admin
 * @returns Promise<boolean> True if the current user is a super admin, false otherwise
 */
export const checkIsSuperAdmin = async (): Promise<boolean> => {
  try {
    console.log('Checking if current user is a super admin');
    
    const {
      data: { user },
    } = await supabase.auth.getUser();
    
    if (!user) {
      console.log('No user found for admin check');
      return false;
    }
    
    // Check cache first
    const cached = getCachedAdminStatus(user.id);
    if (cached) {
      console.log('Using cached admin status:', cached.isAdmin);
      return cached.isAdmin;
    }
    
    console.log('Calling check_is_super_admin RPC function');
    const { data, error } = await supabase.rpc('check_is_super_admin');
    
    if (error) {
      console.error('Error checking super admin status:', error);
      throw error;
    }
    
    console.log('Super admin check result:', data);
    
    // Cache the result
    setCachedAdminStatus(user.id, !!data);
    
    return !!data;
  } catch (error) {
    console.error('Error in checkIsSuperAdmin:', error);
    return false;
  }
};

/**
 * Check if a specific user is a super admin
 * @param userId The user ID to check
 * @returns Promise<boolean> True if the user is a super admin, false otherwise
 */
export const checkUserIsSuperAdmin = async (userId: string): Promise<boolean> => {
  try {
    console.log('Checking if user is a super admin:', userId);
    
    // Check cache first
    const cached = getCachedAdminStatus(userId);
    if (cached) {
      console.log('Using cached admin status for user:', cached.isAdmin);
      return cached.isAdmin;
    }
    
    const { data, error } = await supabase.rpc('check_is_super_admin_user', { 
      user_id_param: userId 
    });
    
    if (error) {
      console.error('Error checking user super admin status:', error);
      throw error;
    }
    
    console.log('Super admin check result for user:', data);
    
    // Cache the result
    setCachedAdminStatus(userId, !!data);
    
    return !!data;
  } catch (error) {
    console.error('Error in checkUserIsSuperAdmin:', error);
    return false;
  }
};

/**
 * Create a super admin user
 * @param email The email address of the user to make a super admin
 * @returns Promise<string | null> The ID of the created admin user if successful, null otherwise
 */
export const createSuperAdmin = async (email: string): Promise<string | null> => {
  try {
    console.log('Creating super admin for email:', email);
    
    const { data, error } = await supabase.rpc('create_super_admin', { 
      admin_email_param: email 
    });
    
    if (error) {
      console.error('Error creating super admin:', error);
      throw error;
    }
    
    console.log('Super admin created successfully:', data);
    
    return data;
  } catch (error) {
    console.error('Error in createSuperAdmin:', error);
    return null;
  }
};
