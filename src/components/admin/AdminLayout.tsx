
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
import { checkIsSuperAdmin } from '@/services/admin';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSuperAdmin, setIsSuperAdmin] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const [adminCheckAttempted, setAdminCheckAttempted] = React.useState(false);

  React.useEffect(() => {
    const checkAdmin = async () => {
      if (adminCheckAttempted) {
        return; // Prevent multiple checks
      }
      
      setAdminCheckAttempted(true);
      
      try {
        console.log("AdminLayout: Starting admin check for user:", user?.id);
        
        if (!user || !user.id) {
          console.log("AdminLayout: No user found, redirecting to login");
          setLoading(false);
          toast({
            title: "אין גישה",
            description: "יש להתחבר תחילה",
            variant: "destructive"
          });
          navigate('/login', { state: { returnTo: window.location.pathname } });
          return;
        }

        // Add a timeout to ensure auth state is fully loaded
        console.log("AdminLayout: Waiting for auth state to stabilize before checking admin status");
        setTimeout(async () => {
          try {
            console.log("AdminLayout: Now checking admin status for user:", user.id);
            const isAdmin = await checkIsSuperAdmin();
            console.log("AdminLayout: Admin check result:", isAdmin);
            
            if (isAdmin) {
              console.log("AdminLayout: User confirmed as admin");
              setIsSuperAdmin(true);
              setLoading(false);
            } else {
              console.log("AdminLayout: User is not an admin:", user.id);
              setIsSuperAdmin(false);
              setLoading(false);
              
              toast({
                title: "אין גישה",
                description: "אין לך הרשאות מנהל למערכת",
                variant: "destructive"
              });
              navigate('/');
            }
          } catch (error) {
            console.error("AdminLayout: Error during admin check:", error);
            setLoading(false);
            toast({
              title: "שגיאה",
              description: "אירעה שגיאה בבדיקת הרשאות המנהל",
              variant: "destructive"
            });
            navigate('/');
          }
        }, 2000); // Increased timeout to ensure auth is fully loaded
      } catch (error) {
        console.error("AdminLayout: Error in admin access check:", error);
        setLoading(false);
        toast({
          title: "שגיאה",
          description: "אירעה שגיאה בבדיקת הרשאות המנהל",
          variant: "destructive"
        });
        navigate('/');
      }
    };
    
    checkAdmin();
  }, [user, navigate, toast, adminCheckAttempted]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
        <p className="ml-2 text-gray-600">בודק הרשאות מנהל...</p>
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
            <LogOut size={20} className="mr-2" />
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
