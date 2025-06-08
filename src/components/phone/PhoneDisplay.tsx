
import React from 'react';
import { Button } from '@/components/ui/button';
import { Phone } from 'lucide-react';
import { formatPhoneNumber } from '@/utils/phoneUtils';

interface PhoneDisplayProps {
  phoneNumber: string;
  isRevealed: boolean;
  autoReveal: boolean;
  isUserLoggedIn: boolean;
  onReveal: () => void;
}

const PhoneDisplay: React.FC<PhoneDisplayProps> = ({
  phoneNumber,
  isRevealed,
  autoReveal,
  isUserLoggedIn,
  onReveal
}) => {
  const displayedPhone = formatPhoneNumber(phoneNumber);
  const buttonText = isRevealed ? displayedPhone : "צפה במספר טלפון";

  if (autoReveal && isUserLoggedIn && isRevealed) {
    return (
      <div className="flex items-center gap-2 text-green-600 font-medium">
        <Phone className="h-4 w-4" />
        {displayedPhone}
      </div>
    );
  }

  return (
    <Button 
      onClick={onReveal}
      className="w-full bg-[#00D09E] hover:bg-[#00C090] text-white"
    >
      <Phone className="ml-2 h-4 w-4" />
      {buttonText}
    </Button>
  );
};

export default PhoneDisplay;
