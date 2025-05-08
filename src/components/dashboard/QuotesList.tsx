
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
  quotes, 
  onAcceptQuote, 
  onRejectQuote, 
  onViewProfile,
  requestStatus = 'active'
}) => {
  const hasAcceptedQuote = quotes.some(quote => quote.status === 'accepted');
  
  // Sort quotes to show accepted quotes first
  const sortedQuotes = [...quotes].sort((a, b) => {
    if (a.status === 'accepted') return -1;
    if (b.status === 'accepted') return 1;
    return 0;
  });
  
  return (
    <div className="space-y-4">
      {sortedQuotes.map(quote => (
        <QuoteCard 
          key={quote.id} 
          quote={quote} 
          onAcceptQuote={onAcceptQuote}
          onRejectQuote={onRejectQuote}
          onViewProfile={onViewProfile}
          hasAcceptedQuote={hasAcceptedQuote}
          requestStatus={requestStatus}
        />
      ))}
    </div>
  );
};

export default QuotesList;
