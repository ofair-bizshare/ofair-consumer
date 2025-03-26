
import React, { useState } from 'react';
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
