
import { useState, useEffect, useCallback } from 'react';
import { QuoteInterface } from '@/types/dashboard';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/providers/AuthProvider';
import { 
  fetchQuotesForRequest,
  checkIfAcceptedQuoteExists,
  updateQuoteStatus
} from '@/services/quotes';

// Handles loading, state, refreshing
export const useQuotesState = (selectedRequestId: string | null) => {
  const [quotes, setQuotes] = useState<QuoteInterface[]>([]);
  const [lastAcceptedQuoteId, setLastAcceptedQuoteId] = useState<string | null>(null);
  const { toast } = useToast();

  // Load quotes when selectedRequestId changes
  useEffect(() => {
    if (!selectedRequestId) return;
    refreshQuotes(selectedRequestId);
    // eslint-disable-next-line
  }, [selectedRequestId]);

  // Function to refresh quotes
  const refreshQuotes = useCallback(async (requestId: string) => {
    if (!requestId) return;
    try {
      const requestQuotes = await fetchQuotesForRequest(requestId);
      if (!requestQuotes) {
        setQuotes([]);
        return;
      }
      // Check for an accepted quote in the fetched quotes
      const acceptedQuote = requestQuotes.find(q => q.status === 'accepted');
      if (acceptedQuote) {
        setLastAcceptedQuoteId(acceptedQuote.id);
      } else {
        for (const quote of requestQuotes) {
          const isAccepted = await checkIfAcceptedQuoteExists(requestId, quote.id);
          if (isAccepted) {
            await updateQuoteStatus(quote.id, 'accepted');
            setLastAcceptedQuoteId(quote.id);
            break;
          }
        }
      }
      setQuotes(prevQuotes => {
        const otherQuotes = prevQuotes.filter(q => q.requestId !== requestId);
        return [...otherQuotes, ...requestQuotes];
      });
    } catch (error) {
      toast({
        title: "שגיאה בטעינת הצעות מחיר",
        description: "אירעה שגיאה בטעינת הצעות המחיר, אנא נסה שוב",
        variant: "destructive",
      });
      setQuotes(prevQuotes => prevQuotes.filter(q => q.requestId !== requestId));
    }
  }, [toast]);

  return {
    quotes,
    setQuotes,
    lastAcceptedQuoteId,
    setLastAcceptedQuoteId,
    refreshQuotes
  };
};
