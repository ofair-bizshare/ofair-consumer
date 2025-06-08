
import React from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import PhoneVerification from '@/components/auth/PhoneVerification';

interface PhoneVerificationDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  userPhone: string;
  onVerified: () => void;
}

const PhoneVerificationDialog: React.FC<PhoneVerificationDialogProps> = ({
  isOpen,
  onOpenChange,
  userPhone,
  onVerified
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md" dir="rtl">
        <DialogHeader>
          <DialogTitle>אימות מספר טלפון נדרש</DialogTitle>
          <DialogDescription>
            כדי לצפות במספר הטלפון של בעל המקצוע, עליך לאמת את מספר הטלפון שלך
          </DialogDescription>
        </DialogHeader>
        <PhoneVerification 
          phone={userPhone} 
          onVerified={onVerified}
        />
      </DialogContent>
    </Dialog>
  );
};

export default PhoneVerificationDialog;
