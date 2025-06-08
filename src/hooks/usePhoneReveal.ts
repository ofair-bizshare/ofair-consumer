
import { useState, useEffect } from 'react';
import { useAuth } from '@/providers/AuthProvider';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { saveReferral } from '@/services/quotes/referrals';

interface UsePhoneRevealProps {
  phoneNumber: string;
  professionalName: string;
  professionalId: string;
  profession: string;
  onBeforeReveal?: () => boolean;
  autoReveal: boolean;
}

export const usePhoneReveal = ({
  phoneNumber,
  professionalName,
  professionalId,
  profession,
  onBeforeReveal,
  autoReveal
}: UsePhoneRevealProps) => {
  const [isRevealed, setIsRevealed] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [showPhoneRequiredDialog, setShowPhoneRequiredDialog] = useState(false);
  const { user, checkPhoneVerification } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Auto-reveal the phone number if autoReveal is true and user is logged in with phone verified
  useEffect(() => {
    const checkPhoneStatus = async () => {
      if (autoReveal && user) {
        const hasPhoneVerified = await checkPhoneVerification();
        if (hasPhoneVerified) {
          setIsRevealed(true);
          try {
            await saveReferral(
              user.id,
              professionalId,
              professionalName,
              phoneNumber,
              profession,
              user.user_metadata?.name
            );
          } catch (error) {
            console.error("Error auto-saving referral:", error);
          }
        }
      }
    };
    
    checkPhoneStatus();
  }, [autoReveal, user, checkPhoneVerification, professionalId, professionalName, phoneNumber, profession]);

  const handleReveal = async () => {
    if (onBeforeReveal && !onBeforeReveal()) {
      return;
    }
    
    if (!user) {
      setIsDialogOpen(true);
      return;
    }
    
    // Check if user has verified phone number
    const hasPhoneVerified = await checkPhoneVerification();
    
    if (!hasPhoneVerified) {
      setShowPhoneRequiredDialog(true);
      return;
    }
    
    setIsRevealed(true);
    
    // Save the referral using the service
    try {
      const success = await saveReferral(
        user.id,
        professionalId,
        professionalName,
        phoneNumber,
        profession,
        user.user_metadata?.name
      );
      
      if (!success) {
        console.error("Failed to save referral");
      }
    } catch (error) {
      console.error("Error saving referral:", error);
    }
  };

  const handleGoToLogin = () => {
    setIsDialogOpen(false);
    navigate('/login', { 
      state: { returnUrl: window.location.pathname }
    });
  };

  const handleVerificationComplete = async () => {
    setShowPhoneRequiredDialog(false);
    setIsRevealed(true);
    
    // After verification, save the referral
    if (user) {
      try {
        await saveReferral(
          user.id,
          professionalId,
          professionalName,
          phoneNumber,
          profession,
          user.user_metadata?.name
        );
      } catch (error) {
        console.error("Error saving referral after verification:", error);
      }
    }
    
    toast({
      title: "אימות הושלם בהצלחה",
      description: "כעת באפשרותך לראות את מספרי הטלפון של בעלי המקצוע",
    });
  };

  return {
    isRevealed,
    isDialogOpen,
    showPhoneRequiredDialog,
    setIsDialogOpen,
    setShowPhoneRequiredDialog,
    handleReveal,
    handleGoToLogin,
    handleVerificationComplete,
    user
  };
};
