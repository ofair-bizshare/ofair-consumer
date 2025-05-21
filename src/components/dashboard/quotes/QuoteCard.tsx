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
  
  // Safety check - if quote is invalid, don't render anything
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
  
  // Handle rating click for this specific quote
  const handleQuoteRatingClick = () => {
    console.log(`QuoteCard: Rating requested for quote ${quote.id}`);
    if (onRatingClick) {
      onRatingClick(quote.id);
    }
  };
  
  // Check the actual acceptance status in the database when component mounts
  useEffect(() => {
    const verifyAcceptanceStatus = async () => {
      try {
        setIsVerifying(true);
        if (!quote.requestId || !quote.id) return;
        
        // Check acceptance status in the database
        const isAccepted = await checkIfAcceptedQuoteExists(quote.requestId, quote.id);
        console.log(`Quote ${quote.id} acceptance check: DB=${isAccepted}, UI=${quote.status === 'accepted'}`);
        
        // If there's a mismatch between UI state and DB state, log it
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
  
  // --- התחלת טיפול ב-media_urls ---

  // לוג מידע של תוכן המדיה שמגיע מה-DB
  console.log('QuoteCard: quote.media_urls raw from DB:', quote.media_urls);

  // עיבוד השדה media_urls - תמיכה גם במערך וגם במחרוזת (JSON או רגילה)
  let mediaUrls: string[] | string = [];
  if (Array.isArray(quote.media_urls)) {
    mediaUrls = quote.media_urls.filter(url => !!url && typeof url === "string");
  } else if (typeof quote.media_urls === 'string') {
    // בדוק אולי זאת מחרוזת שמייצגת מערך JSON
    const trimmed = quote.media_urls.trim();
    try {
      if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
        const arr = JSON.parse(trimmed);
        if (Array.isArray(arr)) {
          mediaUrls = arr.filter(url => !!url && typeof url === "string");
        }
      } else if (trimmed.includes(',')) {
        mediaUrls = trimmed.split(',').map(s => s.trim()).filter(Boolean);
      } else if (trimmed.startsWith('http')) {
        mediaUrls = [trimmed];
      } else {
        mediaUrls = [];
      }
    } catch (e) {
      // fallback: schlita במחרוזת לא חוקית, נסה לבדוק אם זה קישור בודד
      if (trimmed.startsWith('http')) {
        mediaUrls = [trimmed];
      } else {
        mediaUrls = [];
      }
    }
  }

  // פלט לוג של המדיה שעוברת הלאה
  console.log('QuoteCard: mediaUrls parsed for details:', mediaUrls);

  // --- סוף טיפול ב-media_urls ---
  
  // Determine if this quote is accepted - check both the quote.status and the database verification
  const isAcceptedQuote = quote.status === 'accepted' || confirmedAccepted === true;
  
  // Determine if this quote should be displayed with full interactivity
  const isRequestCompleted = requestStatus === 'completed';
  const isWaitingForRating = requestStatus === 'waiting_for_rating';
  
  // Only show non-accepted quotes if the request is active
  // When request is completed or waiting for rating, ONLY show accepted quotes
  const shouldDisplayQuote = 
    requestStatus === 'active' || 
    isAcceptedQuote || 
    quote.status === 'pending';
    
  // Card is interactive if request is not completed or this is the accepted quote
  const isInteractive = !isRequestCompleted || isAcceptedQuote;
  
  // Show action buttons based on status combinations
  const showActionButtons = requestStatus !== 'completed';

  // עיבוד מדיה - תיקון מלא שמטפל במקרה בו media_urls הוא מחרוזת שמייצגת מערך JSON
  let mediaUrls2: string[] = [];
  try {
    const mediaValue = quote.media_urls as string[] | string | null | undefined;
    if (Array.isArray(mediaValue)) {
      mediaUrls2 = mediaValue.filter(
        (url) => typeof url === "string" && url.trim().startsWith("http")
      );
    } else if (typeof mediaValue === "string" && mediaValue.trim() !== "") {
      const clean = mediaValue.trim();
      if (clean.startsWith("[") && clean.endsWith("]")) {
        // זו מחרוזת JSON של מערך כתובות
        try {
          const parsedArr = JSON.parse(clean);
          if (Array.isArray(parsedArr)) {
            mediaUrls2 = parsedArr.filter(
              (url) => typeof url === "string" && url.trim().startsWith("http")
            );
          }
        } catch (e) {
          console.warn("cannot JSON.parse media_urls!", e, clean);
        }
      } else if (clean.includes(",")) {
        mediaUrls2 = clean
          .split(",")
          .map((s) => s.trim().replace(/^"|"$/g, "")) // הסרת גרשיים למקרה שהן קיימות סביב כל url
          .filter((s) => s.startsWith("http"));
      } else if (clean.startsWith("http") && clean.length > 8) {
        mediaUrls2 = [clean];
      }
    }
    // Fallback: sampleImageUrl
    if ((!mediaUrls2 || mediaUrls2.length === 0) && quote.sampleImageUrl && typeof quote.sampleImageUrl === "string" && quote.sampleImageUrl.startsWith("http")) {
      mediaUrls2 = [quote.sampleImageUrl];
    }
    // לוג זיהוי עם תוצאה סופית
    console.log("QuoteCard: mediaUrls to send to QuoteDetails:", mediaUrls2);
  } catch (err) {
    console.warn("שגיאה בעיבוד quote.media_urls:", { value: quote.media_urls, error: err });
    mediaUrls2 = [];
  }

  // --- WHATSAPP LOGIC START ---
  const handleWhatsAppReveal = async () => {
    // Log the WhatsApp reveal the same way as phone reveals with saveReferral
    if (
      quote &&
      quote.professional &&
      (quote.professional.phoneNumber || quote.professional.phone)
    ) {
      try {
        await saveReferral(
          // Use user ID if available, fallback to ''
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

  // Don't render the card at all if it shouldn't be displayed
  if (!shouldDisplayQuote && requestStatus !== 'active') {
    return null;
  }
  
  // Show a loading state while verifying the acceptance status from DB
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
            {/* רק אם mediaUrls לא ריק, תציג גלריה */}
            <ProfessionalInfo professional={quote.professional} />
            {/* עדכון מרכזי: שליחת mediaUrls כפי שעובדנו */}
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
                {/* WhatsApp Button only for accepted quotes and if phone number present */}
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
                autoReveal={isAcceptedQuote} // Auto reveal for accepted quotes
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
