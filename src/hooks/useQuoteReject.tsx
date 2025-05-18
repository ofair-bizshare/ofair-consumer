
import { useToast } from '@/hooks/use-toast';
import {
  updateQuoteStatus,
  updateRequestStatus,
  checkIfAcceptedQuoteExists,
  deleteAcceptedQuote,
} from '@/services/quotes';
import { QuoteInterface } from '@/types/dashboard';

interface UseQuoteRejectParams {
  quotes: QuoteInterface[];
  setQuotes: React.Dispatch<React.SetStateAction<QuoteInterface[]>>;
  lastAcceptedQuoteId: string | null;
  setLastAcceptedQuoteId: React.Dispatch<React.SetStateAction<string | null>>;
  refreshQuotes: (requestId: string) => Promise<void>;
  setIsProcessing: (b: boolean) => void;
}

export const useQuoteReject = ({
  quotes,
  setQuotes,
  lastAcceptedQuoteId,
  setLastAcceptedQuoteId,
  refreshQuotes,
  setIsProcessing
}: UseQuoteRejectParams) => {
  const { toast } = useToast();

  const handleRejectQuote = async (quoteId: string) => {
    setIsProcessing(true);
    const rejectedQuote = quotes.find(q => q.id === quoteId);
    if (!rejectedQuote) {
      setIsProcessing(false);
      return;
    }
    try {
      if (rejectedQuote.status === 'accepted') {
        if (lastAcceptedQuoteId === quoteId) setLastAcceptedQuoteId(null);
        await deleteAcceptedQuote(quoteId);
        await updateQuoteStatus(quoteId, 'rejected');
        const quotesToUpdate = quotes.filter(
          q =>
            q.requestId === rejectedQuote.requestId &&
            q.id !== quoteId &&
            q.status !== 'accepted'
        );
        if (quotesToUpdate.length > 0) {
          await Promise.all(
            quotesToUpdate.map(quote =>
              updateQuoteStatus(quote.id, 'pending')
            )
          );
        }
        setQuotes(prevQuotes =>
          prevQuotes.map(quote =>
            quote.requestId === rejectedQuote.requestId
              ? {
                  ...quote,
                  status: quote.id === quoteId ? 'rejected' : 'pending',
                }
              : quote
          )
        );
        await updateRequestStatus(rejectedQuote.requestId, 'active');
        toast({
          title: 'קבלת הצעה בוטלה',
          description: 'אפשר לבחור הצעה אחרת כעת.',
          variant: 'default',
        });
      } else {
        await updateQuoteStatus(quoteId, 'rejected');
        setQuotes(prevQuotes =>
          prevQuotes.map(quote =>
            quote.id === quoteId
              ? { ...quote, status: 'rejected' }
              : quote
          )
        );
        toast({
          title: 'הצעה נדחתה',
          description: 'הודעה נשלחה לבעל המקצוע.',
          variant: 'default',
        });
      }
    } catch (error) {
      toast({
        title: 'שגיאה בתהליך דחיית ההצעה',
        description: 'אירעה שגיאה בתהליך. אנא נסה שוב מאוחר יותר.',
        variant: 'destructive',
      });
    } finally {
      if (rejectedQuote.requestId) await refreshQuotes(rejectedQuote.requestId);
      setIsProcessing(false);
    }
  };

  return { handleRejectQuote };
};
