
import React from 'react';
import { QuoteInterface } from '@/types/dashboard';
import QuoteCard from './quotes/QuoteCard';

interface QuotesListProps {
  quotes: QuoteInterface[];
  onAcceptQuote: (quoteId: string) => void;
  onRejectQuote: (quoteId: string) => void;
  onViewProfile: (professionalId: string) => void;
  requestStatus?: string; // Add request status prop
}

const QuotesList: React.FC<QuotesListProps> = ({ 
  quotes, 
  onAcceptQuote, 
  onRejectQuote, 
  onViewProfile,
  requestStatus = 'active' // Default to active
}) => {
  const hasAcceptedQuote = quotes.some(quote => quote.status === 'accepted');
  
  // If request is completed, only show the accepted quote
  const displayQuotes = requestStatus === 'completed' 
    ? quotes.filter(quote => quote.status === 'accepted')
    : quotes;
  
  return (
    <div className="space-y-4">
      {displayQuotes.map(quote => (
        <QuoteCard 
          key={quote.id} 
          quote={quote} 
          onAcceptQuote={onAcceptQuote}
          onRejectQuote={onRejectQuote}
          onViewProfile={onViewProfile}
          hasAcceptedQuote={hasAcceptedQuote}
          requestStatus={requestStatus} // Pass request status to QuoteCard
        />
      ))}
    </div>
  );
};

export default QuotesList;
