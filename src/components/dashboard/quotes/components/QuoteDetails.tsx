
import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

interface QuoteDetailsProps {
  price: string;
  estimatedTime: string;
  description: string;
  sampleImageUrl?: string;
}

const QuoteDetails: React.FC<QuoteDetailsProps> = ({
  price,
  estimatedTime,
  description,
  sampleImageUrl
}) => {
  const isMobile = useIsMobile();
  
  return (
    <div className="mt-4 space-y-2">
      <div className={`flex ${isMobile ? 'flex-col space-y-2' : 'space-x-6 space-x-reverse'}`}>
        <div className="flex items-center">
          <span className="font-semibold ml-2">מחיר:</span>
          <span className="text-blue-600 font-medium">₪{price}</span>
        </div>
        
        {estimatedTime && (
          <div className="flex items-center">
            <span className="font-semibold ml-2">זמן משוער:</span>
            <span>{estimatedTime}</span>
          </div>
        )}
      </div>
      
      {description && (
        <div className="mt-2">
          <p className="text-gray-700 text-sm line-clamp-3">{description}</p>
        </div>
      )}
      
      {sampleImageUrl && (
        <div className="mt-3">
          <img 
            src={sampleImageUrl} 
            alt="דוגמת עבודה" 
            className="rounded-md max-h-24 object-cover" 
          />
        </div>
      )}
    </div>
  );
};

export default QuoteDetails;
