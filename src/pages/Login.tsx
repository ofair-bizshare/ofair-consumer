
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
import { Separator } from "@/components/ui/separator";
import { PhoneIcon } from "lucide-react";

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

  const [phoneData, setPhoneData] = useState({
    phone: '',
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

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhoneData(prev => ({
      ...prev,
      phone: e.target.value
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
    
    // Store in localStorage for our demo
    localStorage.setItem('isLoggedIn', 'true');
    
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
    
    // Store in localStorage for our demo
    localStorage.setItem('isLoggedIn', 'true');
    
    toast({
      title: "ההרשמה בוצעה בהצלחה",
      description: "ברוך הבא ל-oFair",
    });
    
    navigate('/dashboard');
  };

  const handleGoogleLogin = () => {
    console.log('Google login clicked');
    
    // In a real implementation, you would initiate Google OAuth flow
    // For now, we'll simulate successful login
    localStorage.setItem('isLoggedIn', 'true');
    
    toast({
      title: "התחברות עם Google בוצעה בהצלחה",
      description: "ברוך הבא לחשבון שלך",
    });
    
    navigate('/dashboard');
  };

  const handlePhoneLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!phoneData.phone) {
      toast({
        title: "מספר טלפון חסר",
        description: "אנא הזן את מספר הטלפון שלך",
        variant: "destructive",
      });
      return;
    }
    
    // In a real implementation, you would send a verification code
    console.log('Phone authentication:', phoneData);
    
    toast({
      title: "קוד אימות נשלח",
      description: "נא להזין את הקוד שנשלח לטלפון שלך",
    });
    
    // For demo purposes, we'll simulate successful login
    setTimeout(() => {
      localStorage.setItem('isLoggedIn', 'true');
      
      toast({
        title: "התחברות בוצעה בהצלחה",
        description: "ברוך הבא לחשבון שלך",
      });
      
      navigate('/dashboard');
    }, 2000);
  };

  return (
    <div className="flex flex-col min-h-screen font-assistant" dir="rtl">
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
                <CardContent className="pt-6 space-y-4">
                  {/* Social login buttons */}
                  <div className="space-y-3">
                    <Button 
                      type="button"
                      variant="outline"
                      className="w-full bg-white hover:bg-gray-50 border border-gray-300 text-gray-800 flex items-center justify-center gap-2"
                      onClick={handleGoogleLogin}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5.36 14.8c-1.44 2.41-4.08 3.76-6.88 3.2-2.8-.56-5.12-2.72-5.84-5.48-.72-2.76-.04-5.76 1.84-7.72 1.88-1.96 4.68-2.72 7.24-1.92 1.2.36 2.28 1.04 3.12 1.96l-2.36 2.28c-1.4-1.32-3.6-1.4-5-0.12-1.52 1.4-1.84 3.52-0.88 5.24.96 1.72 2.92 2.68 4.84 2.2 1.48-.36 2.72-1.56 3.24-3.04H12v-3h8v1.2c0 1.96-.68 3.8-1.88 5.2l-0.76 1.4z"/>
                      </svg>
                      התחברות עם Google
                    </Button>

                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <Separator />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-background px-2 text-muted-foreground">
                          או התחברות עם דוא"ל
                        </span>
                      </div>
                    </div>
                  </div>

                  <form onSubmit={handleLogin}>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="login-email">דוא"ל</Label>
                        <Input 
                          id="login-email" 
                          name="email"
                          type="email" 
                          placeholder="הזן את כתובת הדואל שלך"
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
                      
                      <Button 
                        type="submit"
                        className="w-full bg-teal-500 hover:bg-teal-600 text-white"
                      >
                        התחברות
                      </Button>
                    </div>
                  </form>

                  <div className="relative pt-2">
                    <div className="absolute inset-0 flex items-center">
                      <Separator />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-background px-2 text-muted-foreground">
                        או התחברות עם טלפון
                      </span>
                    </div>
                  </div>

                  <form onSubmit={handlePhoneLogin} className="pt-2">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="login-phone">מספר טלפון</Label>
                        <div className="relative">
                          <PhoneIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                          <Input 
                            id="login-phone" 
                            name="phone"
                            type="tel" 
                            dir="ltr"
                            className="text-left pr-10"
                            placeholder="05X-XXX-XXXX"
                            value={phoneData.phone}
                            onChange={handlePhoneChange}
                          />
                        </div>
                      </div>
                      
                      <Button 
                        type="submit"
                        variant="outline"
                        className="w-full"
                      >
                        שלח קוד אימות
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </TabsContent>
              
              <TabsContent value="register">
                <CardContent className="pt-6 space-y-4">
                  {/* Social registration button */}
                  <div className="space-y-3">
                    <Button 
                      type="button"
                      variant="outline"
                      className="w-full bg-white hover:bg-gray-50 border border-gray-300 text-gray-800 flex items-center justify-center gap-2"
                      onClick={handleGoogleLogin}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5.36 14.8c-1.44 2.41-4.08 3.76-6.88 3.2-2.8-.56-5.12-2.72-5.84-5.48-.72-2.76-.04-5.76 1.84-7.72 1.88-1.96 4.68-2.72 7.24-1.92 1.2.36 2.28 1.04 3.12 1.96l-2.36 2.28c-1.4-1.32-3.6-1.4-5-0.12-1.52 1.4-1.84 3.52-0.88 5.24.96 1.72 2.92 2.68 4.84 2.2 1.48-.36 2.72-1.56 3.24-3.04H12v-3h8v1.2c0 1.96-.68 3.8-1.88 5.2l-0.76 1.4z"/>
                      </svg>
                      הרשמה עם Google
                    </Button>

                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <Separator />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-background px-2 text-muted-foreground">
                          או הרשמה עם דוא"ל
                        </span>
                      </div>
                    </div>
                  </div>

                  <form onSubmit={handleRegister}>
                    <div className="space-y-4">
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
                          placeholder="הזן את כתובת הדואל שלך"
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
                      
                      <Button 
                        type="submit"
                        className="w-full bg-teal-500 hover:bg-teal-600 text-white"
                      >
                        הרשמה
                      </Button>
                    </div>
                  </form>

                  <div className="relative pt-2">
                    <div className="absolute inset-0 flex items-center">
                      <Separator />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-background px-2 text-muted-foreground">
                        או הרשמה עם טלפון
                      </span>
                    </div>
                  </div>

                  <form onSubmit={handlePhoneLogin} className="pt-2">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="register-phone">מספר טלפון</Label>
                        <div className="relative">
                          <PhoneIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                          <Input 
                            id="register-phone" 
                            name="phone"
                            type="tel" 
                            dir="ltr"
                            className="text-left pr-10"
                            placeholder="05X-XXX-XXXX"
                            value={phoneData.phone}
                            onChange={handlePhoneChange}
                          />
                        </div>
                      </div>
                      
                      <Button 
                        type="submit"
                        variant="outline"
                        className="w-full"
                      >
                        שלח קוד אימות
                      </Button>
                    </div>
                  </form>
                </CardContent>
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
