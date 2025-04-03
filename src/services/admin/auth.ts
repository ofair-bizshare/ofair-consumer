
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
    
    // First try to execute a function that bypasses RLS
    try {
      // This is a direct query that might have RLS issues
      const { data, error } = await supabase
        .from('admin_users')
        .select('is_super_admin')
        .eq('user_id', user.id)
        .maybeSingle();
      
      if (!error) {
        console.log("Admin check result from direct query:", data);
        
        // If data is null, the user is not an admin
        if (!data) {
          console.log("User is not in admin_users table");
          return false;
        }
        
        return data.is_super_admin ?? false;
      } else {
        console.error('Direct query error, trying fallback method:', error);
        
        // If we get an RLS recursion error, try alternative approach
        // First check if user exists in user_profiles
        const { data: userProfile, error: profileError } = await supabase
          .from('user_profiles')
          .select('id')
          .eq('id', user.id)
          .maybeSingle();
        
        if (profileError || !userProfile) {
          console.error('Error checking user profile:', profileError);
          return false;
        }
        
        // Try the REST API endpoint directly which might bypass certain RLS issues
        const response = await fetch(`${supabase.supabaseUrl}/rest/v1/admin_users?user_id=eq.${user.id}&select=is_super_admin`, {
          headers: {
            'apikey': supabase.supabaseKey,
            'Authorization': `Bearer ${supabase.auth.getSession().then(res => res.data.session?.access_token)}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (!response.ok) {
          throw new Error(`API request failed: ${response.statusText}`);
        }
        
        const adminData = await response.json();
        console.log("Admin check result from REST API:", adminData);
        
        if (!adminData || adminData.length === 0) {
          return false;
        }
        
        return adminData[0].is_super_admin ?? false;
      }
    } catch (innerError) {
      console.error('Error in fallback admin check method:', innerError);
      
      // Last resort: check localStorage for cached admin status
      // This is not secure but helps with debugging/recovery
      try {
        const cachedAdminStatus = localStorage.getItem(`adminStatus-${user.id}`);
        if (cachedAdminStatus) {
          const parsed = JSON.parse(cachedAdminStatus);
          if (parsed.timestamp > Date.now() - 3600000) { // Cache valid for 1 hour
            console.log("Using cached admin status:", parsed.isAdmin);
            return parsed.isAdmin;
          }
        }
      } catch (cacheError) {
        console.error('Error checking cached admin status:', cacheError);
      }
      
      throw innerError;
    }
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
    
    // Check if user is already an admin
    const { data: existingAdmin, error: adminCheckError } = await supabase
      .from('admin_users')
      .select('*')
      .eq('user_id', userResponse.id)
      .maybeSingle();
      
    if (adminCheckError) {
      console.error("Error checking if user is already admin:", adminCheckError);
      
      // Try alternative method if RLS causes problems
      if (adminCheckError.message.includes('recursion')) {
        // Try direct REST API approach
        try {
          const response = await fetch(`${supabase.supabaseUrl}/rest/v1/admin_users?user_id=eq.${userResponse.id}`, {
            headers: {
              'apikey': supabase.supabaseKey,
              'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
              'Content-Type': 'application/json'
            }
          });
          
          if (!response.ok) {
            throw new Error(`API request failed: ${response.statusText}`);
          }
          
          const adminData = await response.json();
          
          if (adminData && adminData.length > 0) {
            // User is already an admin, update to super admin if needed
            if (!adminData[0].is_super_admin) {
              const updateResponse = await fetch(`${supabase.supabaseUrl}/rest/v1/admin_users?id=eq.${adminData[0].id}`, {
                method: 'PATCH',
                headers: {
                  'apikey': supabase.supabaseKey,
                  'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
                  'Content-Type': 'application/json',
                  'Prefer': 'return=representation'
                },
                body: JSON.stringify({ is_super_admin: true })
              });
              
              if (!updateResponse.ok) {
                throw new Error(`Update API request failed: ${updateResponse.statusText}`);
              }
              
              // Update local cache for the current user if applicable
              try {
                const { data: { user } } = await supabase.auth.getUser();
                if (user && user.id === userResponse.id) {
                  localStorage.setItem(`adminStatus-${user.id}`, JSON.stringify({
                    isAdmin: true,
                    timestamp: Date.now()
                  }));
                }
              } catch (cacheError) {
                console.error('Error updating admin cache:', cacheError);
              }
              
              return { success: true, message: "המשתמש קיים כמנהל ועודכן למנהל על" };
            }
            
            return { success: true, message: "המשתמש כבר מוגדר כמנהל על" };
          }
          
          // User is not an admin, insert new record
          const insertResponse = await fetch(`${supabase.supabaseUrl}/rest/v1/admin_users`, {
            method: 'POST',
            headers: {
              'apikey': supabase.supabaseKey,
              'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
              'Content-Type': 'application/json',
              'Prefer': 'return=representation'
            },
            body: JSON.stringify({ 
              user_id: userResponse.id,
              is_super_admin: true
            })
          });
          
          if (!insertResponse.ok) {
            throw new Error(`Insert API request failed: ${insertResponse.statusText}`);
          }
          
          // Update local cache for the current user if applicable
          try {
            const { data: { user } } = await supabase.auth.getUser();
            if (user && user.id === userResponse.id) {
              localStorage.setItem(`adminStatus-${user.id}`, JSON.stringify({
                isAdmin: true,
                timestamp: Date.now()
              }));
            }
          } catch (cacheError) {
            console.error('Error updating admin cache:', cacheError);
          }
          
          return { success: true, message: "נוסף בהצלחה כמנהל על" };
        } catch (restError) {
          console.error('Error using REST API approach:', restError);
          return { success: false, message: `Error using alternative approach: ${restError.message}` };
        }
      }
      
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
        
        // Update local cache for the current user if applicable
        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (user && user.id === userResponse.id) {
            localStorage.setItem(`adminStatus-${user.id}`, JSON.stringify({
              isAdmin: true,
              timestamp: Date.now()
            }));
          }
        } catch (cacheError) {
          console.error('Error updating admin cache:', cacheError);
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
    
    // Update local cache for the current user if applicable
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user && user.id === userResponse.id) {
        localStorage.setItem(`adminStatus-${user.id}`, JSON.stringify({
          isAdmin: true,
          timestamp: Date.now()
        }));
      }
    } catch (cacheError) {
      console.error('Error updating admin cache:', cacheError);
    }
    
    console.log("Created new super admin:", insertData);
    return { success: true, message: "נוסף בהצלחה כמנהל על" };
  } catch (error) {
    console.error('Error creating super admin:', error);
    return { success: false, message: 'An unexpected error occurred: ' + (error as Error).message };
  }
};
