
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star, MessageSquare, CheckCircle, User } from 'lucide-react';
import { QuoteInterface } from '@/types/dashboard';
import QuoteDetailDialog from './QuoteDetailDialog';
import QuoteCancelDialog from './QuoteCancelDialog';
import PhoneRevealButton from '@/components/PhoneRevealButton';

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
  const [imageError, setImageError] = useState(false);
  
  // Ensure the price is properly formatted as a string
  const formattedPrice = typeof quote.price === 'string' ? quote.price : String(quote.price);
  
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
  
  const professionalImage = quote.professional.image || quote.professional.image_url;
  
  return (
    <Card className="overflow-hidden mb-8 shadow-md hover:shadow-lg transition-shadow">
      <CardContent className="p-0">
        <div className="p-5 border-b border-gray-100">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center">
              <div className="w-14 h-14 overflow-hidden rounded-full bg-gray-100 mr-3 flex-shrink-0 border border-gray-200">
                {!imageError && professionalImage ? (
                  <img 
                    src={professionalImage} 
                    alt={quote.professional.name}
                    className="w-full h-full object-cover"
                    onError={() => setImageError(true)}
                  />
                ) : (
                  <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                    <User className="text-gray-400 w-7 h-7" />
                  </div>
                )}
              </div>
              <div>
                <h3 className="text-lg font-semibold flex items-center">
                  {quote.professional.name}
                  {quote.professional.is_verified && (
                    <span className="mr-1 bg-blue-50 text-blue-600 text-xs px-2 py-0.5 rounded-full">
                      מאומת ✓
                    </span>
                  )}
                </h3>
                <p className="text-gray-500 text-sm">{quote.professional.profession}</p>
              </div>
            </div>
            <div className="flex items-center space-x-1">
              <span className="text-sm font-medium">{quote.professional.rating || "0"}</span>
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="text-xs text-gray-500">({quote.professional.reviewCount || "0"})</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-sm text-gray-500 mb-1">מחיר מוצע</p>
              <p className="font-semibold text-blue-700">{formattedPrice} ₪</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">זמן משוער</p>
              <p className="font-semibold">{quote.estimatedTime || "לא צוין"}</p>
            </div>
          </div>
          
          {quote.sampleImageUrl && (
            <div className="mb-3">
              <img 
                src={quote.sampleImageUrl}
                alt="תמונת דוגמה" 
                className="w-full max-h-48 object-cover rounded-md border border-gray-200"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            </div>
          )}
          
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
          
          <div className="mt-4">
            <PhoneRevealButton 
              phoneNumber={quote.professional.phoneNumber || "050-1234567"}
              professionalName={quote.professional.name}
              professionalId={quote.professional.id}
              profession={quote.professional.profession}
              autoReveal={quote.status === 'accepted'} // Auto reveal for accepted quotes
            />
          </div>
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
