import React from 'react';
import { useAuth } from '@/providers/AuthProvider';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  MessageSquare, 
  Settings,
  LogOut
} from 'lucide-react';
import AdminNavLink from './AdminNavLink';
import { checkIsSuperAdmin } from '@/services/admin/auth';
import { forceSetSuperAdmin } from '@/utils/adminUtils';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSuperAdmin, setIsSuperAdmin] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const [adminCheckError, setAdminCheckError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const checkAdmin = async () => {
      try {
        if (!user) {
          console.log("AdminLayout: No user found, redirecting to login");
          setLoading(false);
          toast({
            title: "אין גישה",
            description: "יש להתחבר תחילה",
            variant: "destructive"
          });
          navigate('/admin-login', { state: { returnTo: window.location.pathname } });
          return;
        }

        console.log("AdminLayout: Checking admin status for user:", user.id);
        
        try {
          // First try using the cached admin status
          try {
            const cachedAdminStatus = localStorage.getItem(`adminStatus-${user.id}`);
            if (cachedAdminStatus) {
              const parsed = JSON.parse(cachedAdminStatus);
              if (parsed.timestamp > Date.now() - 3600000) { // Cache valid for 1 hour
                console.log("AdminLayout: Using cached admin status:", parsed.isAdmin);
                if (parsed.isAdmin) {
                  setIsSuperAdmin(true);
                  setLoading(false);
                  return;
                }
              }
            }
          } catch (cacheError) {
            console.error('Error checking cached admin status:', cacheError);
          }
          
          const isAdmin = await checkIsSuperAdmin();
          console.log("AdminLayout: Admin check result:", isAdmin);
          
          if (isAdmin) {
            console.log("AdminLayout: User confirmed as admin");
            setIsSuperAdmin(true);
          } else {
            console.log("AdminLayout: User is not an admin:", user.id);
            setIsSuperAdmin(false);
            
            toast({
              title: "אין גישה",
              description: "אין לך הרשאות מנהל למערכת",
              variant: "destructive"
            });
            navigate('/admin-login');
          }
        } catch (error) {
          console.error("AdminLayout: Error during admin check:", error);
          setAdminCheckError(error.message || "שגיאה לא ידועה");
          
          toast({
            title: "שגיאה",
            description: "אירעה שגיאה בבדיקת הרשאות המנהל",
            variant: "destructive"
          });
        }
      } catch (error) {
        console.error("AdminLayout: Error in admin access check:", error);
        setAdminCheckError(error.message || "שגיאה לא ידועה");
        
        toast({
          title: "שגיאה",
          description: "אירעה שגיאה בבדיקת הרשאות המנהל",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    checkAdmin();
  }, [user, navigate, toast]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
        <p className="mr-2 text-gray-600">בודק הרשאות מנהל...</p>
      </div>
    );
  }

  // Show error message with emergency recovery option
  if (adminCheckError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6 max-w-md w-full text-center">
          <h1 className="text-2xl font-bold text-red-700 mb-4">שגיאת בדיקת הרשאות</h1>
          <p className="text-gray-800 mb-4">התרחשה שגיאה במדיניות גישה (RLS) לטבלת admin_users:</p>
          <p className="bg-red-100 p-2 rounded text-red-800 mb-6 text-sm font-mono">infinite recursion detected in policy for relation "admin_users"</p>
          
          {user && (
            <div className="mb-6">
              <p className="font-bold mb-2">פעולות אפשריות לשחזור גישה:</p>
              <ol className="text-left text-sm space-y-2">
                <li>1. נסה להתנתק ולהתחבר מחדש דרך <a href="/admin-login" className="text-blue-600 underline">דף התחברות הניהול</a></li>
                <li>2. השתמש באפשרות שחזור חירום בדף ההתחברות</li>
                <li>3. בצע את הפקודה הבאה במסד הנתונים כדי לתקן את בעיית ה-RLS:</li>
                <li className="font-mono text-xs bg-gray-100 p-2 rounded">
                  {`
-- Drop existing policies
DROP POLICY IF EXISTS "Allow all operations for own records" ON public.admin_users;

-- Create separate policies using security definer functions
CREATE OR REPLACE FUNCTION public.check_is_super_admin(user_id_param UUID)
RETURNS BOOLEAN
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE user_id = user_id_param AND is_super_admin = true
  );
END;
$$;
                  `}
                </li>
              </ol>
            </div>
          )}
          
          <div className="flex justify-center space-x-3">
            <button
              onClick={() => navigate('/admin-login')}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              לדף התחברות מנהל
            </button>
            
            <button
              onClick={() => navigate('/dashboard')}
              className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
            >
              חזרה לדשבורד
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!user || !isSuperAdmin) {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-gray-800 shadow-md">
        <div className="p-4 border-b dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">ניהול מערכת</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">ממשק סופר אדמין</p>
        </div>
        
        <nav className="p-4">
          <ul className="space-y-2">
            <AdminNavLink to="/admin" icon={<LayoutDashboard size={20} />} text="דשבורד" exact />
            <AdminNavLink to="/admin/professionals" icon={<Users size={20} />} text="בעלי מקצוע" />
            <AdminNavLink to="/admin/articles" icon={<FileText size={20} />} text="מאמרים" />
            <AdminNavLink to="/admin/messages" icon={<MessageSquare size={20} />} text="הודעות" />
            <AdminNavLink to="/admin/settings" icon={<Settings size={20} />} text="הגדרות" />
          </ul>
        </nav>
        
        <div className="absolute bottom-0 w-64 p-4 border-t dark:border-gray-700">
          <button 
            onClick={() => signOut()}
            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700 rounded-md"
          >
            <LogOut size={20} className="ml-2" />
            <span>התנתק</span>
          </button>
        </div>
      </aside>
      
      {/* Main content */}
      <main className="flex-1 p-6 overflow-y-auto">
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;
