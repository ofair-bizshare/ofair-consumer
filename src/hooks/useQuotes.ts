
import { useQuotesState } from './useQuotesState';
import { useQuoteActions } from './useQuoteActions';

// אין יותר filter שמשנה את סדר quotes – מחזירים את מערך quotes נקי (כלומר, לא filter/map מעבר ל-requestId)
export const useQuotes = (selectedRequestId: string | null) => {
  const {
    quotes,
    setQuotes,
    lastAcceptedQuoteId,
    setLastAcceptedQuoteId,
    refreshQuotes
  } = useQuotesState(selectedRequestId);

  const {
    handleAcceptQuote, 
    handleRejectQuote,
    processQuoteAcceptance,
    showPaymentDialog,
    closePaymentDialog,
    selectedQuoteId,
    isProcessing
  } = useQuoteActions({
    quotes,
    setQuotes,
    lastAcceptedQuoteId,
    setLastAcceptedQuoteId,
    refreshQuotes,
    selectedRequestId
  });

  // שומרים על אותו סדר ולא מסדרים מחדש אחרי accept! רק מציגים את הצעות רלוונטיות לבקשה
  return {
    quotes: selectedRequestId ? quotes.filter(q => q.requestId === selectedRequestId) : [],
    handleAcceptQuote,
    handleRejectQuote,
    showPaymentDialog,
    selectedQuoteId,
    processQuoteAcceptance,
    closePaymentDialog,
    refreshQuotes,
    isProcessing
  };
};
