
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/providers/AuthProvider';

export const useRegisterForm = () => {
  const { toast } = useToast();
  const { signUp } = useAuth();
  
  const [registerData, setRegisterData] = useState({
    name: '',
    email: '',
    password: '',
    passwordConfirm: '',
    agreeTerms: false,
    phone: '',
  });

  const handleRegisterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setRegisterData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
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

  return {
    registerData,
    handleRegisterChange,
    handleRegister
  };
};
