
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
    <div className={`mt-3 rounded-md p-3 flex items-center ${
      isWaitingForRating 
        ? 'bg-amber-50 border border-amber-200' 
        : 'bg-green-50 border border-green-200'
    }`}>
      {isWaitingForRating ? (
        <Star className="h-5 w-5 text-amber-500 ml-2 shrink-0" />
      ) : (
        <CheckCircle className="h-5 w-5 text-green-500 ml-2 shrink-0" />
      )}
      
      <div className={`${isMobile ? 'text-sm' : ''}`}>
        <p className={`font-semibold ${isWaitingForRating ? 'text-amber-700' : 'text-green-700'}`}>
          {isWaitingForRating ? 'הצעה זו התקבלה - ממתין לדירוג' : 'הצעה זו התקבלה'}
        </p>
        
        {isCompleted ? (
          <p className={`${isMobile ? 'text-xs' : 'text-sm'} text-green-600`}>העבודה הושלמה ודורגה</p>
        ) : isWaitingForRating ? (
          <p className={`${isMobile ? 'text-xs' : 'text-sm'} text-amber-600 font-medium`}>נא לדרג את בעל המקצוע</p>
        ) : (
          <p className={`${isMobile ? 'text-xs' : 'text-sm'} text-green-600`}>בעל המקצוע קיבל הודעה על כך</p>
        )}
      </div>
    </div>
  );
};

export default AcceptedQuoteStatus;
