
import React from 'react';
import ProfessionalInfo from './components/ProfessionalInfo';
import QuoteDetails from './components/QuoteDetails';
import { QuoteInterface } from '@/types/dashboard';

interface QuoteMainDetailsProps {
  quote: QuoteInterface;
  isMobile: boolean;
  mediaUrls: string[];
}

const QuoteMainDetails: React.FC<QuoteMainDetailsProps> = ({ quote, isMobile, mediaUrls }) => (
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

export default QuoteMainDetails;
