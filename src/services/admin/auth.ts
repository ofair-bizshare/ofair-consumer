
import { supabase } from '@/integrations/supabase/client';
import { getCachedAdminStatus, setCachedAdminStatus, clearAdminCache } from './utils/adminCache';

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
    
    // Primary method: Use the security definer function
    console.log("No cache found, checking via security definer function");
    const { data: isAdmin, error } = await supabase.rpc('check_is_super_admin');
    
    if (error) {
      console.error("Error in security definer function check:", error);
      
      // Try fallback direct method in case RPC fails
      console.log("Attempting fallback direct check method");
      const { data, error: directError } = await supabase
        .from('admin_users')
        .select('is_super_admin')
        .eq('user_id', user.id)
        .maybeSingle();
      
      if (directError) {
        console.error("Direct check also failed:", directError);
        throw error; // Throw the original error
      }
      
      const isAdminDirect = !!data?.is_super_admin;
      console.log("Direct admin status check result:", isAdminDirect);
      setCachedAdminStatus(user.id, isAdminDirect);
      return isAdminDirect;
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
    
    try {
      // Try the RPC function first
      const { data, error } = await supabase.rpc('create_super_admin', {
        admin_email_param: email
      });
      
      if (error) {
        console.error("Error using RPC to create admin:", error);
        // Fall back to direct insertion
      } else {
        // Clear and update cache
        clearAdminCache(userResponse.id);
        setCachedAdminStatus(userResponse.id, true);
        
        return { success: true, message: "נוסף בהצלחה כמנהל על באמצעות RPC" };
      }
    } catch (rpcError) {
      console.error("Exception trying to use RPC:", rpcError);
      // Continue to fallback
    }
    
    // Direct DB approach as fallback
    console.log("Using direct DB approach to create admin");
    
    // Check if admin record exists
    const { data: existingAdmin } = await supabase
      .from('admin_users')
      .select('id')
      .eq('user_id', userResponse.id)
      .maybeSingle();
      
    if (existingAdmin) {
      // Update existing record
      const { error: updateError } = await supabase
        .from('admin_users')
        .update({ is_super_admin: true })
        .eq('id', existingAdmin.id);
        
      if (updateError) {
        console.error("Error updating admin record:", updateError);
        return { success: false, message: `שגיאה בעדכון הרשאות מנהל: ${updateError.message}` };
      }
    } else {
      // Insert new record
      const { error: insertError } = await supabase
        .from('admin_users')
        .insert({
          user_id: userResponse.id,
          is_super_admin: true
        });
        
      if (insertError) {
        console.error("Error creating admin record:", insertError);
        return { success: false, message: `שגיאה בהוספת מנהל על: ${insertError.message}` };
      }
    }
    
    // Clear and update cache
    clearAdminCache(userResponse.id);
    setCachedAdminStatus(userResponse.id, true);
    
    return { success: true, message: "נוסף בהצלחה כמנהל על באמצעות DB ישיר" };
  } catch (error) {
    console.error('Error creating super admin:', error);
    return { success: false, message: 'An unexpected error occurred: ' + (error as Error).message };
  }
};
