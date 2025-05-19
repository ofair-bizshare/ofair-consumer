import { useAuth } from '@/providers/AuthProvider';
import { Button } from '@/components/ui/button';
import { QuoteInterface } from '@/types/dashboard';
import { acceptQuoteApi } from './useQuoteAcceptApi';
import { useQuoteAcceptNotifications } from './useQuoteAcceptNotifications';

interface UseQuoteAcceptParams {
  quotes: QuoteInterface[];
  setQuotes: React.Dispatch<React.SetStateAction<QuoteInterface[]>>;
  setLastAcceptedQuoteId: React.Dispatch<React.SetStateAction<string | null>>;
  refreshQuotes: (requestId: string) => Promise<void>;
  selectedRequestId: string | null;
  setIsProcessing: (b: boolean) => void;
}

export const useQuoteAccept = ({
  quotes,
  setQuotes,
  setLastAcceptedQuoteId,
  refreshQuotes,
  selectedRequestId,
  setIsProcessing,
  onShowRating
}: UseQuoteAcceptParams & { onShowRating?: (quoteId: string) => void }) => {
  const { user } = useAuth();
  const notifications = useQuoteAcceptNotifications();

  const processQuoteAcceptance = async (
    quoteId: string,
    paymentMethod: 'cash' | 'credit'
  ) => {
    setIsProcessing(true);
    try {
      const result = await acceptQuoteApi({
        quotes,
        user,
        quoteId,
        paymentMethod,
        setQuotes,
        setLastAcceptedQuoteId,
        refreshQuotes,
        selectedRequestId,
      });

      // Error cases
      if (!result.acceptedQuote) {
        setIsProcessing(false);
        return;
      }
      if (result.isAlreadyAccepted) {
        notifications.notifyAlreadyAccepted();
        setIsProcessing(false);
        if (typeof onShowRating === 'function') {
          onShowRating(quoteId);
        }
        return;
      }
      if (!result.success) {
        notifications.notifyAcceptError();
        setIsProcessing(false);
        return;
      }

      // Payment method logic and notifications
      if (paymentMethod === 'credit') {
        notifications.notifyPaymentRedirect();
        // Payment redirection
        import('@/services/quotes').then(({ redirectToPayment }) => {
          redirectToPayment(quoteId, result.quotePrice);
        });
        if (typeof onShowRating === 'function') {
          setTimeout(() => { onShowRating(quoteId); }, 1200);
        }
        setIsProcessing(false);
        return;
      }

      notifications.notifyAccepted();

      // Toast with link to rate
      notifications.notifyAcceptWithRating(() => {
        setTimeout(() => {
          window.location.hash = '#rating-section';
          if (typeof onShowRating === 'function') {
            onShowRating(quoteId);
          }
        }, 250);
      });

      // Auto show rating dialog
      if (typeof onShowRating === 'function') {
        setTimeout(() => { onShowRating(quoteId); }, 1200);
      }
    } catch (error) {
      notifications.notifyGeneralError();
    } finally {
      setIsProcessing(false);
    }
  };

  return { processQuoteAcceptance };
};
