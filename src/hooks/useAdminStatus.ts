
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
    bypassCache?: boolean,
    forceRefresh?: boolean 
  } = {}) => {
    const { showToastOnError = false, bypassCache = false, forceRefresh = false } = options;
    
    if (!user) {
      setIsAdmin(false);
      setIsChecking(false);
      setError(null);
      return { hasAccess: false, needsLogin: true };
    }
    
    try {
      console.log(`Checking admin status (attempt ${retryCount + 1})...`);
      setError(null);
      
      // Only check cache if we're not bypassing it or forcing refresh
      if (!bypassCache && !forceRefresh) {
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
      } else if (forceRefresh) {
        // Clear cache if forcing refresh
        console.log("Forcing refresh of admin status, clearing cache");
        clearAdminCache(user.id);
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

  useEffect(() => {
    checkAdminStatus();
  }, [checkAdminStatus]);

  // Force refresh function that bypasses cache and clears it
  const forceRefreshAdminStatus = useCallback(async () => {
    setIsChecking(true);
    const result = await checkAdminStatus({ 
      showToastOnError: true, 
      bypassCache: true,
      forceRefresh: true 
    });
    
    if (result.hasAccess) {
      toast({
        title: "הרשאות מנהל אומתו",
        description: "יש לך הרשאות מנהל למערכת",
        variant: "default"
      });
    }
    
    return result;
  }, [checkAdminStatus, toast]);

  // Emergency function to reset all caches
  const resetAllAdminCaches = useCallback(() => {
    clearAllAdminCaches();
    toast({
      title: "מטמון אדמין אופס",
      description: "כל נתוני המטמון של הרשאות האדמין נוקו",
      variant: "default"
    });
    return forceRefreshAdminStatus();
  }, [forceRefreshAdminStatus, toast]);

  return { 
    isAdmin, 
    isChecking, 
    error, 
    recheckStatus: () => checkAdminStatus({ showToastOnError: true }),
    forceRefreshAdminStatus,
    resetAllAdminCaches
  };
};
