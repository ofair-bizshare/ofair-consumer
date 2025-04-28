
import { supabase } from '@/integrations/supabase/client';

export const setSuperAdmin = async (email: string) => {
  try {
    const { data, error } = await supabase.rpc('create_super_admin', {
      admin_email_param: email
    });
    
    if (error) throw error;
    
    return { success: true, message: `Successfully set ${email} as super admin` };
  } catch (error) {
    console.error('Error setting super admin:', error);
    return { 
      success: false, 
      message: `Failed to set super admin: ${(error as Error).message}` 
    };
  }
};
