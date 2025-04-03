
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/providers/AuthProvider';
import { useToast } from '@/hooks/use-toast';
import { checkIsSuperAdmin } from '@/services/admin/auth';

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
      try {
        const cachedAdminStatus = localStorage.getItem(`adminStatus-${user.id}`);
        if (cachedAdminStatus) {
          const parsed = JSON.parse(cachedAdminStatus);
          if (parsed.timestamp > Date.now() - 3600000) { // Cache valid for 1 hour
            console.log("AdminAccess: Using cached admin status:", parsed.isAdmin);
            setIsSuperAdmin(parsed.isAdmin);
            
            if (parsed.isAdmin) {
              return { hasAccess: true, fromCache: true };
            }
          }
        }
      } catch (cacheError) {
        console.error('Error checking cached admin status:', cacheError);
      }
      
      try {
        const isAdmin = await checkIsSuperAdmin();
        console.log("AdminAccess: Admin check result:", isAdmin);
        
        if (isAdmin) {
          console.log("AdminAccess: User confirmed as admin");
          setIsSuperAdmin(true);
          localStorage.setItem(`adminStatus-${user.id}`, JSON.stringify({
            isAdmin: true,
            timestamp: Date.now()
          }));
          return { hasAccess: true };
        } else {
          console.log("AdminAccess: User is not an admin:", user.id);
          setIsSuperAdmin(false);
          localStorage.setItem(`adminStatus-${user.id}`, JSON.stringify({
            isAdmin: false,
            timestamp: Date.now()
          }));
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
        try {
          const cachedAdminStatus = localStorage.getItem(`adminStatus-${user.id}`);
          if (cachedAdminStatus) {
            const parsed = JSON.parse(cachedAdminStatus);
            if (parsed.timestamp > Date.now() - 86400000) { // Extended cache validity during errors - 24 hours
              console.log("AdminAccess: Using cached admin status as fallback:", parsed.isAdmin);
              setIsSuperAdmin(parsed.isAdmin);
              if (parsed.isAdmin) {
                return { hasAccess: true, fromCache: true };
              }
            }
          }
        } catch (cacheError) {
          console.error('Error checking cached admin status:', cacheError);
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
      localStorage.removeItem(`adminStatus-${user.id}`);
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
