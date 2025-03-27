
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PhoneIcon } from "lucide-react";
import { useAuth } from '@/providers/AuthProvider';
import { useToast } from '@/hooks/use-toast';

interface PhoneVerificationProps {
  phone: string;
  onVerified: () => void;
}

const PhoneVerification: React.FC<PhoneVerificationProps> = ({ phone, onVerified }) => {
  const [otp, setOtp] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const { verifyOtp } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!otp) {
      toast({
        title: "קוד חסר",
        description: "אנא הזן את קוד האימות שקיבלת",
        variant: "destructive",
      });
      return;
    }
    
    setIsVerifying(true);
    
    try {
      const { error } = await verifyOtp(phone, otp);
      
      if (!error) {
        toast({
          title: "אימות הצליח",
          description: "הטלפון אומת בהצלחה",
        });
        onVerified();
      }
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-blue-50 p-4 rounded-md">
        <p className="text-sm text-blue-700">
          קוד אימות נשלח אל {phone}. 
          אנא הזן את הקוד שקיבלת כדי להשלים את תהליך ההתחברות.
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="verification-code">קוד אימות</Label>
          <Input 
            id="verification-code"
            placeholder="הזן את קוד האימות"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            dir="ltr"
            className="text-left"
          />
        </div>
        
        <Button 
          type="submit"
          className="w-full bg-teal-500 hover:bg-teal-600 text-white"
          disabled={isVerifying}
        >
          {isVerifying ? "מאמת..." : "אמת קוד"}
        </Button>
      </form>
    </div>
  );
};

export default PhoneVerification;
