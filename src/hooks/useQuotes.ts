
import { useQuotesState } from './useQuotesState';
import { useQuoteActions } from './useQuoteActions';

// Combines both state and actions—API is the same as before!
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
