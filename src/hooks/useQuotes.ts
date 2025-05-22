
import { useQuotesState } from './useQuotesState';
import { useQuoteActions } from './useQuoteActions';

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

  // Debug logs for flow
  if (typeof window !== "undefined") {
    console.log('[useQuotes][debug] selectedRequestId:', selectedRequestId);
    console.log('[useQuotes][debug] quotes before filtering:', quotes);
    if (selectedRequestId) {
      const byRequest = quotes.filter(q => q.requestId === selectedRequestId);
      console.log('[useQuotes][debug] quotes after filtering:', byRequest);
    }
  }

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
