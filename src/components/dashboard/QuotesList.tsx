
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
  // Ensure quotes is always a valid array
  const safeQuotes = Array.isArray(quotes) ? quotes : [];
  
  // Check if quotes is empty
  if (safeQuotes.length === 0) {
    return <div className="text-gray-500 text-center py-4">אין הצעות מחיר זמינות</div>;
  }
  
  // Make sure we have valid quotes with necessary data
  const validQuotes = safeQuotes.filter(quote => 
    quote && quote.id && quote.professional && quote.professional.id
  );
  
  // If no valid quotes after filtering, show message
  if (validQuotes.length === 0) {
    return <div className="text-gray-500 text-center py-4">התקבלו נתוני הצעות לא תקינים</div>;
  }
  
  // Check if any quote is accepted
  const hasAcceptedQuote = validQuotes.some(quote => quote?.status === 'accepted');
  console.log("Has accepted quote:", hasAcceptedQuote);
  
  // Sort quotes to show accepted quotes first, then pending, then rejected
  const sortedQuotes = [...validQuotes].sort((a, b) => {
    // Accepted quotes first
    if (a?.status === 'accepted') return -1;
    if (b?.status === 'accepted') return 1;
    
    // Then pending quotes
    if (a?.status === 'pending' && b?.status !== 'pending') return -1;
    if (b?.status === 'pending' && a?.status !== 'pending') return 1;
    
    // Everything else by creation date (newer first)
    // Use the timestamp property from quotes, with safe type handling
    const getTimestamp = (quote: QuoteInterface | null | undefined) => {
      if (!quote) return Date.now();
      
      // Check if the quote object has created_at property
      const createdAt = quote as unknown as { created_at?: string | number | Date };
      if (createdAt && createdAt.created_at) {
        return new Date(createdAt.created_at).getTime();
      }
      
      return Date.now(); // Fallback
    };
    
    return getTimestamp(b) - getTimestamp(a);
  });
  
  return (
    <div className="space-y-4">
      {sortedQuotes.map(quote => {
        // Skip rendering if quote is missing critical data
        if (!quote || !quote.id || !quote.professional || !quote.professional.id) {
          console.warn("Skipping invalid quote in QuotesList:", quote);
          return null;
        }
        
        return (
          <ErrorBoundary key={quote.id} fallback={
            <div className="p-3 bg-red-50 rounded-md text-sm">
              שגיאה בטעינת הצעת המחיר
            </div>
          }>
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
