
import React from 'react';
import { QuoteInterface } from '@/types/dashboard';
import QuoteCard from './quotes/QuoteCard';

interface QuotesListProps {
  quotes: QuoteInterface[];
  onAcceptQuote: (quoteId: string) => void;
  onRejectQuote: (quoteId: string) => void;
  onViewProfile: (professionalId: string) => void;
}

const QuotesList: React.FC<QuotesListProps> = ({ 
  quotes, 
  onAcceptQuote, 
  onRejectQuote, 
  onViewProfile 
}) => {
  const hasAcceptedQuote = quotes.some(quote => quote.status === 'accepted');
  
  return (
    <div className="space-y-4">
      {quotes.map(quote => (
        <QuoteCard 
          key={quote.id} 
          quote={quote} 
          onAcceptQuote={onAcceptQuote}
          onRejectQuote={onRejectQuote}
          onViewProfile={onViewProfile}
          hasAcceptedQuote={hasAcceptedQuote}
        />
      ))}
    </div>
  );
};

export default QuotesList;
