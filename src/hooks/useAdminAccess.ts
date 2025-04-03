
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

  const checkAdminStatus = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return { hasAccess: false, needsLogin: true };
    }

    try {
      console.log("AdminAccess: Checking admin status for user:", user.id);
      
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
          return { hasAccess: false, notAdmin: true };
        }
      } catch (error) {
        console.error("AdminAccess: Error during admin check:", error);
        setAdminCheckError(error.message || "שגיאה לא ידועה");
        
        // Check if we have a cached admin status as fallback
        try {
          const cachedAdminStatus = localStorage.getItem(`adminStatus-${user.id}`);
          if (cachedAdminStatus) {
            const parsed = JSON.parse(cachedAdminStatus);
            if (parsed.timestamp > Date.now() - 3600000) { // Cache valid for 1 hour
              console.log("AdminAccess: Using cached admin status as fallback:", parsed.isAdmin);
              if (parsed.isAdmin) {
                setIsSuperAdmin(true);
                return { hasAccess: true, fromCache: true };
              }
            }
          }
        } catch (cacheError) {
          console.error('Error checking cached admin status:', cacheError);
        }
        
        return { hasAccess: false, error: error.message || "שגיאה לא ידועה" };
      }
    } catch (error) {
      console.error("AdminAccess: Error in admin access check:", error);
      setAdminCheckError(error.message || "שגיאה לא ידועה");
      return { hasAccess: false, error: error.message || "שגיאה לא ידועה" };
    }
  }, [user]);

  useEffect(() => {
    const runCheck = async () => {
      setLoading(true);
      await checkAdminStatus();
      setLoading(false);
    };
    
    runCheck();
  }, [checkAdminStatus]);

  return {
    isSuperAdmin,
    loading,
    adminCheckError,
    checkAdminStatus
  };
};
