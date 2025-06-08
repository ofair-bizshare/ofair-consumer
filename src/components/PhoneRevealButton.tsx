
import React from 'react';
import { usePhoneReveal } from '@/hooks/usePhoneReveal';
import PhoneDisplay from '@/components/phone/PhoneDisplay';
import LoginRequiredDialog from '@/components/dialogs/LoginRequiredDialog';
import PhoneVerificationDialog from '@/components/dialogs/PhoneVerificationDialog';

interface PhoneRevealButtonProps {
  phoneNumber?: string;
  professionalName: string;
  professionalId: string;
  profession?: string;
  onBeforeReveal?: () => boolean;
  autoReveal?: boolean;
}

const PhoneRevealButton: React.FC<PhoneRevealButtonProps> = ({
  phoneNumber = "000-0000000",
  professionalName,
  professionalId,
  profession = "",
  onBeforeReveal,
  autoReveal = false
}) => {
  const {
    isRevealed,
    isDialogOpen,
    showPhoneRequiredDialog,
    setIsDialogOpen,
    setShowPhoneRequiredDialog,
    handleReveal,
    handleGoToLogin,
    handleVerificationComplete,
    user
  } = usePhoneReveal({
    phoneNumber,
    professionalName,
    professionalId,
    profession,
    onBeforeReveal,
    autoReveal
  });

  return (
    <>
      <PhoneDisplay
        phoneNumber={phoneNumber}
        isRevealed={isRevealed}
        autoReveal={autoReveal}
        isUserLoggedIn={!!user}
        onReveal={handleReveal}
      />
      
      <LoginRequiredDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onGoToLogin={handleGoToLogin}
      />
      
      {user && (
        <PhoneVerificationDialog
          isOpen={showPhoneRequiredDialog}
          onOpenChange={setShowPhoneRequiredDialog}
          userPhone={user.user_metadata?.phone || ''}
          onVerified={handleVerificationComplete}
        />
      )}
    </>
  );
};

export default PhoneRevealButton;
