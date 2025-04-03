
import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { useToast } from '@/hooks/use-toast';
import { createSuperAdmin } from '@/services/admin/auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { User, Shield, Settings, AlertTriangle, Check } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { checkAdminStatusByEmail } from '@/utils/adminUtils';

const AdminSettings = () => {
  const { toast } = useToast();
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentAdmins, setCurrentAdmins] = useState<{id: string, email: string, is_super_admin: boolean}[]>([]);
  const [loading, setLoading] = useState(true);
  const [diagnosticEmail, setDiagnosticEmail] = useState('');
  const [diagnosticResult, setDiagnosticResult] = useState<any>(null);
  const [diagnosticLoading, setDiagnosticLoading] = useState(false);

  useEffect(() => {
    fetchCurrentAdmins();
  }, []);

  const fetchCurrentAdmins = async () => {
    try {
      setLoading(true);
      
      try {
        // First get the admin users
        const { data: adminUsers, error: adminError } = await supabase
          .from('admin_users')
          .select('*');
          
        if (adminError) {
          console.error("Error fetching admin users:", adminError);
          
          // If we get a recursion error, show a more helpful message
          if (adminError.message.includes('recursion')) {
            toast({
              title: "שגיאת מדיניות גישה (RLS)",
              description: "נראה שיש בעיה במדיניות הגישה לטבלת admin_users. עיין בקונסול לפרטים נוספים.",
              variant: "destructive"
            });
          }
          
          setLoading(false);
          return;
        }

        if (!adminUsers || adminUsers.length === 0) {
          setCurrentAdmins([]);
          setLoading(false);
          return;
        }

        // Get the emails for each admin user
        const adminDetails = await Promise.all(
          adminUsers.map(async (admin) => {
            const { data: userProfile } = await supabase
              .from('user_profiles')
              .select('email')
              .eq('id', admin.user_id)
              .maybeSingle();
            
            return {
              id: admin.user_id,
              email: userProfile?.email || 'Unknown email',
              is_super_admin: admin.is_super_admin
            };
          })
        );
        
        setCurrentAdmins(adminDetails);
      } catch (error) {
        console.error("Error fetching admin users:", error);
        toast({
          title: "שגיאה בטעינת מנהלים",
          description: "לא ניתן לטעון את רשימת המנהלים. נסה שוב מאוחר יותר או בדוק את ההרשאות שלך.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error fetching current admins:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSuperAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newAdminEmail || !newAdminEmail.includes('@')) {
      toast({
        title: "שגיאה",
        description: "יש להזין כתובת דוא״ל תקינה",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      const result = await createSuperAdmin(newAdminEmail);
      
      if (result.success) {
        toast({
          title: "מנהל על נוסף בהצלחה",
          description: result.message || `${newAdminEmail} נוסף כמנהל על במערכת`,
        });
        setNewAdminEmail('');
        fetchCurrentAdmins(); // Refresh list after adding
      } else {
        toast({
          title: "שגיאה בהוספת מנהל על",
          description: result.message || "אירעה שגיאה בהוספת המנהל",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error adding super admin:", error);
      toast({
        title: "שגיאה בהוספת מנהל על",
        description: "אירעה שגיאה בלתי צפויה",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const runAdminDiagnostic = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!diagnosticEmail || !diagnosticEmail.includes('@')) {
      toast({
        title: "שגיאה",
        description: "יש להזין כתובת דוא״ל תקינה לבדיקה",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setDiagnosticLoading(true);
      setDiagnosticResult(null);
      
      const result = await checkAdminStatusByEmail(diagnosticEmail);
      setDiagnosticResult(result);
      
      if (result.success) {
        toast({
          title: "בדיקת סטטוס מנהל הושלמה",
          description: result.message,
        });
      } else {
        toast({
          title: "המשתמש אינו מנהל",
          description: result.message,
          variant: "default"
        });
      }
    } catch (error) {
      console.error("Error checking admin status:", error);
      setDiagnosticResult({
        success: false,
        message: `שגיאה בבדיקת סטטוס מנהל: ${(error as Error).message}`
      });
      
      toast({
        title: "שגיאה בבדיקת סטטוס מנהל",
        description: "אירעה שגיאה בלתי צפויה",
        variant: "destructive"
      });
    } finally {
      setDiagnosticLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold">הגדרות מערכת</h1>
        <p className="text-gray-600 mt-1">ניהול הגדרות מערכת והרשאות</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="ml-2 h-5 w-5 text-blue-500" />
              ניהול מנהלים
            </CardTitle>
            <CardDescription>הוספת מנהלי על חדשים למערכת</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddSuperAdmin} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="admin-email">
                  דוא״ל המנהל החדש
                </label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 rounded-r-md border border-l-0 border-gray-300 bg-gray-50 text-gray-500">
                    <User size={18} />
                  </span>
                  <Input
                    id="admin-email"
                    type="email"
                    placeholder="הזן כתובת דוא״ל"
                    value={newAdminEmail}
                    onChange={(e) => setNewAdminEmail(e.target.value)}
                    className="rounded-r-none"
                    required
                  />
                </div>
                <p className="text-xs text-gray-500">
                  המשתמש חייב להיות קיים במערכת כדי להפוך אותו למנהל על
                </p>
              </div>
              
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'מוסיף...' : 'הוסף מנהל על'}
              </Button>
            </form>

            <div className="mt-6">
              <h3 className="text-md font-semibold mb-2">מנהלי מערכת נוכחיים:</h3>
              {loading ? (
                <p>טוען...</p>
              ) : currentAdmins.length > 0 ? (
                <ul className="space-y-2">
                  {currentAdmins.map(admin => (
                    <li key={admin.id} className="p-2 bg-gray-50 rounded flex justify-between items-center">
                      <span>{admin.email}</span>
                      <span className={`text-xs px-2 py-1 rounded-full ${admin.is_super_admin ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                        {admin.is_super_admin ? 'מנהל על' : 'מנהל רגיל'}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">לא נמצאו מנהלים במערכת</p>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertTriangle className="ml-2 h-5 w-5 text-amber-500" />
              כלי אבחון ותמיכה
            </CardTitle>
            <CardDescription>בדיקת סטטוס מנהלים במערכת</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={runAdminDiagnostic} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="diagnostic-email">
                  בדיקת סטטוס מנהל לפי דוא"ל
                </label>
                <div className="flex">
                  <Input
                    id="diagnostic-email"
                    type="email"
                    placeholder="הזן כתובת דוא״ל לבדיקה"
                    value={diagnosticEmail}
                    onChange={(e) => setDiagnosticEmail(e.target.value)}
                    required
                  />
                  <Button 
                    type="submit" 
                    disabled={diagnosticLoading} 
                    className="mr-2"
                  >
                    {diagnosticLoading ? 'בודק...' : 'בדוק סטטוס'}
                  </Button>
                </div>
              </div>
            </form>

            {diagnosticResult && (
              <div className={`mt-4 p-3 rounded-md ${diagnosticResult.success ? 'bg-green-50 border border-green-200' : 'bg-amber-50 border border-amber-200'}`}>
                <div className="flex items-start">
                  <div className={`p-1 rounded-full mr-2 ${diagnosticResult.success ? 'bg-green-100' : 'bg-amber-100'}`}>
                    {diagnosticResult.success ? (
                      <Check className="h-5 w-5 text-green-600" />
                    ) : (
                      <AlertTriangle className="h-5 w-5 text-amber-600" />
                    )}
                  </div>
                  <div>
                    <h4 className={`font-medium ${diagnosticResult.success ? 'text-green-800' : 'text-amber-800'}`}>
                      {diagnosticResult.success ? 'המשתמש הוא מנהל' : 'המשתמש אינו מנהל'}
                    </h4>
                    <p className="text-sm mt-1">{diagnosticResult.message}</p>
                    
                    {diagnosticResult.details && (
                      <div className="mt-2 text-xs p-2 bg-white rounded">
                        <pre className="font-mono whitespace-pre-wrap overflow-x-auto">
                          {JSON.stringify(diagnosticResult.details, null, 2)}
                        </pre>
                      </div>
                    )}
                    
                    {!diagnosticResult.success && (
                      <div className="mt-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setNewAdminEmail(diagnosticEmail);
                            toast({
                              title: "הועתק לטופס הוספת מנהל",
                              description: "כעת לחץ על כפתור 'הוסף מנהל על' כדי להוסיף את המשתמש כמנהל",
                            });
                          }}
                        >
                          הוסף כמנהל על
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
            
            <div className="mt-6 p-3 bg-blue-50 rounded-md border border-blue-200">
              <h4 className="font-medium text-blue-800 mb-2">פתרון בעיות גישת מנהל</h4>
              <ul className="text-sm space-y-2">
                <li className="flex items-start">
                  <span className="ml-2">•</span>
                  <span>אם אתה נתקל בבעיות גישה למערכת הניהול, בדוק את הדוא"ל שלך עם כלי האבחון למעלה.</span>
                </li>
                <li className="flex items-start">
                  <span className="ml-2">•</span>
                  <span>לשחזור חירום של גישת מנהל, השתמש בקונסול הדפדפן והרץ את הפקודה: <code className="bg-blue-100 px-1 py-0.5 rounded text-xs">forceSetSuperAdmin('email@example.com')</code></span>
                </li>
                <li className="flex items-start">
                  <span className="ml-2">•</span>
                  <span>נסה להתנתק ולהתחבר מחדש אם השינויים בהרשאות לא מופיעים מיד.</span>
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Settings className="ml-2 h-5 w-5 text-blue-500" />
              הגדרות מערכת
            </CardTitle>
            <CardDescription>הגדרות כלליות של המערכת</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-500 text-center py-8">
              הגדרות נוספות יתווספו בקרוב
            </p>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminSettings;
