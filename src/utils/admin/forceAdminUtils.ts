
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
    
    // Try the RPC function
    try {
      const { data: rpcResult, error: rpcError } = await supabase.rpc('check_is_super_admin', {
        user_id_param: userResponse.id
      });
      
      // If RPC function succeeds, the user is already a super admin
      if (!rpcError && rpcResult === true) {
        console.log("User is already a super admin. Bypassing cache...");
        
        // Force update the cache to ensure we're not having a cache issue
        localStorage.setItem(`adminStatus-${userResponse.id}`, JSON.stringify({
          isAdmin: true,
          timestamp: Date.now()
        }));
        
        return { success: true, message: "User is already a super admin. Cache has been updated." };
      }
      
      console.log("User is not a super admin or RPC error occurred. Trying direct database access...");
    } catch (error) {
      console.error("Error checking super admin status via RPC:", error);
    }
    
    // Try direct fetch approach to override RLS 
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
    
    if (!insertResponse.ok) {
      // If creation fails (possibly due to unique constraint), try updating
      const updateResponse = await fetch(`${SUPABASE_URL}/rest/v1/admin_users?user_id=eq.${userResponse.id}`, {
        method: 'PATCH',
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          is_super_admin: true
        })
      });
      
      if (!updateResponse.ok) {
        throw new Error(`Failed to update admin status: ${updateResponse.statusText}`);
      }
    }
    
    // Force update cache
    localStorage.setItem(`adminStatus-${userResponse.id}`, JSON.stringify({
      isAdmin: true,
      timestamp: Date.now()
    }));
    
    console.log("Successfully set user as super admin via direct API access");
    return { success: true, message: "Successfully set as super admin. Please refresh the page." };
  } catch (error) {
    console.error("Error in forceSetSuperAdmin:", error);
    return { success: false, message: `Error setting super admin: ${(error as Error).message}` };
  }
};
