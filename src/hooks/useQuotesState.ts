
import { useState, useEffect, useCallback } from 'react';
import { QuoteInterface } from '@/types/dashboard';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/providers/AuthProvider';
import { 
  fetchQuotesForRequest,
  checkIfAcceptedQuoteExists,
  updateQuoteStatus
} from '@/services/quotes';

const isAcceptedStatus = (status: string) => status === 'accepted' || status === 'approved';

export const useQuotesState = (selectedRequestId: string | null) => {
  const [quotes, setQuotes] = useState<QuoteInterface[]>([]);
  const [lastAcceptedQuoteId, setLastAcceptedQuoteId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (!selectedRequestId) return;
    refreshQuotes(selectedRequestId);
  }, [selectedRequestId]);

  const refreshQuotes = useCallback(async (requestId: string) => {
    if (!requestId) return;
    try {
      const requestQuotes = await fetchQuotesForRequest(requestId);
      if (!requestQuotes) {
        setQuotes([]);
        return;
      }
      // בדיקת הצעה מאושרת - גם approved:
      const acceptedQuote = requestQuotes.find(q => isAcceptedStatus(q.status));
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
