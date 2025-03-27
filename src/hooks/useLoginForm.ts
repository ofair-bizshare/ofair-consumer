
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/providers/AuthProvider';
import { useNavigate } from 'react-router-dom';

export const useLoginForm = () => {
  const { toast } = useToast();
  const { signIn, signInWithGoogle, signInWithPhone } = useAuth();
  const navigate = useNavigate();
  
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });
  
  const [phoneData, setPhoneData] = useState({
    phone: '',
  });
  
  const [showPhoneVerification, setShowPhoneVerification] = useState(false);

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setLoginData(prev => ({
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
      setShowPhoneVerification(true);
    }
  };

  return {
    loginData,
    phoneData,
    showPhoneVerification,
    setShowPhoneVerification,
    handleLoginChange,
    handlePhoneChange,
    handleLogin,
    handleGoogleLogin,
    handlePhoneLogin
  };
};
