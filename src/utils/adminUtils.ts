
import { supabase } from '@/integrations/supabase/client';

/**
 * Diagnostic utility to check and log admin status for a user
 * @param email Email of the user to check
 * @returns Promise with admin check results
 */
export const checkAdminStatusByEmail = async (email: string): Promise<{
  success: boolean;
  message: string;
  details?: any;
}> => {
  try {
    // Step 1: Find the user ID for this email
    console.log(`Checking admin status for email: ${email}`);
    
    const { data: userProfile, error: userError } = await supabase
      .from('user_profiles')
      .select('id')
      .eq('email', email)
      .maybeSingle();
      
    if (userError) {
      console.error("Error finding user:", userError);
      return { 
        success: false, 
        message: `Error finding user: ${userError.message}` 
      };
    }
    
    if (!userProfile) {
      return { 
        success: false, 
        message: `User with email ${email} not found in user_profiles` 
      };
    }
    
    const userId = userProfile.id;
    console.log(`Found user with ID: ${userId}`);
    
    // Step 2: Check if this user is in admin_users table
    const { data: adminUser, error: adminError } = await supabase
      .from('admin_users')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();
      
    if (adminError) {
      console.error("Error checking admin status:", adminError);
      return { 
        success: false, 
        message: `Error checking admin status: ${adminError.message}` 
      };
    }
    
    if (!adminUser) {
      return { 
        success: false, 
        message: `User ${email} (${userId}) is not in admin_users table` 
      };
    }
    
    // User is in admin table, check super admin status
    if (adminUser.is_super_admin) {
      return { 
        success: true, 
        message: `User ${email} (${userId}) is a super admin`,
        details: adminUser
      };
    } else {
      return { 
        success: true, 
        message: `User ${email} (${userId}) is an admin but NOT a super admin`,
        details: adminUser
      };
    }
  } catch (error) {
    console.error("Error in checkAdminStatusByEmail:", error);
    return { 
      success: false, 
      message: `Unexpected error: ${(error as Error).message}` 
    };
  }
};

/**
 * Utility to force set a user as super admin (for emergency access recovery)
 * @param email Email of the user to make super admin
 * @returns Promise with the operation result
 */
export const forceSetSuperAdmin = async (email: string): Promise<{
  success: boolean;
  message: string;
}> => {
  try {
    // Step 1: Find the user ID for this email
    const { data: userProfile, error: userError } = await supabase
      .from('user_profiles')
      .select('id')
      .eq('email', email)
      .maybeSingle();
      
    if (userError) {
      console.error("Error finding user:", userError);
      return { success: false, message: `Error finding user: ${userError.message}` };
    }
    
    if (!userProfile) {
      return { success: false, message: `User with email ${email} not found in user_profiles` };
    }
    
    const userId = userProfile.id;
    
    // Step 2: Check if this user is already in admin_users table
    const { data: existingAdmin, error: checkError } = await supabase
      .from('admin_users')
      .select('id')
      .eq('user_id', userId)
      .maybeSingle();
      
    if (checkError) {
      console.error("Error checking existing admin:", checkError);
      return { success: false, message: `Error checking existing admin: ${checkError.message}` };
    }
    
    // Step 3: Either update or insert
    if (existingAdmin) {
      // Update existing record
      const { error: updateError } = await supabase
        .from('admin_users')
        .update({ is_super_admin: true })
        .eq('id', existingAdmin.id);
        
      if (updateError) {
        console.error("Error updating admin:", updateError);
        return { success: false, message: `Error updating admin: ${updateError.message}` };
      }
      
      return { success: true, message: `User ${email} updated to super admin successfully` };
    } else {
      // Insert new record
      const { error: insertError } = await supabase
        .from('admin_users')
        .insert({
          user_id: userId,
          is_super_admin: true
        });
        
      if (insertError) {
        console.error("Error inserting admin:", insertError);
        return { success: false, message: `Error inserting admin: ${insertError.message}` };
      }
      
      return { success: true, message: `User ${email} added as super admin successfully` };
    }
  } catch (error) {
    console.error("Error in forceSetSuperAdmin:", error);
    return { success: false, message: `Unexpected error: ${(error as Error).message}` };
  }
};
