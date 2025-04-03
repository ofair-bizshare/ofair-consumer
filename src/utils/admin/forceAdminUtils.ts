
import { supabase } from '@/integrations/supabase/client';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '@/integrations/supabase/constants';

/**
 * Sets a user as super admin - this is a utility function for emergency use
 * when RLS policies are broken
 * 
 * @param email The email of the user to set as super admin
 * @returns Promise<boolean> True if successful
 */
export const forceSetSuperAdmin = async (email: string): Promise<{success: boolean, message: string}> => {
  try {
    console.log("EMERGENCY: Force setting super admin for:", email);
    
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
      console.error("No user found with email:", email);
      return { success: false, message: `No user found with email: ${email}` };
    }
    
    console.log("Found user with ID:", userResponse.id);
    
    // Direct insert/update since RLS is now disabled on admin_users table
    const { error: upsertError } = await supabase
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
      
    if (upsertError) {
      console.error("Error upserting admin record:", upsertError);
      return { success: false, message: `Failed to set admin status: ${upsertError.message}` };
    }
    
    // Force update cache
    localStorage.setItem(`adminStatus-${userResponse.id}`, JSON.stringify({
      isAdmin: true,
      timestamp: Date.now()
    }));
    
    console.log("Successfully set user as super admin");
    return { success: true, message: "Successfully set as super admin. Please refresh the page." };
  } catch (error) {
    console.error("Error in forceSetSuperAdmin:", error);
    return { success: false, message: `Error setting super admin: ${(error as Error).message}` };
  }
};
