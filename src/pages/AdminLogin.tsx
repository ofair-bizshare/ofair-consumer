
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { forceSetSuperAdmin } from '@/utils/admin/forceAdminUtils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { checkAdminStatusByEmail } from '@/utils/admin/diagnosticUtils';
import { supabase } from '@/integrations/supabase/client';
import { Shield, AlertTriangle } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const AdminLogin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emergencyEmail, setEmergencyEmail] = useState('');
  const [isEmergencyLoading, setIsEmergencyLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "שגיאה",
        description: "יש להזין דוא״ל וסיסמה",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setIsLoading(true);
      setErrorMessage(null);
      
      // Regular Supabase login
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) throw error;
      
      // Verify admin status
      const adminCheck = await checkAdminStatusByEmail(email);
      
      if (!adminCheck.success) {
        // User authenticated but not an admin
        toast({
          title: "אין הרשאות מנהל",
          description: adminCheck.message || "אין לך הרשאות מנהל למערכת",
          variant: "destructive"
        });
        
        setErrorMessage("המשתמש אינו מנהל במערכת. אם אתה אמור להיות מנהל, השתמש באפשרות השחזור למטה.");
        
        await supabase.auth.signOut();
        return;
      }
      
      toast({
        title: "התחברת בהצלחה",
        description: "מועבר לממשק ניהול...",
      });
      
      // Navigate to admin dashboard
      navigate('/admin');
      
    } catch (error) {
      console.error('Admin login error:', error);
      setErrorMessage(`שגיאה בהתחברות: ${(error as Error).message}`);
      
      toast({
        title: "שגיאה בהתחברות",
        description: (error as Error).message || "אירעה שגיאה, נסה שוב מאוחר יותר",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

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
        
        setEmail(emergencyEmail);
        setEmergencyEmail('');
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
                התחברות למערכת ניהול
              </CardTitle>
              <CardDescription>
                התחברות למערכת הניהול מוגבלת למנהלים בלבד
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              {errorMessage && (
                <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-4 text-red-700 text-sm">
                  <div className="flex items-start mb-1">
                    <AlertTriangle size={16} className="ml-1 mt-0.5 flex-shrink-0" />
                    <span className="font-semibold">שגיאה:</span>
                  </div>
                  <p>{errorMessage}</p>
                </div>
              )}
              
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium" htmlFor="email">
                    דוא״ל
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="הזן את כתובת הדוא״ל שלך"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium" htmlFor="password">
                    סיסמה
                  </label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="הזן את הסיסמה שלך"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? 'מתחבר...' : 'התחברות'}
                </Button>
              </form>
              
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">
                    או
                  </span>
                </div>
              </div>
              
              <div className="bg-amber-50 border border-amber-200 rounded-md p-4">
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
                      className="text-sm h-8"
                      required
                    />
                  </div>
                  
                  <Button
                    type="submit"
                    variant="outline"
                    size="sm"
                    className="w-full text-xs"
                    disabled={isEmergencyLoading}
                  >
                    {isEmergencyLoading ? 'מעבד...' : 'שחזר גישת מנהל על'}
                  </Button>
                </form>
              </div>
              
              <div className="mt-4 text-center">
                <button
                  onClick={() => navigate('/dashboard')}
                  className="text-sm text-blue-600 hover:underline"
                >
                  חזרה לדשבורד
                </button>
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
