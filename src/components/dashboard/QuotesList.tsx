
import React from 'react';
import { QuoteInterface } from '@/types/dashboard';
import QuoteCard from './quotes/QuoteCard';
import ErrorBoundary from '@/components/ui/error-boundary';

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
  
  // Make sure we have valid quotes with necessary data
  const validQuotes = safeQuotes.filter(quote => 
    quote && quote.id && quote.professional
  );
  
  // If no valid quotes after filtering, show message
  if (validQuotes.length === 0) {
    return <div className="text-gray-500 text-center py-4">Invalid quote data received.</div>;
  }
  
  const hasAcceptedQuote = validQuotes.some(quote => quote?.status === 'accepted');
  
  // Sort quotes to show accepted quotes first
  const sortedQuotes = [...validQuotes].sort((a, b) => {
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
          <ErrorBoundary key={quote.id} fallback={<div className="p-3 bg-red-50 rounded-md text-sm">שגיאה בטעינת הצעת המחיר</div>}>
            <QuoteCard 
              key={quote.id} 
              quote={quote} 
              onAcceptQuote={onAcceptQuote}
              onRejectQuote={onRejectQuote}
              onViewProfile={onViewProfile}
              hasAcceptedQuote={hasAcceptedQuote}
              requestStatus={requestStatus}
            />
          </ErrorBoundary>
        );
      })}
    </div>
  );
};

export default QuotesList;
