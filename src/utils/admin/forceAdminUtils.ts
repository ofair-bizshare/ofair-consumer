
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
    
    // Try direct fetch approach with the service key to override RLS 
    try {
      // Try inserting first
      const insertResponse = await fetch(`${SUPABASE_URL}/rest/v1/admin_users`, {
        method: 'POST',
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation'
        },
        body: JSON.stringify({ 
          user_id: userResponse.id,
          is_super_admin: true
        })
      });
      
      // If insertion fails due to uniqueness constraint, try update
      if (!insertResponse.ok) {
        console.log("Insert failed, trying update");
        const updateResponse = await fetch(`${SUPABASE_URL}/rest/v1/admin_users?user_id=eq.${userResponse.id}`, {
          method: 'PATCH',
          headers: {
            'apikey': SUPABASE_ANON_KEY,
            'Content-Type': 'application/json',
            'Prefer': 'return=representation'
          },
          body: JSON.stringify({ 
            is_super_admin: true
          })
        });
        
        if (!updateResponse.ok) {
          const errorText = await updateResponse.text();
          throw new Error(`Failed to update admin status: ${updateResponse.statusText} - ${errorText}`);
        }
      }
    } catch (error) {
      // Fall back to using RPC function
      console.log("Direct API approach failed, using RPC function");
      const { data, error: rpcError } = await supabase.rpc('create_super_admin', {
        admin_email_param: email
      });
      
      if (rpcError) {
        console.error("RPC function failed:", rpcError);
        return { success: false, message: `Failed to set admin status: ${rpcError.message}` };
      }
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
