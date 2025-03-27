import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import LoginForm from '@/components/auth/LoginForm';
import RegisterForm from '@/components/auth/RegisterForm';
import SuccessAlert from '@/components/auth/SuccessAlert';
import BusinessSignUpLink from '@/components/auth/BusinessSignUpLink';
import { useAuth } from '@/providers/AuthProvider';
import PhoneVerification from '@/components/auth/PhoneVerification';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { PhoneIcon } from 'lucide-react';

const Login = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, loading, phoneVerified, signIn, signUp, signInWithGoogle, signInWithPhone, checkPhoneVerification } = useAuth();
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
    phone: '',
  });

  const [phoneData, setPhoneData] = useState({
    phone: '',
  });

  const [needsPhoneVerification, setNeedsPhoneVerification] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      if (!loading && user) {
        const hasPhoneVerified = await checkPhoneVerification();
        
        if (!hasPhoneVerified) {
          setNeedsPhoneVerification(true);
        } else {
          navigate('/dashboard');
        }
      }
    };
    
    checkAuth();
  }, [user, loading, phoneVerified, navigate, checkPhoneVerification]);
  
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
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!loginData.email || !loginData.password) {
      toast({
        title: "שדות חסרים",
        description: "אנא מלא את כל השדות הנדרשים",
        variant: "destructive",
      });
      return;
    }
    
    const { error } = await signIn(loginData.email, loginData.password);
    
    if (!error) {
      toast({
        title: "כניסה בוצעה בהצלחה",
        description: "ברוך הבא לחשבון שלך",
      });
      navigate('/dashboard');
    }
  };
  
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!registerData.name || !registerData.email || !registerData.password || !registerData.passwordConfirm || !registerData.phone) {
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

    const { error } = await signUp(registerData.email, registerData.password, {
      name: registerData.name,
      phone: registerData.phone,
    });
    
    if (!error) {
      toast({
        title: "ההרשמה בוצעה בהצלחה",
        description: "ברוך הבא ל-oFair",
      });
      
      toast({
        title: "אימות דוא\"ל",
        description: "נשלח אליך דוא\"ל לאימות חשבונך. אנא בדוק את תיבת הדואר שלך.",
      });
    }
  };

  const handleGoogleLogin = async () => {
    await signInWithGoogle();
  };

  const handlePhoneLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!phoneData.phone) {
      toast({
        title: "מספר טלפון חסר",
        description: "אנא הזן את מספר הטלפון שלך",
        variant: "destructive",
      });
      return;
    }
    
    const { error } = await signInWithPhone(phoneData.phone);
    
    if (!error) {
      toast({
        title: "קוד אימות נשלח",
        description: "נא להזין את הקוד שנשלח לטלפון שלך",
      });
      navigate('/dashboard');
    }
  };

  const handlePhoneVerificationComplete = () => {
    navigate('/dashboard');
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>;
  }

  if (user && needsPhoneVerification) {
    return (
      <div className="flex flex-col min-h-screen font-assistant" dir="rtl">
        <Header />
        
        <main className="flex-grow pt-28 pb-16 flex items-center justify-center px-4">
          <div className="w-full max-w-md">
            <Card className="glass-card shadow-xl animate-fade-in-up p-6">
              <h2 className="text-xl font-bold text-center mb-4">אימות מספר טלפון</h2>
              <p className="text-center mb-6">כדי להמשיך להשתמש באפליקציה, אנא אמת את מספר הטלפון שלך</p>
              
              <div className="space-y-4">
                <Label htmlFor="phone-for-verification">מספר טלפון</Label>
                <div className="relative">
                  <PhoneIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                  <Input 
                    id="phone-for-verification" 
                    name="phone"
                    type="tel" 
                    dir="ltr"
                    className="text-left pr-10"
                    placeholder="05X-XXX-XXXX"
                    value={phoneData.phone}
                    onChange={handlePhoneChange}
                  />
                </div>
                
                <Button 
                  onClick={handlePhoneLogin}
                  type="button"
                  className="w-full bg-teal-500 hover:bg-teal-600 text-white"
                >
                  שלח קוד אימות
                </Button>
              </div>
              
              {phoneData.phone && (
                <div className="mt-6">
                  <PhoneVerification 
                    phone={phoneData.phone} 
                    onVerified={handlePhoneVerificationComplete}
                    isPostLogin={true}
                  />
                </div>
              )}
            </Card>
          </div>
        </main>
        
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen font-assistant" dir="rtl">
      <Header />
      
      <main className="flex-grow pt-28 pb-16 flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          {fromRequest && (
            <SuccessAlert 
              message="בקשתך נשלחה בהצלחה!" 
              submessage="כדי לצפות בהצעות המחיר שתקבל, יש להתחבר או להירשם לחשבון."
            />
          )}
          
          <Card className="glass-card shadow-xl animate-fade-in-up">
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid grid-cols-2 w-full">
                <TabsTrigger value="login">התחברות</TabsTrigger>
                <TabsTrigger value="register">הרשמה</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login" className="pt-6 p-6 space-y-4">
                <LoginForm 
                  loginData={loginData}
                  phoneData={phoneData}
                  handleLoginChange={handleLoginChange}
                  handlePhoneChange={handlePhoneChange}
                  handleLogin={handleLogin}
                  handlePhoneLogin={handlePhoneLogin}
                  handleGoogleLogin={handleGoogleLogin}
                />
              </TabsContent>
              
              <TabsContent value="register" className="pt-6 p-6 space-y-4">
                <RegisterForm 
                  registerData={registerData}
                  phoneData={phoneData}
                  handleRegisterChange={handleRegisterChange}
                  handlePhoneChange={handlePhoneChange}
                  handleRegister={handleRegister}
                  handlePhoneLogin={handlePhoneLogin}
                  handleGoogleLogin={handleGoogleLogin}
                />
              </TabsContent>
            </Tabs>
          </Card>
          
          <BusinessSignUpLink />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Login;
