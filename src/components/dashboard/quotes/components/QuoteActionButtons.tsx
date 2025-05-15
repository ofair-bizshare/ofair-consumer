import React from 'react';
import { Button } from '@/components/ui/button';
import { MessageSquare } from 'lucide-react';
import QuoteDetailDialog from '../QuoteDetailDialog';
import QuoteCancelDialog from '../QuoteCancelDialog';
import { useIsMobile } from '@/hooks/use-mobile';
interface QuoteActionButtonsProps {
  requestStatus: string;
  quoteStatus: string;
  quoteId: string;
  professionalId: string;
  isInteractive: boolean;
  isContactActive: boolean;
  showActionButtons: boolean;
  hasAcceptedQuote: boolean;
  isAcceptedQuote: boolean;
  dbVerifiedAccepted?: boolean | null;
  onContactClick: () => void;
  onViewProfile: (professionalId: string) => void;
  onAcceptQuote: (quoteId: string) => void;
  onRejectQuote: (quoteId: string) => void;
  showCancelConfirm: boolean;
  setShowCancelConfirm: (show: boolean) => void;
  professional: any;
}
const QuoteActionButtons: React.FC<QuoteActionButtonsProps> = ({
  requestStatus,
  quoteStatus,
  quoteId,
  professionalId,
  isInteractive,
  isContactActive,
  showActionButtons,
  hasAcceptedQuote,
  isAcceptedQuote,
  dbVerifiedAccepted = null,
  onContactClick,
  onViewProfile,
  onAcceptQuote,
  onRejectQuote,
  showCancelConfirm,
  setShowCancelConfirm,
  professional
}) => {
  const isMobile = useIsMobile();

  // Safety check for required props
  if (!quoteId || !professionalId || !professional) {
    console.error("QuoteActionButtons missing required props:", {
      quoteId,
      professionalId,
      professional
    });
    return <div className="p-2 bg-gray-50 text-center text-xs text-gray-500">Loading actions...</div>;
  }
  const handleCancelQuoteClick = () => {
    console.log("Cancel quote button clicked for quote:", quoteId);
    setShowCancelConfirm(true);
  };
  const handleConfirmCancel = () => {
    console.log("Cancel confirmation confirmed for quote:", quoteId);
    onRejectQuote(quoteId);
    setShowCancelConfirm(false);
  };

  // Improved function to determine if action buttons should be shown
  const shouldShowActions = () => {
    // Debug logging to help track status issues
    console.log(`Quote ${quoteId} action button check:`, {
      quoteStatus,
      isAcceptedQuote,
      dbVerifiedAccepted,
      requestStatus,
      hasAcceptedQuote
    });

    // Prioritize database verification when available
    const actuallyAccepted = dbVerifiedAccepted !== null ? dbVerifiedAccepted : isAcceptedQuote;

    // For active requests
    if (requestStatus === 'active') {
      // Always show cancel button for accepted quotes
      if (actuallyAccepted || quoteStatus === 'accepted') {
        return true;
      }

      // For pending quotes, show actions if there's no accepted quote
      if (quoteStatus === 'pending' && !hasAcceptedQuote) {
        return true;
      }
    }

    // For waiting_for_rating status, show cancel for the accepted quote
    if (requestStatus === 'waiting_for_rating' && (actuallyAccepted || quoteStatus === 'accepted')) {
      return true;
    }
    return false;
  };

  // Function to determine what status message to show when actions aren't available
  const getStatusMessage = () => {
    // Prioritize database verification when available
    const actuallyAccepted = dbVerifiedAccepted !== null ? dbVerifiedAccepted : isAcceptedQuote;
    if (actuallyAccepted || quoteStatus === 'accepted') {
      if (requestStatus === 'completed') {
        return <span className="text-xs text-green-500">העבודה הושלמה</span>;
      } else if (requestStatus === 'waiting_for_rating') {
        return <span className="text-xs text-amber-500 font-medium">ממתין לדירוג</span>;
      } else {
        return <span className="text-xs text-green-500">הצעה התקבלה</span>;
      }
    } else if (quoteStatus === 'rejected') {
      return <span className="text-xs text-red-500">הצעה נדחתה</span>;
    } else if (hasAcceptedQuote && quoteStatus === 'pending') {
      return <span className="text-xs text-gray-500">הצעה אחרת התקבלה</span>;
    } else {
      // Instead of generic "Not available" message, be more specific
      return <span className="text-xs text-gray-500">פעולות לא זמינות</span>;
    }
  };
  return <div className={`p-2 ${isMobile ? 'grid grid-cols-1 gap-2' : 'flex justify-between items-center gap-2'} bg-gray-50`}>
      <div className={`${isMobile ? 'flex justify-between w-full' : 'flex gap-2 space-x-reverse'}`}>
        {isInteractive && <Button variant={isContactActive ? "default" : "outline"} size="sm" className={`text-xs ${isContactActive ? 'bg-blue-600' : 'border-gray-300'}`} onClick={onContactClick}>
            <MessageSquare size={12} className="ml-1" />
            <span>{isContactActive ? 'חזור' : 'שלח הודעה'}</span>
          </Button>}
        
        {professional && <QuoteDetailDialog professional={professional} onViewProfile={onViewProfile} />}
      </div>
      
      {shouldShowActions() ? <div className={`${isMobile ? 'flex justify-center gap-2 w-full' : 'flex gap-2 space-x-reverse'}`}>
          {/* For accepted quotes */}
          {isAcceptedQuote || quoteStatus === 'accepted' || dbVerifiedAccepted === true ? <Button size="sm" variant="outline" onClick={handleCancelQuoteClick} className="border-red-500 text-red-500 hover:bg-red-50 font-normal text-sm">
              בטל קבלת הצעה
            </Button> : (/* For non-accepted quotes in active requests */
      <>
              {!hasAcceptedQuote && quoteStatus !== 'rejected' && requestStatus === 'active' && <div className="flex gap-2 justify-center w-full">
                  <Button variant="outline" size="sm" className="border-red-500 text-red-500 hover:bg-red-50 text-xs" onClick={() => onRejectQuote(quoteId)}>
                    דחה
                  </Button>
                  
                  <Button size="sm" className="bg-teal-500 hover:bg-teal-600 text-xs" onClick={() => onAcceptQuote(quoteId)}>
                    קבל הצעה
                  </Button>
                </div>}
              {quoteStatus === 'rejected' && <span className="text-xs text-gray-500">הצעה נדחתה</span>}
              {hasAcceptedQuote && quoteStatus === 'pending' && <span className="text-xs text-gray-500">הצעה אחרת התקבלה</span>}
            </>)}
        </div> : <div className="text-center w-full">
          {getStatusMessage()}
        </div>}

      {/* QuoteCancelDialog - Always render but only show when needed */}
      <QuoteCancelDialog open={showCancelConfirm} onOpenChange={setShowCancelConfirm} onConfirm={handleConfirmCancel} />
    </div>;
};
export default QuoteActionButtons;