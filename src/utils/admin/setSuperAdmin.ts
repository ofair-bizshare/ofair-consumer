
import { supabase } from '@/integrations/supabase/client';
import { clearAdminCache } from '@/services/admin/utils/adminCache';

export const setSuperAdmin = async (email: string) => {
  try {
    const { data, error } = await supabase.rpc('create_super_admin', {
      admin_email_param: email
    });
    
    if (error) throw error;
    
    // Get the user ID for this email to clear any cached admin status
    try {
      const { data: userData, error: userError } = await supabase
        .from('user_profiles')
        .select('id')
        .eq('email', email)
        .single();
        
      if (!userError && userData?.id) {
        clearAdminCache(userData.id);
        console.log(`Cleared admin cache for user ID: ${userData.id}`);
      }
    } catch (cacheError) {
      console.error('Error clearing admin cache:', cacheError);
    }
    
    return { success: true, message: `Successfully set ${email} as super admin` };
  } catch (error) {
    console.error('Error setting super admin:', error);
    return { 
      success: false, 
      message: `Failed to set super admin: ${(error as Error).message}` 
    };
  }
};
