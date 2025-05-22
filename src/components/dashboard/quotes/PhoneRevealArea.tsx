
import React from 'react';
import PhoneRevealButton from '@/components/PhoneRevealButton';
import { QuoteInterface } from '@/types/dashboard';

interface PhoneRevealAreaProps {
  quote: QuoteInterface;
  isAcceptedQuote: boolean;
  isMobile: boolean;
}

const PhoneRevealArea: React.FC<PhoneRevealAreaProps> = ({ quote, isAcceptedQuote, isMobile }) => (
  <div className={`mt-2 ${isMobile ? 'w-full' : ''}`}>
    <PhoneRevealButton 
      phoneNumber={quote.professional.phoneNumber || quote.professional.phone || "050-1234567"}
      professionalName={quote.professional.name || "בעל מקצוע"}
      professionalId={quote.professional.id}
      profession={quote.professional.profession || ""}
      autoReveal={isAcceptedQuote}
    />
  </div>
);

export default PhoneRevealArea;
