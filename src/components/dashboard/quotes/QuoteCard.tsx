
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { QuoteInterface } from '@/types/dashboard';
import PhoneRevealButton from '@/components/PhoneRevealButton';
import ProfessionalInfo from './components/ProfessionalInfo';
import QuoteDetails from './components/QuoteDetails';
import AcceptedQuoteStatus from './components/AcceptedQuoteStatus';
import QuoteActionButtons from './components/QuoteActionButtons';
import { useIsMobile } from '@/hooks/use-mobile';

interface QuoteCardProps {
  quote: QuoteInterface;
  onAcceptQuote: (quoteId: string) => void;
  onRejectQuote: (quoteId: string) => void;
  onViewProfile: (professionalId: string) => void;
  hasAcceptedQuote: boolean;
  requestStatus?: string;
}

const QuoteCard: React.FC<QuoteCardProps> = ({ 
  quote, 
  onAcceptQuote, 
  onRejectQuote, 
  onViewProfile,
  hasAcceptedQuote,
  requestStatus = 'active'
}) => {
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [isContactActive, setIsContactActive] = useState(false);
  const isMobile = useIsMobile();
  
  const handleContactClick = () => {
    setIsContactActive(!isContactActive);
  };
  
  // Determine if this quote should be displayed with full interactivity
  const isRequestCompleted = requestStatus === 'completed';
  const isWaitingForRating = requestStatus === 'waiting_for_rating';
  const isAcceptedQuote = quote.status === 'accepted';
  
  // Only show non-accepted quotes if the request is active
  // When request is completed or waiting for rating, ONLY show accepted quotes
  const shouldDisplayQuote = 
    requestStatus === 'active' || 
    (isAcceptedQuote) || 
    quote.status === 'pending';
    
  // Card is interactive if request is not completed or this is the accepted quote
  const isInteractive = !isRequestCompleted || isAcceptedQuote;
  
  // Show action buttons for active requests with no accepted quote yet
  // OR for the accepted quote in active or waiting_for_rating status (for cancellation)
  const showActionButtons = 
    (requestStatus === 'active') && 
    (!hasAcceptedQuote || isAcceptedQuote) || 
    (isWaitingForRating && isAcceptedQuote);

  // Don't render the card at all if it shouldn't be displayed
  if (!shouldDisplayQuote && requestStatus !== 'active') {
    return null;
  }

  return (
    <Card className={`overflow-hidden mb-3 shadow-md transition-shadow ${!isInteractive ? 'opacity-70' : ''}`}>
      <CardContent className="p-0">
        <div className={`p-2 ${isMobile ? 'space-y-2' : 'p-4'} border-b border-gray-100`}>
          <ProfessionalInfo professional={quote.professional} />
          
          <QuoteDetails 
            price={quote.price} 
            estimatedTime={quote.estimatedTime}
            sampleImageUrl={quote.sampleImageUrl}
            description={quote.description}
          />
          
          {isAcceptedQuote && (
            <AcceptedQuoteStatus 
              isCompleted={isRequestCompleted} 
              isWaitingForRating={isWaitingForRating}
            />
          )}
          
          <div className={`mt-2 ${isMobile ? 'w-full' : ''}`}>
            <PhoneRevealButton 
              phoneNumber={quote.professional.phoneNumber || "050-1234567"}
              professionalName={quote.professional.name}
              professionalId={quote.professional.id}
              profession={quote.professional.profession}
              autoReveal={quote.status === 'accepted'} // Auto reveal for accepted quotes
            />
          </div>
        </div>
        
        <QuoteActionButtons 
          requestStatus={requestStatus}
          quoteStatus={quote.status}
          quoteId={quote.id}
          professionalId={quote.professional.id}
          isInteractive={isInteractive}
          isContactActive={isContactActive}
          showActionButtons={showActionButtons}
          hasAcceptedQuote={hasAcceptedQuote}
          isAcceptedQuote={isAcceptedQuote}
          onContactClick={handleContactClick}
          onViewProfile={onViewProfile}
          onAcceptQuote={onAcceptQuote}
          onRejectQuote={onRejectQuote}
          showCancelConfirm={showCancelConfirm}
          setShowCancelConfirm={setShowCancelConfirm}
          professional={quote.professional}
        />
      </CardContent>
    </Card>
  );
};

export default QuoteCard;
