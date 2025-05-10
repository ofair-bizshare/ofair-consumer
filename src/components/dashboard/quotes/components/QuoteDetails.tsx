
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
    <div className="mt-2 space-y-2">
      <div className={`flex ${isMobile ? 'flex-col gap-1' : 'flex-row gap-6 space-x-reverse'}`}>
        <div className="flex items-center">
          <span className="font-semibold ml-2 text-sm">מחיר:</span>
          <span className="text-blue-600 font-medium text-sm">₪{price}</span>
        </div>
        
        {estimatedTime && (
          <div className="flex items-center">
            <span className="font-semibold ml-2 text-sm">זמן משוער:</span>
            <span className="text-sm">{estimatedTime}</span>
          </div>
        )}
      </div>
      
      {description && (
        <div className="mt-1">
          <p className="text-gray-700 text-xs line-clamp-3">{description}</p>
        </div>
      )}
      
      {sampleImageUrl && (
        <div className="mt-2">
          <img 
            src={sampleImageUrl} 
            alt="דוגמת עבודה" 
            className="rounded-md max-h-16 object-cover" 
          />
        </div>
      )}
    </div>
  );
};

export default QuoteDetails;
