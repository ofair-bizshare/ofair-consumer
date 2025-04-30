
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PhoneIcon } from "lucide-react";
import { useAuth } from '@/providers/AuthProvider';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface PhoneVerificationProps {
  phone: string;
  onVerified: () => void;
  isPostLogin?: boolean;
}

const PhoneVerification: React.FC<PhoneVerificationProps> = ({ 
  phone, 
  onVerified, 
  isPostLogin = false 
}) => {
  const [phoneNumber, setPhoneNumber] = useState(phone);
  const [verificationCode, setVerificationCode] = useState('');
  const [showVerificationInput, setShowVerificationInput] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const { setPhoneVerified, user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!phoneNumber) {
      toast({
        title: "מספר טלפון חסר",
        description: "אנא הזן את מספר הטלפון שלך",
        variant: "destructive",
      });
      return;
    }
    
    setIsSending(true);
    
    try {
      // Format phone number to E.164 format if needed
      let formattedPhone = phoneNumber;
      if (!phoneNumber.startsWith('+')) {
        // Israeli phone numbers: add +972 prefix and remove leading 0
        if (phoneNumber.startsWith('0')) {
          formattedPhone = '+972' + phoneNumber.substring(1);
        } else {
          formattedPhone = '+' + phoneNumber;
        }
      }

      // Send OTP code to the phone number
      const { error } = await supabase.auth.signInWithOtp({
        phone: formattedPhone
      });
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "קוד אימות נשלח",
        description: "קוד אימות נשלח למספר הטלפון שלך",
      });
      
      setShowVerificationInput(true);
      
    } catch (error) {
      console.error('Error sending verification code:', error);
      toast({
        title: "שליחת קוד אימות נכשלה",
        description: (error as Error).message || "אירעה שגיאה בשליחת קוד האימות, אנא נסה שוב",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };
  
  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!verificationCode) {
      toast({
        title: "קוד אימות חסר",
        description: "אנא הזן את קוד האימות שקיבלת",
        variant: "destructive",
      });
      return;
    }
    
    setIsVerifying(true);
    
    try {
      // Format phone number to E.164 format if needed
      let formattedPhone = phoneNumber;
      if (!phoneNumber.startsWith('+')) {
        // Israeli phone numbers: add +972 prefix and remove leading 0
        if (phoneNumber.startsWith('0')) {
          formattedPhone = '+972' + phoneNumber.substring(1);
        } else {
          formattedPhone = '+' + phoneNumber;
        }
      }

      // Verify the OTP code
      const { error } = await supabase.auth.verifyOtp({
        phone: formattedPhone,
        token: verificationCode,
        type: 'sms'
      });
      
      if (error) {
        throw error;
      }
      
      // Update the user metadata to include phone
      const { error: updateError } = await supabase.auth.updateUser({
        data: { 
          phone: formattedPhone
        }
      });
        
      if (updateError) {
        throw updateError;
      }
      
      toast({
        title: "מספר טלפון אומת",
        description: "מספר הטלפון שלך אומת בהצלחה",
      });
      
      setPhoneVerified(true);
      
      if (isPostLogin) {
        navigate('/dashboard');
      } else {
        onVerified();
      }
    } catch (error) {
      console.error('Error verifying code:', error);
      toast({
        title: "אימות קוד נכשל",
        description: (error as Error).message || "אירעה שגיאה באימות הקוד, אנא נסה שוב",
        variant: "destructive",
      });
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="space-y-4" dir="rtl">
      <Alert variant="warning">
        <AlertDescription>
          כדי להמשיך להשתמש באפליקציה, אנא אמת את מספר הטלפון שלך.
        </AlertDescription>
      </Alert>
      
      {!showVerificationInput ? (
        <form onSubmit={handleSendCode} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="verification-phone">מספר טלפון</Label>
            <div className="relative">
              <PhoneIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <Input 
                id="verification-phone"
                placeholder="הזן את מספר הטלפון שלך"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                dir="ltr"
                className="text-left pr-10"
              />
            </div>
          </div>
          
          <Button 
            type="submit"
            className="w-full bg-teal-500 hover:bg-teal-600 text-white"
            disabled={isSending}
          >
            {isSending ? "שולח קוד..." : "שלח קוד אימות"}
          </Button>
        </form>
      ) : (
        <form onSubmit={handleVerifyCode} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="verification-code">קוד אימות</Label>
            <Input 
              id="verification-code"
              placeholder="הזן את הקוד שקיבלת"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              dir="ltr"
              className="text-center"
            />
          </div>
          
          <Button 
            type="submit"
            className="w-full bg-teal-500 hover:bg-teal-600 text-white"
            disabled={isVerifying}
          >
            {isVerifying ? "מאמת..." : "אמת מספר טלפון"}
          </Button>
          
          <Button 
            type="button"
            variant="outline"
            className="w-full"
            onClick={() => setShowVerificationInput(false)}
          >
            שינוי מספר טלפון
          </Button>
        </form>
      )}
    </div>
  );
};

export default PhoneVerification;
