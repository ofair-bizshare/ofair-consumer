
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Phone } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PhoneRevealButtonProps {
  phoneNumber: string;
  professionalName: string;
  professionalId: string;
}

const PhoneRevealButton: React.FC<PhoneRevealButtonProps> = ({ 
  phoneNumber, 
  professionalName,
  professionalId 
}) => {
  const [isRevealed, setIsRevealed] = useState(false);
  const { toast } = useToast();

  const handleReveal = () => {
    // In a real app, this would make an API call to record the referral
    setIsRevealed(true);
    
    // Show success toast
    toast({
      title: "פרטי התקשרות נשמרו",
      description: `פרטי ההפניה ל${professionalName} נשמרו באזור האישי שלך`,
      variant: "success",
    });
    
    // Simulate saving to "My Referrals" section
    console.log("Referral saved:", {
      professionalId,
      professionalName,
      phoneNumber,
      date: new Date().toISOString(),
      status: "new"
    });
  };

  return (
    <Button
      variant={isRevealed ? "outline" : "default"}
      className={`w-full ${isRevealed ? "border-blue-500 text-blue-700" : "bg-blue-600 hover:bg-blue-700"}`}
      onClick={handleReveal}
    >
      <Phone className="ml-2 h-4 w-4" />
      {isRevealed ? phoneNumber : "הצג מספר טלפון"}
    </Button>
  );
};

export default PhoneRevealButton;
