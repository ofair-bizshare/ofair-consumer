
import { supabase } from '@/integrations/supabase/client';
import { getCachedAdminStatus, setCachedAdminStatus } from './utils/adminCache';

/**
 * Checks if the current user is a super admin using the security definer function
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
    
    // Use the security definer function directly
    // Changed from is_super_admin to check_is_super_admin to match existing function
    console.log("No cache found, checking via security definer function");
    const { data: isAdmin, error } = await supabase.rpc('check_is_super_admin');
    
    if (error) {
      console.error("Error in security definer function check:", error);
      throw error;
    }
    
    console.log("Admin status from security definer function:", isAdmin);
    setCachedAdminStatus(user.id, !!isAdmin);
    return !!isAdmin;
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
    
    // Insert or update the admin record
    const { data, error } = await supabase
      .from('admin_users')
      .upsert(
        { 
          user_id: userResponse.id,
          is_super_admin: true
        },
        { 
          onConflict: 'user_id',
          ignoreDuplicates: false 
        }
      );
    
    if (error) {
      console.error("Error creating/updating super admin:", error);
      return { success: false, message: `שגיאה בהוספת מנהל על: ${error.message}` };
    }
    
    // Clear and update cache
    localStorage.removeItem(`adminStatus-${userResponse.id}`);
    setCachedAdminStatus(userResponse.id, true);
    
    return { success: true, message: "נוסף בהצלחה כמנהל על" };
  } catch (error) {
    console.error('Error creating super admin:', error);
    return { success: false, message: 'An unexpected error occurred: ' + (error as Error).message };
  }
};
