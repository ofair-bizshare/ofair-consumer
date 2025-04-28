
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/providers/AuthProvider';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { clearAdminCache, getCachedAdminStatus, setCachedAdminStatus, clearAllAdminCaches } from '@/services/admin/utils/adminCache';

export const useAdminAccess = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [adminCheckError, setAdminCheckError] = useState<string | null>(null);
  const [retryAttempt, setRetryAttempt] = useState(0);

  const checkAdminStatus = useCallback(async (options: {
    bypassCache?: boolean,
    showToast?: boolean
  } = {}) => {
    const { bypassCache = false, showToast = false } = options;
    
    if (!user) {
      setLoading(false);
      return { hasAccess: false, needsLogin: true };
    }

    try {
      console.log("AdminAccess: Checking admin status for user:", user.id, "Attempt:", retryAttempt + 1);
      setAdminCheckError(null);
      
      // Check cached value if not bypassing cache
      if (!bypassCache) {
        const cachedAdminStatus = getCachedAdminStatus(user.id);
        if (cachedAdminStatus) {
          console.log("AdminAccess: Using cached admin status:", cachedAdminStatus.isAdmin);
          setIsSuperAdmin(cachedAdminStatus.isAdmin);
          
          if (cachedAdminStatus.isAdmin) {
            return { hasAccess: true, fromCache: true };
          }
        }
      }
      
      try {
        console.log("AdminAccess: Performing fresh admin status check");
        // Use the security definer function
        const { data: isAdmin, error } = await supabase.rpc('check_is_super_admin');
        
        if (error) {
          console.error("AdminAccess: Error in security definer function check:", error);
          throw error;
        }
        
        console.log("AdminAccess: Admin check result:", isAdmin);
        
        if (isAdmin) {
          console.log("AdminAccess: User confirmed as admin");
          setIsSuperAdmin(true);
          setCachedAdminStatus(user.id, true);
          
          if (showToast) {
            toast({
              title: "הרשאות מנהל אומתו",
              description: "יש לך הרשאות מנהל במערכת",
              variant: "default"
            });
          }
          
          return { hasAccess: true };
        } else {
          console.log("AdminAccess: User is not an admin:", user.id);
          setIsSuperAdmin(false);
          setCachedAdminStatus(user.id, false);
          
          if (showToast) {
            toast({
              title: "אין הרשאות מנהל",
              description: "אין לך הרשאות מנהל למערכת",
              variant: "destructive"
            });
          }
          
          return { hasAccess: false, notAdmin: true };
        }
      } catch (error) {
        console.error("AdminAccess: Error during admin check:", error);
        setAdminCheckError((error as Error).message || "שגיאה לא ידועה");
        
        // If we've tried less than 3 times, schedule another retry
        if (retryAttempt < 2) {
          console.log(`AdminAccess: Scheduling retry attempt ${retryAttempt + 1} in 2 seconds`);
          setTimeout(() => {
            setRetryAttempt(prev => prev + 1);
          }, 2000);
        }
        
        // Check if we have a cached admin status as fallback
        if (!bypassCache) {
          const cachedAdminStatus = getCachedAdminStatus(user.id);
          if (cachedAdminStatus) {
            console.log("AdminAccess: Using cached admin status as fallback:", cachedAdminStatus.isAdmin);
            setIsSuperAdmin(cachedAdminStatus.isAdmin);
            if (cachedAdminStatus.isAdmin) {
              return { hasAccess: true, fromCache: true };
            }
          }
        }
        
        if (showToast) {
          toast({
            title: "שגיאה בבדיקת הרשאות",
            description: (error as Error).message || "אירעה שגיאה בבדיקת הרשאות מנהל",
            variant: "destructive"
          });
        }
        
        return { hasAccess: false, error: (error as Error).message || "שגיאה לא ידועה" };
      }
    } catch (error) {
      console.error("AdminAccess: Error in admin access check:", error);
      setAdminCheckError((error as Error).message || "שגיאה לא ידועה");
      return { hasAccess: false, error: (error as Error).message || "שגיאה לא ידועה" };
    }
  }, [user, retryAttempt, toast]);

  useEffect(() => {
    const runCheck = async () => {
      setLoading(true);
      await checkAdminStatus();
      setLoading(false);
    };
    
    runCheck();
  }, [checkAdminStatus]);

  const forceRefresh = useCallback(async () => {
    // Clear cache and force a fresh check
    if (user) {
      clearAdminCache(user.id);
    }
    setRetryAttempt(0);
    setAdminCheckError(null);
    setLoading(true);
    
    const result = await checkAdminStatus({ 
      bypassCache: true,
      showToast: true 
    });
    
    setLoading(false);
    return result;
  }, [user, checkAdminStatus]);

  const resetAllCaches = useCallback(async () => {
    clearAllAdminCaches();
    toast({
      title: "איפוס מטמון",
      description: "כל נתוני המטמון של הרשאות אדמין נוקו",
      variant: "default"
    });
    return forceRefresh();
  }, [forceRefresh, toast]);

  return {
    isSuperAdmin,
    loading,
    adminCheckError,
    checkAdminStatus,
    forceRefresh,
    resetAllCaches
  };
};
