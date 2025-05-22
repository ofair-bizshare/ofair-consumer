
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { QuoteInterface } from '@/types/dashboard';
import PhoneRevealButton from '@/components/PhoneRevealButton';
import ProfessionalInfo from './components/ProfessionalInfo';
import QuoteDetails from './components/QuoteDetails';
import AcceptedQuoteStatus from './components/AcceptedQuoteStatus';
import QuoteActionButtons from './components/QuoteActionButtons';
import { useIsMobile } from '@/hooks/use-mobile';
import ErrorBoundary from '@/components/ui/error-boundary';
import { checkIfAcceptedQuoteExists } from '@/services/quotes/acceptedQuotes';
import WhatsAppButton from './components/WhatsAppButton';
import { saveReferral } from '@/services/quotes';
import { useMediaUrls } from './useMediaUrls'; // שימוש נכון

// Placeholder icon/image if no media
const NoMediaPlaceholder = () => (
  <div className="flex flex-col items-center justify-center w-full py-3 text-gray-400">
    <span className="material-icons text-5xl mb-2" aria-hidden="true">image_off</span>
    <span className="text-xs">אין מדיה זמינה לתצוגה</span>
  </div>
);

interface QuoteCardProps {
  quote: QuoteInterface;
  onAcceptQuote: (quoteId: string) => void;
  onRejectQuote: (quoteId: string) => void;
  onViewProfile: (professionalId: string) => void;
  hasAcceptedQuote: boolean;
  requestStatus?: string;
  onRatingClick?: (quoteId: string) => void; // Added callback for rating dialog
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
    console.log(`QuoteCard: Rating requested for quote ${quote.id}`);
    if (onRatingClick) {
      onRatingClick(quote.id);
    }
  };
  
  useEffect(() => {
    const verifyAcceptanceStatus = async () => {
      try {
        setIsVerifying(true);
        if (!quote.requestId || !quote.id) return;
        const isAccepted = await checkIfAcceptedQuoteExists(quote.requestId, quote.id);
        console.log(`Quote ${quote.id} acceptance check: DB=${isAccepted}, UI=${quote.status === 'accepted'}`);
        if (isAccepted !== (quote.status === 'accepted')) {
          console.warn(`Quote ${quote.id} has status mismatch - UI: ${quote.status}, DB: ${isAccepted ? 'accepted' : 'not accepted'}`);
        }
        setConfirmedAccepted(isAccepted);
      } catch (error) {
        console.error("Error checking quote acceptance status:", error);
        setConfirmedAccepted(null);
      } finally {
        setIsVerifying(false);
      }
    };
    verifyAcceptanceStatus();
  }, [quote.id, quote.requestId, quote.status]);
  
  const handleContactClick = () => {
    setIsContactActive(!isContactActive);
  };
  
  const isAcceptedQuote = quote.status === 'accepted' || confirmedAccepted === true;
  const isRequestCompleted = requestStatus === 'completed';
  const isWaitingForRating = requestStatus === 'waiting_for_rating';
  const shouldDisplayQuote = 
    requestStatus === 'active' || 
    isAcceptedQuote || 
    quote.status === 'pending';
  const isInteractive = !isRequestCompleted || isAcceptedQuote;
  const showActionButtons = requestStatus !== 'completed';

  // שימוש נכון ב-useMediaUrls בלבד ומחיקת כל parsing ישן
  const mediaUrls = useMediaUrls(quote.media_urls, quote.sampleImageUrl);
  console.log("QuoteCard: mediaUrls from useMediaUrls:", mediaUrls);

  // --- WHATSAPP LOGIC START ---
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
        console.log("WhatsApp reveal logged for professional:", quote.professional.id);
      } catch (err) {
        console.error("Error logging WhatsApp reveal:", err);
      }
    }
  };
  // --- WHATSAPP LOGIC END ---

  if (!shouldDisplayQuote && requestStatus !== 'active') {
    return null;
  }
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
          <div className={`p-2 ${isMobile ? 'space-y-2' : 'p-4'} border-b border-gray-100`}>
            <ProfessionalInfo professional={quote.professional} />
            <QuoteDetails 
              price={quote.price || "0"} 
              estimatedTime={quote.estimatedTime || ""}
              mediaUrls={mediaUrls}
              sampleImageUrl={quote.sampleImageUrl}
              description={quote.description || ""}
            />
            {isAcceptedQuote && (
              <>
                <AcceptedQuoteStatus 
                  isCompleted={isRequestCompleted} 
                  isWaitingForRating={isWaitingForRating}
                  onRatingClick={handleQuoteRatingClick}
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
            )}
            <div className={`mt-2 ${isMobile ? 'w-full' : ''}`}>
              <PhoneRevealButton 
                phoneNumber={quote.professional.phoneNumber || quote.professional.phone || "050-1234567"}
                professionalName={quote.professional.name || "בעל מקצוע"}
                professionalId={quote.professional.id}
                profession={quote.professional.profession || ""}
                autoReveal={isAcceptedQuote}
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
