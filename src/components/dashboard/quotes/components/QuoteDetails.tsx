
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
            onError={(e) => {
              // If image fails to load, replace with a default image or hide it
              e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23f3f4f6'/%3E%3Ctext x='50' y='50' font-size='12' text-anchor='middle' alignment-baseline='middle' font-family='Arial' fill='%23a1a1aa'%3ENo image%3C/text%3E%3C/svg%3E";
            }}
          />
        </div>
      )}
    </div>
  );
};

export default QuoteDetails;
