
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/providers/AuthProvider';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { clearAdminCache, getCachedAdminStatus, setCachedAdminStatus } from '@/services/admin/utils/adminCache';

export const useAdminAccess = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [adminCheckError, setAdminCheckError] = useState<string | null>(null);
  const [retryAttempt, setRetryAttempt] = useState(0);

  const checkAdminStatus = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return { hasAccess: false, needsLogin: true };
    }

    try {
      console.log("AdminAccess: Checking admin status for user:", user.id, "Attempt:", retryAttempt + 1);
      setAdminCheckError(null);
      
      // First check if we have a cached result
      const cachedAdminStatus = getCachedAdminStatus(user.id);
      if (cachedAdminStatus) {
        console.log("AdminAccess: Using cached admin status:", cachedAdminStatus.isAdmin);
        setIsSuperAdmin(cachedAdminStatus.isAdmin);
        
        if (cachedAdminStatus.isAdmin) {
          return { hasAccess: true, fromCache: true };
        }
      }
      
      try {
        // Use the updated security definer function
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
          return { hasAccess: true };
        } else {
          console.log("AdminAccess: User is not an admin:", user.id);
          setIsSuperAdmin(false);
          setCachedAdminStatus(user.id, false);
          return { hasAccess: false, notAdmin: true };
        }
      } catch (error) {
        console.error("AdminAccess: Error during admin check:", error);
        setAdminCheckError((error as Error).message || "שגיאה לא ידועה");
        
        // If we have a cached admin status as fallback
        const cachedAdminStatus = getCachedAdminStatus(user.id);
        if (cachedAdminStatus) {
          console.log("AdminAccess: Using cached admin status as fallback:", cachedAdminStatus.isAdmin);
          setIsSuperAdmin(cachedAdminStatus.isAdmin);
          if (cachedAdminStatus.isAdmin) {
            return { hasAccess: true, fromCache: true };
          }
        }
        
        return { hasAccess: false, error: (error as Error).message || "שגיאה לא ידועה" };
      }
    } catch (error) {
      console.error("AdminAccess: Error in admin access check:", error);
      setAdminCheckError((error as Error).message || "שגיאה לא ידועה");
      return { hasAccess: false, error: (error as Error).message || "שגיאה לא ידועה" };
    }
  }, [user, retryAttempt]);

  useEffect(() => {
    const runCheck = async () => {
      setLoading(true);
      await checkAdminStatus();
      setLoading(false);
    };
    
    runCheck();
  }, [checkAdminStatus]);

  const forceRefresh = useCallback(() => {
    // Clear cache and force a fresh check
    if (user) {
      clearAdminCache(user.id);
    }
    setRetryAttempt(0);
    setAdminCheckError(null);
    setLoading(true);
    checkAdminStatus().finally(() => setLoading(false));
  }, [user, checkAdminStatus]);

  return {
    isSuperAdmin,
    loading,
    adminCheckError,
    checkAdminStatus,
    forceRefresh
  };
};
