
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
    <div className={`p-2 ${isMobile ? 'grid grid-cols-1 gap-2' : 'flex justify-between items-center gap-2'} bg-gray-50`}>
      <div className={`${isMobile ? 'flex justify-between w-full' : 'flex gap-2 space-x-reverse'}`}>
        {isInteractive && (
          <Button 
            variant={isContactActive ? "default" : "outline"}
            size="sm"
            className={`text-xs ${isContactActive ? 'bg-blue-600' : 'border-gray-300'}`}
            onClick={onContactClick}
          >
            <MessageSquare size={12} className="ml-1" />
            <span>{isContactActive ? 'חזור' : 'שלח הודעה'}</span>
          </Button>
        )}
        
        <QuoteDetailDialog 
          professional={professional}
          onViewProfile={onViewProfile}
        />
      </div>
      
      {showActionButtons ? (
        <div className={`${isMobile ? 'flex justify-center gap-2 w-full' : 'flex gap-2 space-x-reverse'}`}>
          {/* For accepted quotes */}
          {quoteStatus === 'accepted' ? (
            <Button 
              size="sm" 
              variant="outline"
              className="border-red-500 text-red-500 hover:bg-red-50 text-xs"
              onClick={() => setShowCancelConfirm(true)}
            >
              בטל קבלת הצעה
            </Button>
          ) : (
            /* For non-accepted quotes in active requests */
            <>
              {!hasAcceptedQuote && quoteStatus !== 'rejected' && (
                <div className="flex gap-2 justify-center w-full">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="border-red-500 text-red-500 hover:bg-red-50 text-xs"
                    onClick={() => onRejectQuote(quoteId)}
                  >
                    דחה
                  </Button>
                  
                  <Button 
                    size="sm"
                    className="bg-teal-500 hover:bg-teal-600 text-xs"
                    onClick={() => onAcceptQuote(quoteId)}
                  >
                    קבל הצעה
                  </Button>
                </div>
              )}
              {quoteStatus === 'rejected' && (
                <span className="text-xs text-gray-500">הצעה נדחתה</span>
              )}
              {hasAcceptedQuote && quoteStatus === 'pending' && (
                <span className="text-xs text-gray-500">הצעה אחרת התקבלה</span>
              )}
            </>
          )}
        </div>
      ) : (
        <div className="text-center w-full">
          {isAcceptedQuote ? (
            requestStatus === 'completed' ? (
              <span className="text-xs text-green-500">העבודה הושלמה</span>
            ) : requestStatus === 'waiting_for_rating' ? (
              <span className="text-xs text-amber-500 font-medium">ממתין לדירוג</span>
            ) : (
              <span className="text-xs text-green-500">הצעה התקבלה</span>
            )
          ) : (
            quoteStatus === 'rejected' ? (
              <span className="text-xs text-red-500">הצעה נדחתה</span>
            ) : (
              <span className="text-xs text-gray-500">לא זמין</span>
            )
          )}
        </div>
      )}

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
