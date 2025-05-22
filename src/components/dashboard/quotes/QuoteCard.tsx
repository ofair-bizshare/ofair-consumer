import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { QuoteInterface } from '@/types/dashboard';
import QuoteActionButtons from './components/QuoteActionButtons';
import { useIsMobile } from '@/hooks/use-mobile';
import ErrorBoundary from '@/components/ui/error-boundary';
import { checkIfAcceptedQuoteExists } from '@/services/quotes/acceptedQuotes';
import { saveReferral } from '@/services/quotes';
import { useMediaUrls } from './useMediaUrls';
// New split components
import AcceptedStatusAndContact from './AcceptedStatusAndContact';
import PhoneRevealArea from './PhoneRevealArea';
import QuoteMainDetails from './QuoteMainDetails';

interface QuoteCardProps {
  quote: QuoteInterface;
  onAcceptQuote: (quoteId: string) => void;
  onRejectQuote: (quoteId: string) => void;
  onViewProfile: (professionalId: string) => void;
  hasAcceptedQuote: boolean;
  requestStatus?: string;
  onRatingClick?: (quoteId: string) => void;
}

const QuoteCard: React.FC<QuoteCardProps> = ({
  quote, 
  onAcceptQuote, 
  onRejectQuote, 
  onViewProfile,
  hasAcceptedQuote,
  requestStatus = 'active',
  onRatingClick
}) => {
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [isContactActive, setIsContactActive] = useState(false);
  const [confirmedAccepted, setConfirmedAccepted] = useState<boolean | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const isMobile = useIsMobile();

  if (!quote || !quote.id || !quote.professional || !quote.professional.id) {
    console.error("Invalid quote data:", quote);
    return (
      <Card className="overflow-hidden mb-3 shadow-md bg-red-50">
        <CardContent className="p-4">
          <div className="text-red-600">הצעת מחיר לא תקינה</div>
        </CardContent>
      </Card>
    );
  }

  const handleQuoteRatingClick = () => {
    if (onRatingClick) onRatingClick(quote.id);
  };

  useEffect(() => {
    const verifyAcceptanceStatus = async () => {
      try {
        setIsVerifying(true);
        if (!quote.requestId || !quote.id) return;
        const isAccepted = await checkIfAcceptedQuoteExists(quote.requestId, quote.id);
        setConfirmedAccepted(isAccepted);
      } catch {
        setConfirmedAccepted(null);
      } finally {
        setIsVerifying(false);
      }
    };
    verifyAcceptanceStatus();
  }, [quote.id, quote.requestId, quote.status]);

  const handleContactClick = () => setIsContactActive(!isContactActive);

  const isAcceptedQuote = quote.status === 'accepted' || confirmedAccepted === true;
  const isRequestCompleted = requestStatus === 'completed';
  const isWaitingForRating = requestStatus === 'waiting_for_rating';
  const shouldDisplayQuote = 
    requestStatus === 'active' || 
    isAcceptedQuote || 
    quote.status === 'pending';
  const isInteractive = !isRequestCompleted || isAcceptedQuote;
  const showActionButtons = requestStatus !== 'completed';

  const mediaUrls = useMediaUrls(quote.media_urls, quote.sampleImageUrl);

  const handleWhatsAppReveal = async () => {
    if (
      quote &&
      quote.professional &&
      (quote.professional.phoneNumber || quote.professional.phone)
    ) {
      try {
        await saveReferral(
          (quote as any)?.userId || "",
          quote.professional.id,
          quote.professional.name,
          quote.professional.phoneNumber || quote.professional.phone,
          quote.professional.profession
        );
      } catch (err) {
        // Could add toast here if needed
      }
    }
  };

  if (!shouldDisplayQuote && requestStatus !== 'active') return null;
  if (isVerifying) {
    return (
      <Card className="overflow-hidden mb-3 shadow-md">
        <CardContent className="p-4">
          <div className="flex justify-center items-center">
            <div className="h-5 w-5 border-t-2 border-blue-500 rounded-full animate-spin"></div>
            <span className="text-gray-500 mr-2">מאמת סטטוס הצעה...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <ErrorBoundary>
      <Card className={`overflow-hidden mb-3 shadow-md transition-shadow ${!isInteractive ? 'opacity-70' : ''}`}>
        <CardContent className="p-0">
          <QuoteMainDetails 
            quote={quote}
            isMobile={isMobile}
          />
          <AcceptedStatusAndContact
            isAcceptedQuote={isAcceptedQuote}
            isRequestCompleted={isRequestCompleted}
            isWaitingForRating={isWaitingForRating}
            onRatingClick={handleQuoteRatingClick}
            quote={quote}
            handleWhatsAppReveal={handleWhatsAppReveal}
          />
          <PhoneRevealArea
            quote={quote}
            isAcceptedQuote={isAcceptedQuote}
            isMobile={isMobile}
          />
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
            dbVerifiedAccepted={confirmedAccepted}
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
    </ErrorBoundary>
  );
};

export default QuoteCard;
