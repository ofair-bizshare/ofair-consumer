
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/providers/AuthProvider';
import {
  updateQuoteStatus,
  updateRequestStatus,
  checkIfAcceptedQuoteExists,
  saveAcceptedQuote,
  deleteAcceptedQuote,
  saveReferral,
  formatPrice,
  redirectToPayment,
  createQuoteNotification,
  createRatingReminderNotification,
} from '@/services/quotes';
import { QuoteInterface } from '@/types/dashboard';

export interface UseQuoteActionsParams {
  quotes: QuoteInterface[];
  setQuotes: React.Dispatch<React.SetStateAction<QuoteInterface[]>>;
  lastAcceptedQuoteId: string | null;
  setLastAcceptedQuoteId: React.Dispatch<React.SetStateAction<string | null>>;
  refreshQuotes: (requestId: string) => Promise<void>;
  selectedRequestId: string | null;
}

export const useQuoteActions = ({
  quotes,
  setQuotes,
  lastAcceptedQuoteId,
  setLastAcceptedQuoteId,
  refreshQuotes,
  selectedRequestId
}: UseQuoteActionsParams) => {
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [selectedQuoteId, setSelectedQuoteId] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  // Accept logic
  const handleAcceptQuote = async (quoteId: string) => {
    const quote = quotes.find(q => q.id === quoteId);
    if (!quote) {
      toast({ title: "שגיאה", description: "הצעת המחיר לא נמצאה במערכת", variant: "destructive" });
      return;
    }
    if (quote.status === 'accepted') {
      toast({ title: "הצעה זו כבר אושרה", description: "הצעת המחיר הזו כבר אושרה בעבר.", variant: "default" });
      return;
    }
    const requestId = quote.requestId;
    const existingAcceptedQuote = await checkIfAcceptedQuoteExists(requestId, quoteId);
    if (existingAcceptedQuote) {
      setQuotes(prevQuotes => prevQuotes.map(q => q.id === quoteId ? { ...q, status: 'accepted' } : q));
      setLastAcceptedQuoteId(quoteId);
      toast({ title: "הצעה זו כבר אושרה", description: "הצעת המחיר הזו כבר אושרה במערכת.", variant: "default" });
      return;
    }
    setSelectedQuoteId(quoteId);
    setShowPaymentDialog(true);
  };

  // Payment and acceptance
  const processQuoteAcceptance = async (quoteId: string, paymentMethod: 'cash' | 'credit') => {
    if (isProcessing) return;
    setIsProcessing(true);
    const acceptedQuote = quotes.find(q => q.id === quoteId);
    if (!acceptedQuote || !user) {
      setIsProcessing(false);
      return;
    }
    const quotePrice = formatPrice(acceptedQuote.price);
    try {
      const isAlreadyAccepted = await checkIfAcceptedQuoteExists(acceptedQuote.requestId, quoteId);
      if (isAlreadyAccepted) {
        setQuotes(prevQuotes => prevQuotes.map(quote => quote.id === quoteId ? { ...quote, status: 'accepted' } : quote));
        setLastAcceptedQuoteId(quoteId);
        await createQuoteNotification(
          acceptedQuote.description,
          acceptedQuote.professional?.name || "בעל מקצוע",
          acceptedQuote.requestId
        );
        toast({ title: "הצעה התקבלה", description: "הצעת המחיר כבר אושרה במערכת", variant: "default" });
        setIsProcessing(false);
        return;
      }

      // Database actions
      const success = await updateQuoteStatus(quoteId, 'accepted');
      if (!success) {
        toast({ title: "שגיאה בקבלת ההצעה", description: "אירעה שגיאה בקבלת ההצעה. אנא נסה שוב.", variant: "destructive" });
        setIsProcessing(false);
        return;
      }
      setLastAcceptedQuoteId(quoteId);
      await updateRequestStatus(acceptedQuote.requestId, 'waiting_for_rating');
      await createQuoteNotification(
        acceptedQuote.description,
        acceptedQuote.professional?.name || "בעל מקצוע",
        acceptedQuote.requestId
      );
      setTimeout(async () => {
        await createRatingReminderNotification(
          acceptedQuote.professional?.name || "בעל מקצוע",
          acceptedQuote.professional?.id || ""
        );
      }, 500);
      setQuotes(prevQuotes =>
        prevQuotes.map(quote =>
          quote.id === quoteId
            ? { ...quote, status: 'accepted' }
            : quote.requestId === acceptedQuote.requestId && quote.status === 'pending'
            ? { ...quote, status: 'rejected' }
            : quote
        )
      );
      // Save in DB
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
        created_at: new Date().toISOString()
      });
      await saveReferral(
        user.id,
        acceptedQuote.professional.id,
        acceptedQuote.professional.name,
        acceptedQuote.professional.phoneNumber || acceptedQuote.professional.phone || "050-1234567",
        acceptedQuote.professional.profession
      );
      // Credit card? go to pay
      if (paymentMethod === 'credit') {
        toast({ title: "הועברת לעמוד תשלום", description: "עמוד התשלום ייפתח בקרוב...", variant: "default" });
        redirectToPayment(quoteId, quotePrice);
        return;
      }
      toast({ title: "הצעה התקבלה", description: "הודעה נשלחה לבעל המקצוע. הוא יצור איתך קשר בהקדם.", variant: "default" });
      if (selectedRequestId) {
        setTimeout(() => { refreshQuotes(selectedRequestId); }, 500);
      }
    } catch (error) {
      toast({
        title: "שגיאה בתהליך קבלת ההצעה",
        description: "אירעה שגיאה בתהליך. אנא נסה שוב מאוחר יותר.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Reject logic (simplified)
  const handleRejectQuote = async (quoteId: string) => {
    if (isProcessing) return;
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
        const quotesToUpdate = quotes.filter(q => 
          q.requestId === rejectedQuote.requestId && q.id !== quoteId && q.status !== 'accepted'
        );
        if (quotesToUpdate.length > 0) {
          await Promise.all(
            quotesToUpdate.map(quote => updateQuoteStatus(quote.id, 'pending'))
          );
        }
        setQuotes(prevQuotes => 
          prevQuotes.map(quote => 
            quote.requestId === rejectedQuote.requestId 
              ? { ...quote, status: quote.id === quoteId ? 'rejected' : 'pending' } 
              : quote
          )
        );
        await updateRequestStatus(rejectedQuote.requestId, 'active');
        toast({ title: "קבלת הצעה בוטלה", description: "אפשר לבחור הצעה אחרת כעת.", variant: "default" });
      } else {
        await updateQuoteStatus(quoteId, 'rejected');
        setQuotes(prevQuotes => 
          prevQuotes.map(quote => 
            quote.id === quoteId 
              ? { ...quote, status: 'rejected' } 
              : quote
          )
        );
        toast({ title: "הצעה נדחתה", description: "הודעה נשלחה לבעל המקצוע.", variant: "default" });
      }
    } catch (error) {
      toast({
        title: "שגיאה בתהליך דחיית ההצעה",
        description: "אירעה שגיאה בתהליך. אנא נסה שוב מאוחר יותר.",
        variant: "destructive",
      });
    } finally {
      if (rejectedQuote.requestId) await refreshQuotes(rejectedQuote.requestId);
      setIsProcessing(false);
    }
  };

  // Close payment dialog
  const closePaymentDialog = () => {
    setShowPaymentDialog(false);
    setSelectedQuoteId(null);
  };

  return {
    handleAcceptQuote,
    handleRejectQuote,
    processQuoteAcceptance,
    showPaymentDialog,
    closePaymentDialog,
    selectedQuoteId,
    isProcessing
  };
};
