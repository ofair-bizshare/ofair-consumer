
import React from 'react';
import { QuoteInterface } from '@/types/dashboard';
import QuoteCard from './quotes/QuoteCard';

interface QuotesListProps {
  quotes: QuoteInterface[];
  onAcceptQuote: (quoteId: string) => void;
  onRejectQuote: (quoteId: string) => void;
  onViewProfile: (professionalId: string) => void;
  requestStatus?: string;
}

const QuotesList: React.FC<QuotesListProps> = ({ 
  quotes = [], // Default to empty array
  onAcceptQuote, 
  onRejectQuote, 
  onViewProfile,
  requestStatus = 'active'
}) => {
  // Ensure quotes is always an array
  const safeQuotes = Array.isArray(quotes) ? quotes : [];
  
  // Check if quotes is empty
  if (safeQuotes.length === 0) {
    return <div className="text-gray-500 text-center py-4">No quotes available.</div>;
  }
  
  const hasAcceptedQuote = safeQuotes.some(quote => quote?.status === 'accepted');
  
  // Sort quotes to show accepted quotes first
  const sortedQuotes = [...safeQuotes].sort((a, b) => {
    if (a?.status === 'accepted') return -1;
    if (b?.status === 'accepted') return 1;
    return 0;
  });
  
  return (
    <div className="space-y-4">
      {sortedQuotes.map(quote => {
        // Skip rendering if quote is missing critical data
        if (!quote || !quote.id || !quote.professional) {
          console.warn("Skipping invalid quote in QuotesList:", quote);
          return null;
        }
        
        return (
          <QuoteCard 
            key={quote.id} 
            quote={quote} 
            onAcceptQuote={onAcceptQuote}
            onRejectQuote={onRejectQuote}
            onViewProfile={onViewProfile}
            hasAcceptedQuote={hasAcceptedQuote}
            requestStatus={requestStatus}
          />
        );
      })}
    </div>
  );
};

export default QuotesList;
