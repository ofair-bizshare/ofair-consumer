
import React from 'react';
import AcceptedQuoteStatus from './components/AcceptedQuoteStatus';
import WhatsAppButton from './components/WhatsAppButton';
import { QuoteInterface } from '@/types/dashboard';

interface AcceptedStatusAndContactProps {
  isAcceptedQuote: boolean;
  isRequestCompleted: boolean;
  isWaitingForRating: boolean;
  onRatingClick: () => void;
  quote: QuoteInterface;
  handleWhatsAppReveal: () => void;
}

const AcceptedStatusAndContact: React.FC<AcceptedStatusAndContactProps> = ({
  isAcceptedQuote,
  isRequestCompleted,
  isWaitingForRating,
  onRatingClick,
  quote,
  handleWhatsAppReveal
}) => {
  if (!isAcceptedQuote) return null;
  return (
    <>
      <AcceptedQuoteStatus 
        isCompleted={isRequestCompleted}
        isWaitingForRating={isWaitingForRating}
        onRatingClick={onRatingClick}
      />
      <div className="mt-2">
        <WhatsAppButton 
          phoneNumber={quote.professional.phoneNumber || quote.professional.phone || ""}
          professionalName={quote.professional.name || ""}
          professionalId={quote.professional.id}
          profession={quote.professional.profession || ""}
          onLogReveal={handleWhatsAppReveal}
        />
      </div>
    </>
  );
};

export default AcceptedStatusAndContact;
