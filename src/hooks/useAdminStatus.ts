
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/providers/AuthProvider';
import { checkIsSuperAdmin } from '@/services/admin/auth';
import { useToast } from '@/hooks/use-toast';
import { clearAdminCache, getCachedAdminStatus, setCachedAdminStatus, clearAllAdminCaches } from '@/services/admin/utils/adminCache';

export const useAdminStatus = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const checkAdminStatus = useCallback(async (options: { 
    showToastOnError?: boolean, 
    bypassCache?: boolean
  } = {}) => {
    const { showToastOnError = false, bypassCache = false } = options;
    
    if (!user) {
      setIsAdmin(false);
      setIsChecking(false);
      setError(null);
      return { hasAccess: false, needsLogin: true };
    }
    
    try {
      console.log(`Checking admin status (attempt ${retryCount + 1})...`);
      setError(null);
      
      // Only check cache if we're not bypassing it
      if (!bypassCache) {
        try {
          const cachedAdminStatus = getCachedAdminStatus(user.id);
          if (cachedAdminStatus) {
            setIsAdmin(cachedAdminStatus.isAdmin);
            setIsChecking(false);
            console.log("Using cached admin status:", cachedAdminStatus.isAdmin);
            return { hasAccess: cachedAdminStatus.isAdmin, fromCache: true };
          }
        } catch (cacheError) {
          console.error('Error checking cached admin status:', cacheError);
        }
      }
      
      // Using the security definer function
      console.log("Checking admin status via API");
      const adminStatus = await checkIsSuperAdmin();
      console.log("Security definer function returned admin status:", adminStatus);
      setIsAdmin(adminStatus);
      
      // Update cache
      setCachedAdminStatus(user.id, adminStatus);
      
      return { hasAccess: adminStatus };
      
    } catch (error) {
      console.error('Error checking admin status:', error);
      setError((error as Error).message || "שגיאה בבדיקת הרשאות מנהל");
      
      if (showToastOnError) {
        toast({
          title: "שגיאה בבדיקת הרשאות",
          description: (error as Error).message || "אירעה שגיאה בבדיקת הרשאות מנהל",
          variant: "destructive"
        });
      }
      
      // Try to fallback to cached status if available, but only if not bypassing cache
      if (!bypassCache) {
        try {
          const cachedAdminStatus = getCachedAdminStatus(user.id);
          if (cachedAdminStatus) {
            console.log("Using cached status as fallback after error");
            setIsAdmin(cachedAdminStatus.isAdmin);
            return { hasAccess: cachedAdminStatus.isAdmin, fromCache: true, error: (error as Error).message };
          } else {
            setIsAdmin(false);
          }
        } catch (cacheError) {
          console.error('Error with fallback cache:', cacheError);
          setIsAdmin(false);
        }
      } else {
        setIsAdmin(false);
      }
      
      // If we have attempted less than 3 times, retry after a delay
      if (retryCount < 2) {
        setTimeout(() => {
          setRetryCount(prev => prev + 1);
        }, 2000); // Retry after 2 seconds
      }
      
      return { hasAccess: false, error: (error as Error).message };
    } finally {
      setIsChecking(false);
    }
  }, [user, toast, retryCount]);

  // Initial check on load
  useEffect(() => {
    checkAdminStatus();
  }, [checkAdminStatus]);
  
  // Setup periodic check every 2 minutes
  useEffect(() => {
    if (!user) return;
    
    const intervalId = setInterval(() => {
      console.log("Performing periodic admin status check");
      checkAdminStatus({ bypassCache: true });
    }, 120000); // Check every 2 minutes
    
    return () => clearInterval(intervalId);
  }, [user, checkAdminStatus]);

  // Force refresh function that bypasses cache
  const forceRefreshAdminStatus = useCallback(async () => {
    setIsChecking(true);
    clearAdminCache(user?.id || '');
    
    const result = await checkAdminStatus({ 
      showToastOnError: true, 
      bypassCache: true
    });
    
    if (result.hasAccess) {
      toast({
        title: "הרשאות מנהל אומתו",
        description: "יש לך הרשאות מנהל למערכת",
        variant: "default"
      });
    }
    
    return result;
  }, [checkAdminStatus, toast, user]);

  return { 
    isAdmin, 
    isChecking, 
    error, 
    recheckStatus: () => checkAdminStatus({ showToastOnError: true }),
    forceRefreshAdminStatus
  };
};
