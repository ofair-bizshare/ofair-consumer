
import React from 'react';

interface QuoteDetailsProps {
  price: string | number;
  estimatedTime?: string;
  sampleImageUrl?: string | null;
  description: string;
}

const QuoteDetails: React.FC<QuoteDetailsProps> = ({ 
  price, 
  estimatedTime, 
  sampleImageUrl, 
  description 
}) => {
  // Ensure the price is properly formatted as a string with a default value
  const formattedPrice = typeof price === 'string' && price.length > 0
    ? price
    : typeof price === 'number'
      ? String(price)
      : "0";
      
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-sm text-gray-500 mb-1">מחיר מוצע</p>
          <p className="font-semibold text-blue-700">{formattedPrice} ₪</p>
        </div>
        <div>
          <p className="text-sm text-gray-500 mb-1">זמן משוער</p>
          <p className="font-semibold">{estimatedTime || "לא צוין"}</p>
        </div>
      </div>
      
      {sampleImageUrl && (
        <div className="mb-3">
          <img 
            src={sampleImageUrl}
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
          {description}
        </p>
      </div>
    </>
  );
};

export default QuoteDetails;
