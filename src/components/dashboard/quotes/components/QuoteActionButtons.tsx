
import React from 'react';
import { Button } from '@/components/ui/button';
import { MessageSquare } from 'lucide-react';
import QuoteDetailDialog from '../QuoteDetailDialog';
import QuoteCancelDialog from '../QuoteCancelDialog';

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
  return (
    <div className="p-4 flex flex-wrap justify-between items-center gap-2 bg-gray-50">
      <div className="flex space-x-2 space-x-reverse">
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
      
      <div className="flex space-x-2 space-x-reverse">
        {showActionButtons ? (
          quoteStatus === 'accepted' ? (
            <QuoteCancelDialog 
              open={showCancelConfirm} 
              onOpenChange={setShowCancelConfirm}
              onConfirm={() => onRejectQuote(quoteId)}
            />
          ) : (
            <>
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
                <span className="text-sm text-gray-500">הצעה נדחתה</span>
              )}
              {hasAcceptedQuote && quoteStatus === 'pending' && (
                <span className="text-sm text-gray-500">הצעה אחרת התקבלה</span>
              )}
            </>
          )
        ) : (
          isAcceptedQuote ? (
            requestStatus === 'completed' ? (
              <span className="text-sm text-green-500">העבודה הושלמה</span>
            ) : requestStatus === 'waiting_for_rating' ? (
              <span className="text-sm text-amber-500">ממתין לדירוג</span>
            ) : (
              <span className="text-sm text-green-500">הצעה התקבלה</span>
            )
          ) : (
            <span className="text-sm text-gray-500">לא זמין</span>
          )
        )}
      </div>
    </div>
  );
};

export default QuoteActionButtons;
