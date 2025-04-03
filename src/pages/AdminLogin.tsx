
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { forceSetSuperAdmin } from '@/utils/admin/forceAdminUtils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { checkIsSuperAdmin } from '@/services/admin/auth';
import { useAuth } from '@/providers/AuthProvider';
import { Shield, AlertTriangle } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const AdminLogin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [emergencyEmail, setEmergencyEmail] = useState('');
  const [isEmergencyLoading, setIsEmergencyLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check if the user is already an admin
  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }
      
      try {
        const isAdmin = await checkIsSuperAdmin();
        if (isAdmin) {
          // User is already an admin, redirect to admin dashboard
          toast({
            title: "כבר מחובר כמנהל",
            description: "מועבר לממשק ניהול...",
          });
          navigate('/admin');
        }
      } catch (error) {
        console.error('Error checking admin status:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAdminStatus();
  }, [user, navigate, toast]);

  const handleEmergencyAccess = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!emergencyEmail) {
      toast({
        title: "שגיאה",
        description: "יש להזין דוא״ל",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setIsEmergencyLoading(true);
      
      // Try to set super admin status
      const result = await forceSetSuperAdmin(emergencyEmail);
      
      if (result.success) {
        toast({
          title: "הוגדר בהצלחה",
          description: result.message || "הוגדרת בהצלחה כמנהל על, נא להתחבר",
        });
        
        setEmergencyEmail('');
        
        // If the current user's email matches, redirect to admin
        if (user && user.email === emergencyEmail) {
          navigate('/admin');
        }
      } else {
        toast({
          title: "שגיאה בהגדרת הרשאות",
          description: result.message || "שגיאה בהגדרת הרשאות מנהל על",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Emergency access error:', error);
      
      toast({
        title: "שגיאה",
        description: (error as Error).message || "אירעה שגיאה, נסה שוב מאוחר יותר",
        variant: "destructive"
      });
    } finally {
      setIsEmergencyLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
        <p className="mr-2 text-gray-600">בודק הרשאות מנהל...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen" dir="rtl">
      <Header />
      
      <main className="flex-grow pt-28 pb-16 flex items-center justify-center">
        <div className="w-full max-w-md px-4">
          <h1 className="text-3xl font-bold text-center mb-8">
            <span className="text-blue-700">ממשק</span> <span className="text-[#00D09E]">ניהול</span>
          </h1>
          
          <Card className="w-full shadow-lg border-t-4 border-blue-600">
            <CardHeader>
              <CardTitle className="text-xl flex items-center">
                <Shield className="ml-2 h-5 w-5 text-blue-500" />
                שחזור גישת מנהל
              </CardTitle>
              <CardDescription>
                השתמש בטופס זה לשחזור גישת מנהל (סופר אדמין) במקרה של בעיות הרשאה
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <div className="bg-amber-50 border border-amber-200 rounded-md p-4 mb-6">
                <h3 className="text-sm font-semibold mb-2 text-amber-800 flex items-center">
                  <AlertTriangle size={16} className="ml-1" />
                  שחזור גישת מנהל חירום
                </h3>
                
                <p className="text-xs text-amber-700 mb-3">
                  השתמש באפשרות זו רק אם אתה מתקשה להתחבר עקב בעיות RLS או הרשאות אחרות במערכת
                </p>
                
                <form onSubmit={handleEmergencyAccess} className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-xs font-medium" htmlFor="emergency-email">
                      דוא״ל לשחזור הרשאות מנהל
                    </label>
                    <Input
                      id="emergency-email"
                      type="email"
                      placeholder="הזן את כתובת הדוא״ל שלך"
                      value={emergencyEmail}
                      onChange={(e) => setEmergencyEmail(e.target.value)}
                      className="text-sm"
                      required
                    />
                  </div>
                  
                  <Button
                    type="submit"
                    variant="outline"
                    className="w-full"
                    disabled={isEmergencyLoading}
                  >
                    {isEmergencyLoading ? 'מעבד...' : 'שחזר גישת מנהל על'}
                  </Button>
                </form>
              </div>
              
              <div className="mt-4 text-center">
                <Button
                  onClick={() => navigate('/dashboard')}
                  variant="ghost"
                  className="text-sm text-blue-600 hover:underline"
                >
                  חזרה לדשבורד
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default AdminLogin;
