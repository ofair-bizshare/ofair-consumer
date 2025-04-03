
import { useState, useEffect } from 'react';
import { useAuth } from '@/providers/AuthProvider';
import { checkIsSuperAdmin } from '@/services/admin/auth';

export const useAdminStatus = () => {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user) {
        setIsAdmin(false);
        setIsChecking(false);
        return;
      }
      
      try {
        try {
          const cachedAdminStatus = localStorage.getItem(`adminStatus-${user.id}`);
          if (cachedAdminStatus) {
            const parsed = JSON.parse(cachedAdminStatus);
            if (parsed.timestamp > Date.now() - 3600000) {
              setIsAdmin(parsed.isAdmin);
              setIsChecking(false);
              return;
            }
          }
        } catch (cacheError) {
          console.error('Error checking cached admin status:', cacheError);
        }
        
        const adminStatus = await checkIsSuperAdmin();
        setIsAdmin(adminStatus);
        
        localStorage.setItem(`adminStatus-${user.id}`, JSON.stringify({
          isAdmin: adminStatus,
          timestamp: Date.now()
        }));
      } catch (error) {
        console.error('Error checking admin status:', error);
        setIsAdmin(false);
      } finally {
        setIsChecking(false);
      }
    };
    
    checkAdminStatus();
  }, [user]);

  return { isAdmin, isChecking };
};
