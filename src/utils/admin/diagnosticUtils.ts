
import { supabase } from '@/integrations/supabase/client';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '@/integrations/supabase/constants';

/**
 * Checks admin status for a user by email - for admin diagnostics
 */
export const checkAdminStatusByEmail = async (email: string): Promise<{
  success: boolean,
  message: string,
  details?: any
}> => {
  try {
    // First get the user ID from email
    const { data: userProfile, error: userError } = await supabase
      .from('user_profiles')
      .select('id')
      .eq('email', email)
      .maybeSingle();
      
    if (userError) {
      return { 
        success: false, 
        message: `Error looking up user: ${userError.message}` 
      };
    }
    
    if (!userProfile) {
      return { 
        success: false, 
        message: `No user found with email: ${email}` 
      };
    }
    
    // Check admin status through RPC function
    try {
      const { data: isAdmin, error: rpcError } = await supabase.rpc('check_is_admin', {
        user_id_param: userProfile.id
      });
      
      if (rpcError) {
        throw new Error(rpcError.message);
      }
      
      if (!isAdmin) {
        return {
          success: false,
          message: `User is not an admin`,
          details: { 
            email, 
            user_id: userProfile.id,
            is_admin: false
          }
        };
      }
      
      // Check if super admin
      const { data: isSuperAdmin, error: superAdminError } = await supabase.rpc('check_is_super_admin', {
        user_id_param: userProfile.id
      });
      
      if (superAdminError) {
        throw new Error(superAdminError.message);
      }
      
      // Get full admin record for details
      const { data: adminRecord, error: recordError } = await supabase
        .from('admin_users')
        .select('*')
        .eq('user_id', userProfile.id)
        .maybeSingle();
        
      if (recordError) {
        throw new Error(recordError.message);
      }
      
      return {
        success: true,
        message: isSuperAdmin 
          ? `User is a super admin with full privileges` 
          : `User is an admin but not a super admin`,
        details: {
          email,
          user_id: userProfile.id,
          is_admin: true,
          is_super_admin: isSuperAdmin,
          admin_record: adminRecord
        }
      };
      
    } catch (error) {
      // Try direct fetch as a fallback
      try {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/admin_users?user_id=eq.${userProfile.id}`, {
          headers: {
            'apikey': SUPABASE_ANON_KEY,
            'Content-Type': 'application/json'
          }
        });
        
        if (!response.ok) {
          throw new Error(`API request failed: ${response.statusText}`);
        }
        
        const adminData = await response.json();
        
        if (!adminData || adminData.length === 0) {
          return {
            success: false,
            message: `User is not an admin (direct check)`,
            details: { 
              email, 
              user_id: userProfile.id,
              is_admin: false,
              check_method: 'direct API'
            }
          };
        }
        
        return {
          success: true,
          message: adminData[0].is_super_admin 
            ? `User is a super admin with full privileges (direct check)` 
            : `User is an admin but not a super admin (direct check)`,
          details: {
            email,
            user_id: userProfile.id,
            is_admin: true,
            is_super_admin: adminData[0].is_super_admin,
            admin_record: adminData[0],
            check_method: 'direct API'
          }
        };
      } catch (fetchError) {
        console.error('Error in direct admin check:', fetchError);
        throw fetchError;
      }
    }
  } catch (error) {
    console.error('Error checking admin status:', error);
    return { 
      success: false, 
      message: `Error checking admin status: ${(error as Error).message}` 
    };
  }
};
