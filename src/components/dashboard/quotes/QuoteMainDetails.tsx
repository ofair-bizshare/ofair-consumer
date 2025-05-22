
import React from 'react';
import ProfessionalInfo from './components/ProfessionalInfo';
import QuoteDetails from './components/QuoteDetails';
import { QuoteInterface } from '@/types/dashboard';
import { useMediaUrls } from './useMediaUrls';

interface QuoteMainDetailsProps {
  quote: QuoteInterface;
  isMobile: boolean;
  // הסר mediaUrls כאן - תמיד ניצור אותו כאן
}

const QuoteMainDetails: React.FC<QuoteMainDetailsProps> = ({ quote, isMobile }) => {
  // בניה מחדש של mediaUrls עם לוג נוסף
  const mediaUrls = useMediaUrls(quote.media_urls, quote.sampleImageUrl);

  // לוג לניפוי שגיאות הפורמט
  console.log(
    "[QuoteMainDetails] Raw media_urls:",
    quote.media_urls,
    "| Parsed mediaUrls:",
    mediaUrls,
    "| SampleImageUrl:",
    quote.sampleImageUrl
  );

  return (
    <div className={`p-2 ${isMobile ? 'space-y-2' : 'p-4'} border-b border-gray-100`}>
      <ProfessionalInfo professional={quote.professional} />
      <QuoteDetails 
        price={quote.price || "0"} 
        estimatedTime={quote.estimatedTime || ""}
        mediaUrls={mediaUrls}
        sampleImageUrl={quote.sampleImageUrl}
        description={quote.description || ""}
      />
    </div>
  );
};

export default QuoteMainDetails;
