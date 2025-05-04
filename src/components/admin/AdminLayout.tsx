
import React from 'react';
import { useAuth } from '@/providers/AuthProvider';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import AdminSidebar from './AdminSidebar';
import AdminLoadingState from './AdminLoadingState';
import AdminErrorState from './AdminErrorState';
import { useAdminAccess } from '@/hooks/useAdminAccess';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isSuperAdmin, loading, adminCheckError, checkAdminStatus } = useAdminAccess();

  React.useEffect(() => {
    const validateAccess = async () => {
      const result = await checkAdminStatus();
      
      if (!result.hasAccess) {
        if (result.needsLogin) {
          console.log("AdminLayout: No user found, redirecting to login");
          toast({
            title: "נדרשת התחברות",
            description: "יש להתחבר תחילה למערכת",
            variant: "destructive"
          });
          navigate('/login', { state: { returnTo: window.location.pathname } });
        } else if (result.notAdmin) {
          console.log("AdminLayout: User is not an admin, redirecting to dashboard");
          toast({
            title: "אין גישה",
            description: "אין לך הרשאות מנהל למערכת",
            variant: "destructive"
          });
          navigate('/dashboard');
        } else if (result.error) {
          console.log("AdminLayout: Error checking admin status:", result.error);
          // Error is already set in the hook
        }
      }
    };
    
    validateAccess();
  }, [checkAdminStatus, navigate, toast]);

  if (loading) {
    return <AdminLoadingState />;
  }

  if (adminCheckError) {
    return <AdminErrorState errorMessage={adminCheckError} />;
  }

  if (!user || !isSuperAdmin) {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
      <AdminSidebar onSignOut={signOut} />
      
      {/* Main content */}
      <main className="flex-1 p-6 overflow-y-auto">
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;
