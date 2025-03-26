
import React, { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const Login = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const fromRequest = location.state?.fromRequest;
  
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });
  
  const [registerData, setRegisterData] = useState({
    name: '',
    email: '',
    password: '',
    passwordConfirm: '',
    agreeTerms: false,
  });
  
  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setLoginData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  const handleRegisterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setRegisterData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!loginData.email || !loginData.password) {
      toast({
        title: "שדות חסרים",
        description: "אנא מלא את כל השדות הנדרשים",
        variant: "destructive",
      });
      return;
    }
    
    // Here you would normally authenticate the user
    console.log('Login data:', loginData);
    
    toast({
      title: "כניסה בוצעה בהצלחה",
      description: "ברוך הבא לחשבון שלך",
    });
    
    navigate('/dashboard');
  };
  
  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!registerData.name || !registerData.email || !registerData.password || !registerData.passwordConfirm) {
      toast({
        title: "שדות חסרים",
        description: "אנא מלא את כל השדות הנדרשים",
        variant: "destructive",
      });
      return;
    }
    
    if (registerData.password !== registerData.passwordConfirm) {
      toast({
        title: "סיסמאות לא תואמות",
        description: "אנא ודא שהסיסמאות שהזנת זהות",
        variant: "destructive",
      });
      return;
    }
    
    if (!registerData.agreeTerms) {
      toast({
        title: "תנאי שימוש",
        description: "עליך לאשר את תנאי השימוש כדי להמשיך",
        variant: "destructive",
      });
      return;
    }
    
    // Here you would normally register the user
    console.log('Register data:', registerData);
    
    toast({
      title: "ההרשמה בוצעה בהצלחה",
      description: "ברוך הבא ל-oFair",
    });
    
    navigate('/dashboard');
  };

  return (
    <div className="flex flex-col min-h-screen" dir="rtl">
      <Header />
      
      <main className="flex-grow pt-28 pb-16 flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          {fromRequest && (
            <div className="bg-teal-50 border border-teal-200 rounded-lg p-4 mb-6 text-teal-700 text-sm animate-fade-in-down">
              <p className="font-medium">בקשתך נשלחה בהצלחה!</p>
              <p>כדי לצפות בהצעות המחיר שתקבל, יש להתחבר או להירשם לחשבון.</p>
            </div>
          )}
          
          <Card className="glass-card shadow-xl animate-fade-in-up">
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid grid-cols-2 w-full">
                <TabsTrigger value="login">התחברות</TabsTrigger>
                <TabsTrigger value="register">הרשמה</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login">
                <form onSubmit={handleLogin}>
                  <CardContent className="pt-6 space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="login-email">דוא"ל</Label>
                      <Input 
                        id="login-email" 
                        name="email"
                        type="email" 
                        placeholder="הזן את כתובת הדוא"ל שלך"
                        value={loginData.email}
                        onChange={handleLoginChange}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <Label htmlFor="login-password">סיסמה</Label>
                        <Link to="/forgot-password" className="text-xs text-teal-500 hover:text-teal-600">
                          שכחת סיסמה?
                        </Link>
                      </div>
                      <Input 
                        id="login-password" 
                        name="password"
                        type="password" 
                        placeholder="הזן את הסיסמה שלך"
                        value={loginData.password}
                        onChange={handleLoginChange}
                      />
                    </div>
                    
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <Checkbox 
                        id="remember-me" 
                        name="rememberMe"
                        checked={loginData.rememberMe}
                        onCheckedChange={(checked) => 
                          setLoginData(prev => ({ ...prev, rememberMe: checked === true }))
                        }
                      />
                      <Label htmlFor="remember-me" className="text-sm cursor-pointer">
                        זכור אותי
                      </Label>
                    </div>
                  </CardContent>
                  
                  <CardFooter>
                    <Button 
                      type="submit"
                      className="w-full bg-teal-500 hover:bg-teal-600 text-white"
                    >
                      התחברות
                    </Button>
                  </CardFooter>
                </form>
              </TabsContent>
              
              <TabsContent value="register">
                <form onSubmit={handleRegister}>
                  <CardContent className="pt-6 space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="register-name">שם מלא</Label>
                      <Input 
                        id="register-name" 
                        name="name"
                        placeholder="הזן את שמך המלא"
                        value={registerData.name}
                        onChange={handleRegisterChange}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="register-email">דוא"ל</Label>
                      <Input 
                        id="register-email" 
                        name="email"
                        type="email" 
                        placeholder="הזן את כתובת הדוא"ל שלך"
                        value={registerData.email}
                        onChange={handleRegisterChange}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="register-password">סיסמה</Label>
                      <Input 
                        id="register-password" 
                        name="password"
                        type="password" 
                        placeholder="בחר סיסמה (לפחות 8 תווים)"
                        value={registerData.password}
                        onChange={handleRegisterChange}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="register-password-confirm">אימות סיסמה</Label>
                      <Input 
                        id="register-password-confirm" 
                        name="passwordConfirm"
                        type="password" 
                        placeholder="הזן שוב את הסיסמה"
                        value={registerData.passwordConfirm}
                        onChange={handleRegisterChange}
                      />
                    </div>
                    
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <Checkbox 
                        id="agree-terms" 
                        name="agreeTerms"
                        checked={registerData.agreeTerms}
                        onCheckedChange={(checked) => 
                          setRegisterData(prev => ({ ...prev, agreeTerms: checked === true }))
                        }
                      />
                      <Label htmlFor="agree-terms" className="text-sm cursor-pointer">
                        אני מסכים/ה ל
                        <Link to="/terms" className="text-teal-500 mx-1 hover:underline">
                          תנאי השימוש
                        </Link>
                        ול
                        <Link to="/privacy" className="text-teal-500 mx-1 hover:underline">
                          מדיניות הפרטיות
                        </Link>
                      </Label>
                    </div>
                  </CardContent>
                  
                  <CardFooter>
                    <Button 
                      type="submit"
                      className="w-full bg-teal-500 hover:bg-teal-600 text-white"
                    >
                      הרשמה
                    </Button>
                  </CardFooter>
                </form>
              </TabsContent>
            </Tabs>
          </Card>
          
          <div className="text-center mt-6 text-gray-600 text-sm">
            <p>
              הנך בעל מקצוע?
              <a 
                href="https://biz.ofair.co.il" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-700 mr-1 hover:underline"
              >
                לחץ כאן
              </a>
              להרשמה כנותן שירות
            </p>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Login;
