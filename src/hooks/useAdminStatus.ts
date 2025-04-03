
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/providers/AuthProvider';
import { checkIsSuperAdmin } from '@/services/admin/auth';
import { useToast } from '@/hooks/use-toast';

export const useAdminStatus = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const checkAdminStatus = useCallback(async (showToastOnError = false) => {
    if (!user) {
      setIsAdmin(false);
      setIsChecking(false);
      setError(null);
      return;
    }
    
    try {
      console.log(`Checking admin status (attempt ${retryCount + 1})...`);
      setError(null);
      
      // Try to get from cache first
      try {
        const cachedAdminStatus = localStorage.getItem(`adminStatus-${user.id}`);
        if (cachedAdminStatus) {
          const parsed = JSON.parse(cachedAdminStatus);
          if (parsed.timestamp > Date.now() - 3600000) { // 1 hour cache
            setIsAdmin(parsed.isAdmin);
            setIsChecking(false);
            console.log("Using cached admin status:", parsed.isAdmin);
            return;
          }
        }
      } catch (cacheError) {
        console.error('Error checking cached admin status:', cacheError);
      }
      
      // Using the security definer function
      const adminStatus = await checkIsSuperAdmin();
      console.log("Security definer function returned admin status:", adminStatus);
      setIsAdmin(adminStatus);
      
      // Update cache
      localStorage.setItem(`adminStatus-${user.id}`, JSON.stringify({
        isAdmin: adminStatus,
        timestamp: Date.now()
      }));
      
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
      
      // Try to fallback to cached status if available
      try {
        const cachedAdminStatus = localStorage.getItem(`adminStatus-${user.id}`);
        if (cachedAdminStatus) {
          const parsed = JSON.parse(cachedAdminStatus);
          console.log("Using cached status as fallback after error");
          setIsAdmin(parsed.isAdmin);
        } else {
          setIsAdmin(false);
        }
      } catch (cacheError) {
        console.error('Error with fallback cache:', cacheError);
        setIsAdmin(false);
      }
      
      // If we have attempted less than 3 times, retry after a delay
      if (retryCount < 2) {
        setTimeout(() => {
          setRetryCount(prev => prev + 1);
        }, 2000); // Retry after 2 seconds
      }
    } finally {
      setIsChecking(false);
    }
  }, [user, toast, retryCount]);

  useEffect(() => {
    checkAdminStatus();
  }, [checkAdminStatus]);

  return { isAdmin, isChecking, error, recheckStatus: () => checkAdminStatus(true) };
};
