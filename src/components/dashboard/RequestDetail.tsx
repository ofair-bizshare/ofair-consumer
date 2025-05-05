
import React from 'react';
import { Button } from '@/components/ui/button';
import { Clock, CheckCircle, AlertCircle, Star } from 'lucide-react';
import { RequestInterface, QuoteInterface } from '@/types/dashboard';
import QuotesList from './QuotesList';

interface RequestDetailProps {
  request: RequestInterface;
  quotes: QuoteInterface[];
  onAcceptQuote: (quoteId: string) => void;
  onRejectQuote: (quoteId: string) => void;
  onViewProfile: (professionalId: string) => void;
}

const RequestDetail: React.FC<RequestDetailProps> = ({ 
  request, 
  quotes, 
  onAcceptQuote, 
  onRejectQuote, 
  onViewProfile 
}) => {
  // Find the accepted quote (if any)
  const acceptedQuote = quotes.find(q => q.status === 'accepted');
  
  // Generate review link with professional phone number
  const getReviewLink = () => {
    if (!acceptedQuote) return '#';
    const phone = acceptedQuote.professional.phoneNumber || 
                  acceptedQuote.professional.phone || '';
    return `https://review.ofair.co.il/${phone.replace(/[^0-9]/g, '')}`;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="glass-card p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-2xl font-semibold text-blue-700">{request.title}</h2>
            <p className="text-gray-500">{request.date} | {request.location}</p>
          </div>
          <div className="flex items-center text-sm bg-blue-50 text-blue-700 px-3 py-1 rounded-full">
            {request.status === 'active' ? (
              <>
                <Clock className="h-4 w-4 ml-1" />
                פעיל
              </>
            ) : request.status === 'waiting_for_rating' ? (
              <>
                <Star className="h-4 w-4 ml-1" />
                ממתין לדירוג
              </>
            ) : (
              <>
                <CheckCircle className="h-4 w-4 ml-1" />
                הושלם
              </>
            )}
          </div>
        </div>
        
        <p className="text-gray-700 mb-4">
          {request.description}
        </p>
        
        {/* Show review button when status is waiting_for_rating */}
        {request.status === 'waiting_for_rating' && acceptedQuote && (
          <div className="my-4 p-3 bg-amber-50 border border-amber-200 rounded-md">
            <p className="text-amber-800 mb-3 text-sm">
              אנא דרג את החוויה שלך עם {acceptedQuote.professional.name} כדי לסייע למשתמשים אחרים
            </p>
            <Button 
              className="bg-amber-500 hover:bg-amber-600 text-white"
              onClick={() => window.open(getReviewLink(), '_blank')}
            >
              <Star className="h-4 w-4 ml-1" />
              דרג את בעל המקצוע
            </Button>
          </div>
        )}
        
        <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
          <p className="text-gray-500 text-sm">
            הצעות מחיר: <span className="font-medium text-blue-700">{quotes.length}</span>
          </p>
          <Button 
            variant="outline" 
            size="sm"
            className="text-red-500 border-red-200 hover:bg-red-50"
          >
            מחק בקשה
          </Button>
        </div>
      </div>
      
      {quotes.length > 0 ? (
        <div>
          <h3 className="text-xl font-semibold mb-4">הצעות מחיר שהתקבלו</h3>
          <QuotesList 
            quotes={quotes} 
            onAcceptQuote={onAcceptQuote} 
            onRejectQuote={onRejectQuote} 
            onViewProfile={onViewProfile} 
          />
        </div>
      ) : (
        <NoQuotesMessage />
      )}
    </div>
  );
};

const NoQuotesMessage = () => (
  <div className="text-center py-12 glass-card">
    <AlertCircle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
    <h3 className="text-xl font-semibold text-gray-700 mb-2">אין הצעות מחיר עדיין</h3>
    <p className="text-gray-500 mb-4">
      עדיין לא התקבלו הצעות מחיר לבקשה זו. בדרך כלל לוקח 24-48 שעות לקבלת הצעות.
    </p>
    <Button variant="outline" className="border-[#00D09E] text-[#00D09E] hover:bg-[#00D09E]/10">
      רענן
    </Button>
  </div>
);

export default RequestDetail;
