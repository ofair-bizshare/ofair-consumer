
import React from 'react';
import { CheckCircle } from 'lucide-react';

interface AcceptedQuoteStatusProps {
  isCompleted: boolean;
  isWaitingForRating: boolean;
}

const AcceptedQuoteStatus: React.FC<AcceptedQuoteStatusProps> = ({ 
  isCompleted, 
  isWaitingForRating 
}) => {
  return (
    <div className="mt-3 bg-green-50 border border-green-200 rounded-md p-3 flex items-center">
      <CheckCircle className="h-5 w-5 text-green-500 ml-2" />
      <div>
        <p className="font-semibold text-green-700">הצעה זו התקבלה</p>
        {isCompleted ? (
          <p className="text-sm text-green-600">העבודה הושלמה ודורגה</p>
        ) : isWaitingForRating ? (
          <p className="text-sm text-amber-600">נא לדרג את בעל המקצוע</p>
        ) : (
          <p className="text-sm text-green-600">בעל המקצוע קיבל הודעה על כך</p>
        )}
      </div>
    </div>
  );
};

export default AcceptedQuoteStatus;
