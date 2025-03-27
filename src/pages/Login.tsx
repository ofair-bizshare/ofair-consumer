
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import LoginForm from '@/components/auth/LoginForm';
import RegisterForm from '@/components/auth/RegisterForm';
import SuccessAlert from '@/components/auth/SuccessAlert';
import BusinessSignUpLink from '@/components/auth/BusinessSignUpLink';
import { useAuth } from '@/providers/AuthProvider';
import PhoneVerificationForm from '@/components/auth/PhoneVerificationForm';
import { useLoginForm } from '@/hooks/useLoginForm';
import { useRegisterForm } from '@/hooks/useRegisterForm';

const Login = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, loading, phoneVerified, signInWithPhone, checkPhoneVerification } = useAuth();
  const fromRequest = location.state?.fromRequest;
  
  const [needsPhoneVerification, setNeedsPhoneVerification] = useState(false);
  const {
    loginData,
    phoneData,
    showPhoneVerification,
    handleLoginChange,
    handlePhoneChange,
    handleLogin,
    handleGoogleLogin,
    handlePhoneLogin
  } = useLoginForm();

  const {
    registerData,
    handleRegisterChange,
    handleRegister
  } = useRegisterForm();

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
              
              <PhoneVerificationForm
                phone={phoneData.phone}
                onPhoneChange={handlePhoneChange}
                onPhoneLogin={handlePhoneLogin}
                onVerified={handlePhoneVerificationComplete}
                isPostLogin={true}
              />
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
