
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PhoneIcon } from "lucide-react";
import { useAuth } from '@/providers/AuthProvider';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

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
  const [isSaving, setIsSaving] = useState(false);
  const { setPhoneVerified, user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!phoneNumber) {
      toast({
        title: "מספר טלפון חסר",
        description: "אנא הזן את מספר הטלפון שלך",
        variant: "destructive",
      });
      return;
    }
    
    setIsSaving(true);
    
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
        title: "מספר טלפון נשמר",
        description: "מספר הטלפון נשמר בהצלחה",
      });
      
      setPhoneVerified(true);
      
      if (isPostLogin) {
        navigate('/dashboard');
      } else {
        onVerified();
      }
    } catch (error) {
      console.error('Error saving phone:', error);
      toast({
        title: "שמירת מספר טלפון נכשלה",
        description: error.message || "אירעה שגיאה בשמירת מספר הטלפון, אנא נסה שוב",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-4" dir="rtl">
      <div className="bg-blue-50 p-4 rounded-md">
        <p className="text-sm text-blue-700">
          כדי להמשיך להשתמש באפליקציה, אנא הזן את מספר הטלפון שלך.
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
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
          disabled={isSaving}
        >
          {isSaving ? "שומר..." : "שמור מספר טלפון"}
        </Button>
      </form>
    </div>
  );
};

export default PhoneVerification;
