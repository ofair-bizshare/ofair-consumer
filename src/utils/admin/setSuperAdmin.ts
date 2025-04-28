
import { supabase } from '@/integrations/supabase/client';
import { clearAdminCache, clearAllAdminCaches } from '@/services/admin/utils/adminCache';

interface SuperAdminResult {
  success: boolean;
  message: string;
  userId?: string;
}

export const setSuperAdmin = async (email: string): Promise<SuperAdminResult> => {
  try {
    console.log(`Setting super admin privileges for: ${email}`);
    
    // First, attempt to use the RPC function (secure way)
    try {
      console.log("Attempting to use create_super_admin RPC function");
      const { data, error } = await supabase.rpc('create_super_admin', {
        admin_email_param: email
      });
      
      if (error) {
        console.warn("RPC method returned error:", error);
        console.log("Falling back to direct method");
      } else {
        console.log("RPC method succeeded:", data);
        
        // Get the user ID for this email to clear any cached admin status
        const { data: userData } = await supabase
          .from('user_profiles')
          .select('id')
          .eq('email', email)
          .single();
          
        if (userData?.id) {
          clearAdminCache(userData.id);
          console.log(`Cleared admin cache for user ID: ${userData.id}`);
          clearAllAdminCaches(); // Clear all for good measure
          
          return { 
            success: true, 
            message: `Successfully set ${email} as super admin using RPC method`,
            userId: userData.id
          };
        }
      }
    } catch (rpcError) {
      console.error("Error using RPC method:", rpcError);
      console.log("Falling back to direct method");
    }
    
    // Direct method (backup approach) - first get the user ID
    console.log("Attempting direct DB method to set admin privilege");
    
    const { data: userData, error: userError } = await supabase
      .from('user_profiles')
      .select('id')
      .eq('email', email)
      .single();
    
    if (userError || !userData) {
      console.error("Error finding user profile:", userError);
      return { 
        success: false, 
        message: `User not found: ${email}. Error: ${userError?.message || 'Unknown error finding user'}` 
      };
    }
    
    console.log(`Found user ID for ${email}: ${userData.id}`);
    
    // Check if the user is already an admin
    const { data: existingAdmin } = await supabase
      .from('admin_users')
      .select('id')
      .eq('user_id', userData.id)
      .maybeSingle();
    
    if (existingAdmin) {
      console.log(`User is already in admin_users table with ID: ${existingAdmin.id}`);
      
      // Update the record to ensure super admin flag is set
      const { error: updateError } = await supabase
        .from('admin_users')
        .update({ is_super_admin: true })
        .eq('id', existingAdmin.id);
      
      if (updateError) {
        console.error("Error updating existing admin record:", updateError);
        return { 
          success: false, 
          message: `Failed to update admin record: ${updateError.message}` 
        };
      }
      
      clearAdminCache(userData.id);
      clearAllAdminCaches(); // Clear all for good measure
      
      return { 
        success: true, 
        message: `Updated existing admin record for ${email} to have super admin privileges`,
        userId: userData.id
      };
    }
    
    // Insert new admin record
    const { data: newAdmin, error: insertError } = await supabase
      .from('admin_users')
      .insert({
        user_id: userData.id,
        is_super_admin: true
      })
      .select()
      .single();
    
    if (insertError) {
      console.error("Error inserting admin record:", insertError);
      return { 
        success: false, 
        message: `Failed to create admin record: ${insertError.message}` 
      };
    }
    
    console.log(`Created new admin record with ID: ${newAdmin?.id}`);
    
    clearAdminCache(userData.id);
    clearAllAdminCaches(); // Clear all for good measure
    
    return { 
      success: true, 
      message: `Successfully set ${email} as super admin using direct method`,
      userId: userData.id
    };
  } catch (error) {
    console.error('Unhandled error setting super admin:', error);
    return { 
      success: false, 
      message: `Failed to set super admin: ${(error as Error).message}` 
    };
  }
};
