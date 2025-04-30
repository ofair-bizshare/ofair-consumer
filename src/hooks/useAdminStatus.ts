
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/providers/AuthProvider';
import { checkIsSuperAdmin } from '@/services/admin/auth';
import { useToast } from '@/hooks/use-toast';
import { initializeAdminServices } from '@/services/admin/utils/adminInitializer';
import { getCachedAdminStatus, setCachedAdminStatus } from '@/services/admin/utils/adminCache';

export const useAdminStatus = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [bucketStatus, setBucketStatus] = useState<Record<string, boolean>>({});

  const checkAdminStatus = useCallback(async (showToastOnError = false) => {
    if (!user) {
      console.log('No user found, setting admin status to false');
      setIsAdmin(false);
      setIsChecking(false);
      setError(null);
      return;
    }
    
    try {
      console.log('Checking admin status for user:', user.id);
      setError(null);
      
      // Check cache first
      const cached = getCachedAdminStatus(user.id);
      if (cached && retryCount === 0) {
        console.log('Using cached admin status:', cached.isAdmin);
        setIsAdmin(cached.isAdmin);
        // Only rely on cache for the first check
        // We still continue with the full check to ensure everything is up to date
      }
      
      // Using the security definer function to check admin status
      const adminStatus = await checkIsSuperAdmin();
      console.log('Admin status check result:', adminStatus);
      setIsAdmin(adminStatus);
      
      // Update cache
      setCachedAdminStatus(user.id, adminStatus);
      
      if (adminStatus) {
        console.log('User confirmed as admin, initializing admin services...');
        // Initialize admin services
        const initResult = await initializeAdminServices();
        setIsInitialized(initResult.isInitialized);
        setBucketStatus(initResult.bucketStatus);
        
        if (!initResult.isInitialized && initResult.error) {
          console.error('Error initializing admin services:', initResult.error);
          if (showToastOnError) {
            toast({
              title: "שגיאה באתחול שירותי מנהל",
              description: initResult.error,
              variant: "destructive"
            });
          }
        }
      } else {
        console.log('User is not an admin');
        setIsInitialized(false);
      }
      
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
      
      // If we have attempted less than 3 times, retry after a delay
      if (retryCount < 2) {
        console.log(`Retrying admin check (attempt ${retryCount + 1})`);
        setTimeout(() => {
          setRetryCount(prev => prev + 1);
        }, 2000);
      }
    } finally {
      setIsChecking(false);
    }
  }, [user, toast, retryCount]);

  useEffect(() => {
    checkAdminStatus();
  }, [checkAdminStatus]);

  return { 
    isAdmin, 
    isChecking, 
    error,
    isInitialized,
    bucketStatus,
    recheckStatus: () => checkAdminStatus(true) 
  };
};
