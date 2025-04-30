
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useAuth } from '@/providers/AuthProvider';
import { useNavigate, useLocation } from 'react-router-dom';
import PhoneVerification from './PhoneVerification';

const PhoneRequiredDialog: React.FC = () => {
  const { user, phoneVerified, checkPhoneVerification } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const checkPhone = async () => {
      // Only show for logged in users who don't have a phone verified
      if (user) {
        const hasPhone = await checkPhoneVerification();
        // Only open dialog if user doesn't have a phone verified
        setOpen(!hasPhone);
      } else {
        setOpen(false);
      }
    };

    checkPhone();
  }, [user, checkPhoneVerification]);

  const handleVerified = () => {
    setOpen(false);
    
    // If we're on the login page, redirect to dashboard
    if (location.pathname === '/login') {
      navigate('/dashboard');
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md" dir="rtl">
        <DialogHeader>
          <DialogTitle>אימות מספר טלפון נדרש</DialogTitle>
          <DialogDescription>
            כדי להמשיך ולהשתמש באפליקציה, אנא אמת את מספר הטלפון שלך
          </DialogDescription>
        </DialogHeader>
        
        {user && (
          <PhoneVerification 
            phone={user.user_metadata?.phone || ''} 
            onVerified={handleVerified}
            isPostLogin={true}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PhoneRequiredDialog;
