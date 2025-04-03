
import React, { useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/providers/AuthProvider';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { createSuperAdmin } from '@/services/admin';

const AdminSettings = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [adminEmail, setAdminEmail] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [adminUsers, setAdminUsers] = React.useState<any[]>([]);
  
  useEffect(() => {
    // Fetch existing admin users
    const fetchAdminUsers = async () => {
      try {
        const { data, error } = await supabase
          .from('admin_users')
          .select('*, user_id');
          
        if (error) {
          console.error('Error fetching admin users:', error);
          return;
        }
        
        console.log('Admin users:', data);
        setAdminUsers(data || []);
      } catch (error) {
        console.error('Error fetching admin users:', error);
      }
    };
    
    fetchAdminUsers();
  }, []);
  
  const createFirstSuperAdmin = async () => {
    try {
      if (!adminEmail) {
        toast({
          title: "שגיאה",
          description: "יש להזין כתובת דוא״ל",
          variant: "destructive"
        });
        return;
      }
      
      setLoading(true);
      
      const result = await createSuperAdmin(adminEmail);
      
      if (!result.success) {
        throw new Error(result.message);
      }
      
      toast({
        title: "מנהל על נוצר בהצלחה",
        description: `משתמש ${adminEmail} הפך למנהל על`,
      });
      
      // Refresh admin users list
      const { data, error } = await supabase
        .from('admin_users')
        .select('*, user_id');
        
      if (!error && data) {
        setAdminUsers(data);
      }
      
      setAdminEmail('');
    } catch (error) {
      console.error('Error creating super admin:', error);
      toast({
        title: "שגיאה ביצירת מנהל על",
        description: error.message || "אירעה שגיאה בלתי צפויה",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <h1 className="text-3xl font-bold mb-6">הגדרות מערכת</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>ניהול מנהלי על</CardTitle>
            <CardDescription>הוספת מנהלי על חדשים למערכת</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  צור מנהל על חדש על ידי הזנת כתובת הדוא״ל שלו. המשתמש חייב להיות רשום במערכת.
                </p>
                <div className="flex items-center space-x-2">
                  <Input
                    placeholder="הזן כתובת דוא״ל"
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                  />
                  <Button 
                    onClick={createFirstSuperAdmin} 
                    disabled={loading || !adminEmail}
                  >
                    {loading ? 'יוצר...' : 'צור מנהל על'}
                  </Button>
                </div>
              </div>
              
              {adminUsers.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-md font-semibold mb-2">מנהלי על נוכחיים:</h3>
                  <ul className="space-y-1">
                    {adminUsers.map((admin) => (
                      <li key={admin.id} className="text-sm">
                        {admin.user_id} {admin.is_super_admin ? '(מנהל על)' : ''}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>מידע מערכת</CardTitle>
            <CardDescription>פרטי המערכת ומשתמש הנוכחי</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-1">
                <p className="text-sm font-medium">מזהה משתמש:</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{user?.id || 'לא מזוהה'}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">דוא״ל:</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{user?.email || 'לא מזוהה'}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">תאריך יצירה:</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {user?.created_at 
                    ? new Date(user.created_at).toLocaleDateString('he-IL')
                    : 'לא מזוהה'}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">גרסת מערכת:</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">1.0.0</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminSettings;
