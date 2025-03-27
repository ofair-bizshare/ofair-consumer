
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { PhoneIcon } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import PhoneVerification from './PhoneVerification';

interface LoginFormProps {
  loginData: {
    email: string;
    password: string;
    rememberMe: boolean;
  };
  phoneData: {
    phone: string;
  };
  handleLoginChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handlePhoneChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleLogin: (e: React.FormEvent) => void;
  handlePhoneLogin: (e: React.FormEvent) => void;
  handleGoogleLogin: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({
  loginData,
  phoneData,
  handleLoginChange,
  handlePhoneChange,
  handleLogin,
  handlePhoneLogin,
  handleGoogleLogin
}) => {
  const [showPhoneVerification, setShowPhoneVerification] = useState(false);

  const onPhoneLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handlePhoneLogin(e);
    setShowPhoneVerification(true);
  };

  const handleVerificationComplete = () => {
    // After successful verification, we don't need to do anything 
    // as the auth state change will trigger a redirect
  };

  return (
    <>
      {/* Social login buttons */}
      <div className="space-y-3" dir="rtl">
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

      {showPhoneVerification ? (
        <PhoneVerification 
          phone={phoneData.phone} 
          onVerified={handleVerificationComplete} 
        />
      ) : (
        <>
          <form onSubmit={handleLogin} dir="rtl">
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
                    handleLoginChange({
                      target: { name: 'rememberMe', checked: checked === true, type: 'checkbox', value: '' }
                    } as React.ChangeEvent<HTMLInputElement>)
                  }
                />
                <Label htmlFor="remember-me" className="text-sm cursor-pointer mr-2">
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

          <form onSubmit={onPhoneLoginSubmit} className="pt-2" dir="rtl">
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
        </>
      )}
    </>
  );
};

export default LoginForm;
