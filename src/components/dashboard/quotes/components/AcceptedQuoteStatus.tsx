import React from 'react';
import { CheckCircle, Star } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';
interface AcceptedQuoteStatusProps {
  isCompleted: boolean;
  isWaitingForRating: boolean;
  onRatingClick?: () => void; // Added callback prop for direct dialog opening
}
const AcceptedQuoteStatus: React.FC<AcceptedQuoteStatusProps> = ({
  isCompleted,
  isWaitingForRating,
  onRatingClick
}) => {
  const isMobile = useIsMobile();

  // Improved function to directly trigger the rating dialog
  const handleRatingClick = () => {
    if (onRatingClick) {
      // Call the parent-provided callback to open the dialog directly
      onRatingClick();
      console.log("Rating button clicked in AcceptedQuoteStatus, triggering parent callback");
    } else {
      console.warn("Rating button clicked but no onRatingClick handler was provided");

      // Fallback method: try to find and scroll to rating section
      const ratingSection = document.getElementById('rating-section-button');
      if (ratingSection) {
        ratingSection.scrollIntoView({
          behavior: 'smooth'
        });

        // Programmatically click the rating button after scrolling
        setTimeout(() => {
          if (ratingSection) {
            console.log("Attempting to click rating section button via fallback method");
            ratingSection.click();
          }
        }, 500);
      } else {
        console.error("Rating section not found in document");
      }
    }
  };
  return <div className={`mt-2 rounded-md p-2 flex items-center ${isWaitingForRating ? 'bg-amber-50 border border-amber-200' : 'bg-green-50 border border-green-200'}`}>
      {isWaitingForRating ? <Star className="h-4 w-4 text-amber-500 ml-2 shrink-0" /> : <CheckCircle className="h-4 w-4 text-green-500 ml-2 shrink-0" />}
      
      <div className="flex-1">
        <p className="text-amber-600 text-lg">
          {isWaitingForRating ? 'הצעה זו התקבלה - ממתין לדירוג' : 'הצעה זו התקבלה'}
        </p>
        
        {isCompleted ? <p className="text-xs text-green-600">העבודה הושלמה ודורגה</p> : isWaitingForRating ? <div className="flex flex-col mt-1">
            <p className="text-amber-600 mb-2 font-medium text-sm">נא לדרג את בעל המקצוע לסיום התהליך</p>
            
            <Button onClick={handleRatingClick} size="sm" data-testid="rate-now-button" className="bg-amber-500 hover:bg-amber-600 text-white py-1 px-3 rounded inline-block text-sm">
              <Star className="h-3 w-3 inline-block ml-1" />
              דרג עכשיו
            </Button>
          </div> : <p className="text-xs text-green-600">בעל המקצוע קיבל הודעה על כך</p>}
      </div>
    </div>;
};
export default AcceptedQuoteStatus;