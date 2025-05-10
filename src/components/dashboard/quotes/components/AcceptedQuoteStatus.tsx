
import React from 'react';
import { CheckCircle, Star } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface AcceptedQuoteStatusProps {
  isCompleted: boolean;
  isWaitingForRating: boolean;
}

const AcceptedQuoteStatus: React.FC<AcceptedQuoteStatusProps> = ({ 
  isCompleted, 
  isWaitingForRating 
}) => {
  const isMobile = useIsMobile();
  
  return (
    <div className={`mt-2 rounded-md p-1.5 flex items-center ${
      isWaitingForRating 
        ? 'bg-amber-50 border border-amber-200' 
        : 'bg-green-50 border border-green-200'
    }`}>
      {isWaitingForRating ? (
        <Star className="h-3 w-3 text-amber-500 ml-1 shrink-0" />
      ) : (
        <CheckCircle className="h-3 w-3 text-green-500 ml-1 shrink-0" />
      )}
      
      <div className="flex-1">
        <p className={`font-semibold ${isMobile ? 'text-xs' : 'text-sm'} ${isWaitingForRating ? 'text-amber-700' : 'text-green-700'}`}>
          {isWaitingForRating ? 'הצעה זו התקבלה - ממתין לדירוג' : 'הצעה זו התקבלה'}
        </p>
        
        {isCompleted ? (
          <p className="text-xs text-green-600">העבודה הושלמה ודורגה</p>
        ) : isWaitingForRating ? (
          <p className="text-xs text-amber-600 font-medium">נא לדרג את בעל המקצוע</p>
        ) : (
          <p className="text-xs text-green-600">בעל המקצוע קיבל הודעה על כך</p>
        )}
      </div>
    </div>
  );
};

export default AcceptedQuoteStatus;
