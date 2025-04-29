
import { supabase } from '@/integrations/supabase/client';
import { AdminUserInterface, UserProfileInterface } from '@/types/dashboard';

/**
 * Get all admin users
 * @returns Promise<AdminUserInterface[]> List of admin users
 */
export const getAdminUsers = async (): Promise<AdminUserInterface[]> => {
  try {
    const { data, error } = await supabase
      .from('admin_users')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching admin users:', error);
      throw error;
    }
    
    return data || [];
  } catch (error) {
    console.error('Error in getAdminUsers:', error);
    throw error;
  }
};

/**
 * Get user profile by ID
 * @param userId User ID to fetch profile for
 * @returns Promise<UserProfileInterface | null> The user profile or null if not found
 */
export const getUserProfile = async (userId: string): Promise<UserProfileInterface | null> => {
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();
    
    if (error) {
      console.error('Error fetching user profile:', error);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Error in getUserProfile:', error);
    throw error;
  }
};

/**
 * Get all user profiles
 * @returns Promise<UserProfileInterface[]> List of user profiles
 */
export const getAllUsers = async (): Promise<UserProfileInterface[]> => {
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching all users:', error);
      throw error;
    }
    
    return data || [];
  } catch (error) {
    console.error('Error in getAllUsers:', error);
    throw error;
  }
};
