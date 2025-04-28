
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
      console.log(`Checking admin status for user ${user.id} (attempt ${retryCount + 1})...`);
      setError(null);
      
      // Using the security definer function to check admin status
      const adminStatus = await checkIsSuperAdmin();
      console.log("Admin status check result:", adminStatus);
      setIsAdmin(adminStatus);
      
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
