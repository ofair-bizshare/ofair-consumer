
import React from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Link } from 'react-router-dom';
import { UserRound } from 'lucide-react';
import { FcGoogle } from "react-icons/fc";

interface ContactAuthFormProps {
  step: number;
  loginData: any;
  registerData: any;
  handleLoginChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleRegisterChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleLogin: (e: React.FormEvent) => void;
  handleRegister: (e: React.FormEvent) => void;
  handleGoogleSignIn: () => void;
}

const ContactAuthForm: React.FC<ContactAuthFormProps> = ({
  step,
  loginData,
  registerData,
  handleLoginChange,
  handleRegisterChange,
  handleLogin,
  handleRegister,
  handleGoogleSignIn
}) => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center mb-4">
        <UserRound className="mx-auto h-12 w-12 text-blue-500 mb-2" />
        <h3 className="text-lg font-medium text-gray-700">כניסה או הרשמה לשליחת הבקשה</h3>
        <p className="text-sm text-gray-500">כדי להמשיך, יש להתחבר או להירשם</p>
      </div>
      <Button type="button" variant="outline" className="w-full flex items-center justify-center gap-2 py-6" onClick={handleGoogleSignIn}>
        <FcGoogle className="h-5 w-5" />
        <span>התחברות עם Google</span>
      </Button>
      <div className="relative my-4">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-gray-300"></span>
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="px-2 bg-white text-gray-500">או</span>
        </div>
      </div>
      <Tabs defaultValue="login" className="w-full">
        <TabsList className="grid grid-cols-2 w-full">
          <TabsTrigger value="login">התחברות</TabsTrigger>
          <TabsTrigger value="register">הרשמה</TabsTrigger>
        </TabsList>
        <TabsContent value="login">
          <form onSubmit={handleLogin} className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="login-email">דוא"ל</Label>
              <Input id="login-email" name="email" type="email" placeholder="הזן את כתובת הדואל שלך" value={loginData.email} onChange={handleLoginChange} />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="login-password">סיסמה</Label>
                <Link to="/forgot-password" className="text-xs text-[#00D09E] hover:text-[#00C090]">
                  שכחת סיסמה?
                </Link>
              </div>
              <Input id="login-password" name="password" type="password" placeholder="הזן את הסיסמה שלך" value={loginData.password} onChange={handleLoginChange} />
            </div>
            <Button type="submit" className="w-full bg-[#00D09E] hover:bg-[#00C090] text-white mt-4">
              התחבר ושלח בקשה
            </Button>
          </form>
        </TabsContent>
        <TabsContent value="register">
          <form onSubmit={handleRegister} className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="register-name">שם מלא</Label>
              <Input id="register-name" name="name" placeholder="הזן את שמך המלא" value={registerData.name} onChange={handleRegisterChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="register-email">דוא"ל</Label>
              <Input id="register-email" name="email" type="email" placeholder="הזן את כתובת הדואל שלך" value={registerData.email} onChange={handleRegisterChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="register-password">סיסמה</Label>
              <Input id="register-password" name="password" type="password" placeholder="בחר סיסמה (לפחות 8 תווים)" value={registerData.password} onChange={handleRegisterChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="register-password-confirm">אימות סיסמה</Label>
              <Input id="register-password-confirm" name="passwordConfirm" type="password" placeholder="הזן שוב את הסיסמה" value={registerData.passwordConfirm} onChange={handleRegisterChange} />
            </div>
            <div className="flex items-center space-x-2 space-x-reverse mt-2">
              <input type="checkbox" id="agree-terms" name="agreeTerms" checked={registerData.agreeTerms} onChange={handleRegisterChange} className="rounded border-gray-300 text-[#00D09E] focus:ring-[#00D09E]" />
              <Label htmlFor="agree-terms" className="text-sm cursor-pointer">
                אני מסכים/ה ל
                <Link to="/terms" className="text-[#00D09E] mx-1 hover:underline">
                  תנאי השימוש
                </Link>
                ול
                <Link to="/privacy" className="text-[#00D09E] mx-1 hover:underline">
                  מדיניות הפרטיות
                </Link>
              </Label>
            </div>
            <Button type="submit" className="w-full bg-[#00D09E] hover:bg-[#00C090] text-white mt-4">
              הרשם ושלח בקשה
            </Button>
          </form>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ContactAuthForm;
