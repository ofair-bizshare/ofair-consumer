
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star, MessageSquare, Eye, CheckCircle } from 'lucide-react';
import { QuoteInterface } from '@/types/dashboard';
import QuoteDetailDialog from './QuoteDetailDialog';
import QuoteCancelDialog from './QuoteCancelDialog';

interface QuoteCardProps {
  quote: QuoteInterface;
  onAcceptQuote: (quoteId: string) => void;
  onRejectQuote: (quoteId: string) => void;
  onViewProfile: (professionalId: string) => void;
  hasAcceptedQuote: boolean;
}

const QuoteCard: React.FC<QuoteCardProps> = ({ 
  quote, 
  onAcceptQuote, 
  onRejectQuote, 
  onViewProfile,
  hasAcceptedQuote
}) => {
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [isContactActive, setIsContactActive] = useState(false);
  
  const handleAcceptClick = () => {
    if (quote.status === 'accepted') {
      setShowCancelConfirm(true);
    } else {
      onAcceptQuote(quote.id);
    }
  };
  
  const handleCancelAccept = () => {
    onRejectQuote(quote.id);
    setShowCancelConfirm(false);
  };

  const handleContactClick = () => {
    setIsContactActive(!isContactActive);
  };
  
  return (
    <Card className="overflow-hidden mb-8">
      <CardContent className="p-0">
        <div className="p-5 border-b border-gray-100">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-lg font-semibold">{quote.professional.name}</h3>
              <p className="text-gray-500 text-sm">{quote.professional.profession}</p>
            </div>
            <div className="flex items-center space-x-1">
              <span className="text-sm font-medium">{quote.professional.rating}</span>
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="text-xs text-gray-500">({quote.professional.reviewCount})</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-sm text-gray-500 mb-1">מחיר מוצע</p>
              <p className="font-semibold text-blue-700">{quote.price} ₪</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">זמן משוער</p>
              <p className="font-semibold">{quote.estimatedTime}</p>
            </div>
          </div>
          
          <div className="mb-3">
            <p className="text-gray-700">
              {quote.description}
            </p>
          </div>
          
          {quote.status === 'accepted' && (
            <div className="mt-3 bg-green-50 border border-green-200 rounded-md p-3 flex items-center">
              <CheckCircle className="h-5 w-5 text-green-500 ml-2" />
              <div>
                <p className="font-semibold text-green-700">הצעה זו התקבלה</p>
                <p className="text-sm text-green-600">בעל המקצוע קיבל הודעה על כך</p>
              </div>
            </div>
          )}
        </div>
        
        <div className="p-4 flex flex-wrap justify-between items-center gap-2 bg-gray-50">
          <div className="flex space-x-2 space-x-reverse">
            <Button 
              variant={isContactActive ? "default" : "outline"}
              size="sm"
              className={`space-x-1 space-x-reverse ${isContactActive ? 'bg-blue-600' : 'border-gray-300'}`}
              onClick={handleContactClick}
            >
              <MessageSquare size={16} />
              <span>{isContactActive ? 'חזור' : 'שלח הודעה'}</span>
            </Button>
            
            <QuoteDetailDialog 
              professional={quote.professional}
              onViewProfile={onViewProfile}
            />
          </div>
          
          <div className="flex space-x-2 space-x-reverse">
            {quote.status === 'accepted' ? (
              <QuoteCancelDialog 
                open={showCancelConfirm} 
                onOpenChange={setShowCancelConfirm}
                onConfirm={handleCancelAccept}
              />
            ) : (
              <>
                {!hasAcceptedQuote && quote.status !== 'rejected' && (
                  <>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="border-red-500 text-red-500 hover:bg-red-50"
                      onClick={() => onRejectQuote(quote.id)}
                    >
                      דחה הצעה
                    </Button>
                    
                    <Button 
                      size="sm"
                      className="bg-teal-500 hover:bg-teal-600"
                      onClick={handleAcceptClick}
                    >
                      קבל הצעה
                    </Button>
                  </>
                )}
                {quote.status === 'rejected' && (
                  <span className="text-sm text-gray-500">הצעה נדחתה</span>
                )}
                {hasAcceptedQuote && quote.status === 'pending' && (
                  <span className="text-sm text-gray-500">הצעה אחרת התקבלה</span>
                )}
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuoteCard;
