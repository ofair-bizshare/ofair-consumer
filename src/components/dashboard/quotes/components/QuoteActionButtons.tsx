
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
  onContactClick,
  onViewProfile,
  onAcceptQuote,
  onRejectQuote,
  showCancelConfirm,
  setShowCancelConfirm,
  professional
}) => {
  const isMobile = useIsMobile();

  return (
    <div className={`p-3 ${isMobile ? 'flex flex-col gap-2' : 'flex flex-wrap justify-between items-center gap-2'} bg-gray-50`}>
      <div className={`${isMobile ? 'flex justify-between w-full' : 'flex space-x-2 space-x-reverse'}`}>
        {isInteractive && (
          <Button 
            variant={isContactActive ? "default" : "outline"}
            size="sm"
            className={`space-x-1 space-x-reverse ${isContactActive ? 'bg-blue-600' : 'border-gray-300'}`}
            onClick={onContactClick}
          >
            <MessageSquare size={16} />
            <span>{isContactActive ? 'חזור' : 'שלח הודעה'}</span>
          </Button>
        )}
        
        <QuoteDetailDialog 
          professional={professional}
          onViewProfile={onViewProfile}
        />
      </div>
      
      <div className={`${isMobile ? 'w-full' : 'flex space-x-2 space-x-reverse'}`}>
        {showActionButtons ? (
          // For accepted quotes
          quoteStatus === 'accepted' ? (
            <Button 
              size="sm" 
              variant="outline"
              className="border-red-500 text-red-500 hover:bg-red-50 w-full md:w-auto"
              onClick={() => setShowCancelConfirm(true)}
            >
              בטל קבלת הצעה
            </Button>
          ) : (
            // For non-accepted quotes in active requests
            <div className={`${isMobile ? 'flex flex-col space-y-2' : 'flex space-x-2 space-x-reverse'}`}>
              {!hasAcceptedQuote && quoteStatus !== 'rejected' && (
                <>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="border-red-500 text-red-500 hover:bg-red-50"
                    onClick={() => onRejectQuote(quoteId)}
                  >
                    דחה הצעה
                  </Button>
                  
                  <Button 
                    size="sm"
                    className="bg-teal-500 hover:bg-teal-600"
                    onClick={() => onAcceptQuote(quoteId)}
                  >
                    קבל הצעה
                  </Button>
                </>
              )}
              {quoteStatus === 'rejected' && (
                <span className={`text-sm text-gray-500 ${isMobile ? 'text-center mt-2' : ''}`}>הצעה נדחתה</span>
              )}
              {hasAcceptedQuote && quoteStatus === 'pending' && (
                <span className={`text-sm text-gray-500 ${isMobile ? 'text-center mt-2' : ''}`}>הצעה אחרת התקבלה</span>
              )}
            </div>
          )
        ) : (
          // Show status messages for non-interactive quotes
          isAcceptedQuote ? (
            requestStatus === 'completed' ? (
              <span className={`text-sm text-green-500 ${isMobile ? 'text-center w-full' : ''}`}>העבודה הושלמה</span>
            ) : requestStatus === 'waiting_for_rating' ? (
              <span className={`text-sm text-amber-500 font-medium ${isMobile ? 'text-center w-full' : ''}`}>ממתין לדירוג</span>
            ) : (
              <span className={`text-sm text-green-500 ${isMobile ? 'text-center w-full' : ''}`}>הצעה התקבלה</span>
            )
          ) : (
            quoteStatus === 'rejected' ? (
              <span className={`text-sm text-red-500 ${isMobile ? 'text-center w-full' : ''}`}>הצעה נדחתה</span>
            ) : (
              <span className={`text-sm text-gray-500 ${isMobile ? 'text-center w-full' : ''}`}>לא זמין</span>
            )
          )
        )}
      </div>

      {/* Always include the dialog but only show it when showCancelConfirm is true */}
      <QuoteCancelDialog 
        open={showCancelConfirm} 
        onOpenChange={setShowCancelConfirm}
        onConfirm={() => onRejectQuote(quoteId)}
      />
    </div>
  );
};

export default QuoteActionButtons;
