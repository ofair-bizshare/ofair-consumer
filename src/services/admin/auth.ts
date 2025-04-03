
import { supabase } from '@/integrations/supabase/client';

/**
 * Checks if the current user is a super admin
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
    
    // Query to check if the user is a super admin
    const { data, error } = await supabase
      .from('admin_users')
      .select('is_super_admin')
      .eq('user_id', user.id)
      .maybeSingle();
    
    if (error) {
      console.error('Error checking super admin status:', error);
      return false;
    }
    
    console.log("Admin check result:", data);
    
    // If data is null, the user is not an admin
    if (!data) {
      console.log("User is not in admin_users table");
      return false;
    }
    
    return data.is_super_admin ?? false;
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
    
    // Check if user is already an admin
    const { data: existingAdmin, error: adminCheckError } = await supabase
      .from('admin_users')
      .select('*')
      .eq('user_id', userResponse.id)
      .maybeSingle();
      
    if (adminCheckError) {
      console.error("Error checking if user is already admin:", adminCheckError);
      return { success: false, message: "Error checking if user is already admin: " + adminCheckError.message };
    }
    
    if (existingAdmin) {
      console.log("User is already an admin:", existingAdmin);
      
      // If they're not a super admin, update them to be a super admin
      if (!existingAdmin.is_super_admin) {
        const { error: updateError } = await supabase
          .from('admin_users')
          .update({ is_super_admin: true })
          .eq('id', existingAdmin.id);
          
        if (updateError) {
          console.error("Error updating admin to super admin:", updateError);
          return { success: false, message: "Error updating admin to super admin: " + updateError.message };
        }
        
        console.log("Updated user to super admin");
        return { success: true, message: "המשתמש קיים כמנהל ועודכן למנהל על" };
      }
      
      return { success: true, message: "המשתמש כבר מוגדר כמנהל על" };
    }
    
    // Insert new admin
    const { data: insertData, error: insertError } = await supabase
      .from('admin_users')
      .insert({
        user_id: userResponse.id,
        is_super_admin: true
      })
      .select()
      .single();
      
    if (insertError) {
      console.error("Error inserting new admin:", insertError);
      return { success: false, message: "Error inserting new admin: " + insertError.message };
    }
    
    console.log("Created new super admin:", insertData);
    return { success: true };
  } catch (error) {
    console.error('Error creating super admin:', error);
    return { success: false, message: 'An unexpected error occurred: ' + (error as Error).message };
  }
};
