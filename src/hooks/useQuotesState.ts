
import { useState, useEffect, useCallback } from 'react';
import { QuoteInterface } from '@/types/dashboard';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/providers/AuthProvider';
import { 
  fetchQuotesForRequest,
  checkIfAcceptedQuoteExists,
  updateQuoteStatus
} from '@/services/quotes';

export const useQuotesState = (selectedRequestId: string | null) => {
  const [quotes, setQuotes] = useState<QuoteInterface[]>([]);
  const [lastAcceptedQuoteId, setLastAcceptedQuoteId] = useState<string | null>(null);
  const { toast } = useToast();

  // Log when main state changes for deep debug
  useEffect(() => {
    console.log('[useQuotesState][debug] quotes:', quotes);
    console.log('[useQuotesState][debug] lastAcceptedQuoteId:', lastAcceptedQuoteId);
  }, [quotes, lastAcceptedQuoteId]);
  
  // Load quotes when selectedRequestId changes
  useEffect(() => {
    if (!selectedRequestId) {
      // Log on missing selection
      console.log('[useQuotesState] selectedRequestId missing, skipping refresh');
      return;
    }
    console.log('[useQuotesState] Trigger refreshQuotes for requestId:', selectedRequestId);
    refreshQuotes(selectedRequestId);
    // eslint-disable-next-line
  }, [selectedRequestId]);

  // Function to refresh quotes
  const refreshQuotes = useCallback(async (requestId: string) => {
    if (!requestId) {
      console.log('[useQuotesState][refreshQuotes] Called with no requestId');
      return;
    }
    try {
      const requestQuotes = await fetchQuotesForRequest(requestId);
      console.log('[useQuotesState][refreshQuotes] Fetched', requestQuotes.length, 'quotes for request', requestId, requestQuotes);

      if (!requestQuotes) {
        setQuotes([]);
        return;
      }
      // כמו קודם: עדכון id להצעת accepted
      const acceptedQuote = requestQuotes.find(q => q.status === 'accepted');
      if (acceptedQuote) {
        setLastAcceptedQuoteId(acceptedQuote.id);
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
