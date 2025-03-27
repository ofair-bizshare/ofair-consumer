
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { PhoneIcon } from 'lucide-react';
import PhoneVerification from './PhoneVerification';

interface PhoneVerificationFormProps {
  phone: string;
  onPhoneChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPhoneLogin: (e: React.FormEvent) => void;
  onVerified: () => void;
  isPostLogin?: boolean;
}

const PhoneVerificationForm: React.FC<PhoneVerificationFormProps> = ({
  phone,
  onPhoneChange,
  onPhoneLogin,
  onVerified,
  isPostLogin = false
}) => {
  return (
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
          value={phone}
          onChange={onPhoneChange}
        />
      </div>
      
      <Button 
        onClick={onPhoneLogin}
        type="button"
        className="w-full bg-teal-500 hover:bg-teal-600 text-white"
      >
        שלח קוד אימות
      </Button>
      
      {phone && (
        <div className="mt-6">
          <PhoneVerification 
            phone={phone} 
            onVerified={onVerified}
            isPostLogin={isPostLogin}
          />
        </div>
      )}
    </div>
  );
};

export default PhoneVerificationForm;
