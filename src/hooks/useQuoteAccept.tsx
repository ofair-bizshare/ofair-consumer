
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/providers/AuthProvider';
import {
  updateQuoteStatus,
  updateRequestStatus,
  checkIfAcceptedQuoteExists,
  saveAcceptedQuote,
  saveReferral,
  formatPrice,
  redirectToPayment,
  createQuoteNotification,
  createRatingReminderNotification,
} from '@/services/quotes';
import { Button } from '@/components/ui/button';
import { QuoteInterface } from '@/types/dashboard';

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
  setIsProcessing
}: UseQuoteAcceptParams) => {
  const { toast } = useToast();
  const { user } = useAuth();

  const processQuoteAcceptance = async (
    quoteId: string,
    paymentMethod: 'cash' | 'credit'
  ) => {
    setIsProcessing(true);
    const acceptedQuote = quotes.find(q => q.id === quoteId);
    if (!acceptedQuote || !user) {
      setIsProcessing(false);
      return;
    }
    const quotePrice = formatPrice(acceptedQuote.price);
    try {
      const isAlreadyAccepted = await checkIfAcceptedQuoteExists(
        acceptedQuote.requestId,
        quoteId
      );
      if (isAlreadyAccepted) {
        setQuotes(prevQuotes =>
          prevQuotes.map(quote =>
            quote.id === quoteId ? { ...quote, status: 'accepted' } : quote
          )
        );
        setLastAcceptedQuoteId(quoteId);
        await createQuoteNotification(
          acceptedQuote.description,
          acceptedQuote.professional?.name || 'בעל מקצוע',
          acceptedQuote.requestId
        );
        toast({
          title: 'הצעה התקבלה',
          description: 'הצעת המחיר כבר אושרה במערכת',
          variant: 'default',
        });
        setIsProcessing(false);
        return;
      }

      const success = await updateQuoteStatus(quoteId, 'accepted');
      if (!success) {
        toast({
          title: 'שגיאה בקבלת ההצעה',
          description: 'אירעה שגיאה בקבלת ההצעה. אנא נסה שוב.',
          variant: 'destructive',
        });
        setIsProcessing(false);
        return;
      }
      setLastAcceptedQuoteId(quoteId);

      setQuotes(prevQuotes =>
        prevQuotes.map(quote =>
          quote.id === quoteId
            ? { ...quote, status: 'accepted' }
            : quote.requestId === acceptedQuote.requestId
            ? { ...quote, status: 'rejected' }
            : quote
        )
      );

      await updateRequestStatus(
        acceptedQuote.requestId,
        'waiting_for_rating'
      );

      await createQuoteNotification(
        acceptedQuote.description,
        acceptedQuote.professional?.name || 'בעל מקצוע',
        acceptedQuote.requestId
      );

      setTimeout(async () => {
        await createRatingReminderNotification(
          acceptedQuote.professional?.name || 'בעל מקצוע',
          acceptedQuote.professional?.id || ''
        );
      }, 500);

      await saveAcceptedQuote({
        user_id: user.id,
        quote_id: quoteId,
        request_id: acceptedQuote.requestId,
        professional_id: acceptedQuote.professional.id,
        professional_name: acceptedQuote.professional.name,
        price: quotePrice,
        date: new Date().toISOString(),
        status: 'accepted',
        description: acceptedQuote.description,
        payment_method: paymentMethod,
        created_at: new Date().toISOString(),
      });
      await saveReferral(
        user.id,
        acceptedQuote.professional.id,
        acceptedQuote.professional.name,
        acceptedQuote.professional.phoneNumber ||
          acceptedQuote.professional.phone ||
          '050-1234567',
        acceptedQuote.professional.profession
      );

      if (paymentMethod === 'credit') {
        toast({
          title: 'הועברת לעמוד תשלום',
          description: 'עמוד התשלום ייפתח בקרוב...',
          variant: 'default',
        });
        redirectToPayment(quoteId, quotePrice);
        return;
      }
      toast({
        title: 'הצעה התקבלה',
        description: 'הודעה נשלחה לבעל המקצוע. הוא יצור איתך קשר בהקדם.',
        variant: 'default',
      });
      if (selectedRequestId) {
        setTimeout(() => {
          refreshQuotes(selectedRequestId);
        }, 500);
      }
      // טוסט עם קישור לדירוג
      const rateNowActionButton = (
        <Button
          onClick={() => {
            setTimeout(() => {
              window.location.hash = '#rating-section';
            }, 250);
          }}
          className="bg-amber-500 hover:bg-amber-600 text-white px-3 py-1 rounded ml-2 font-semibold"
          style={{ fontSize: 14 }}
        >
          דרג עכשיו
        </Button>
      );
      toast({
        title: 'הצעה התקבלה',
        description: 'הצעת המחיר אושרה! נשמח אם תדרג את בעל המקצוע.',
        action: rateNowActionButton,
        variant: 'success',
      });
    } catch (error) {
      toast({
        title: 'שגיאה בתהליך קבלת ההצעה',
        description: 'אירעה שגיאה בתהליך. אנא נסה שוב מאוחר יותר.',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return { processQuoteAcceptance };
};
