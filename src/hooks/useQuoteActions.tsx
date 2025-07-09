
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
import { Button } from '@/components/ui/button';
import { useQuoteAccept } from './useQuoteAccept';
import { useQuoteReject } from './useQuoteReject';
import { useQuoteDialogState } from './useQuoteDialogState';

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

  const {
    showPaymentDialog,
    selectedQuoteId,
    isProcessing,
    setIsProcessing,
    openPaymentDialog,
    closePaymentDialog,
  } = useQuoteDialogState();

  // ניווט/הצגה של פופ אפ דירוג (אם relevant)
  const handleShowRating = (quoteId: string) => {
    setTimeout(() => {
      window.location.hash = '#rating-section';
    }, 250);
  };

  const { processQuoteAcceptance, PopupComponent } = useQuoteAccept({
    quotes,
    setQuotes,
    setLastAcceptedQuoteId,
    refreshQuotes,
    selectedRequestId,
    setIsProcessing,
    onShowRating: handleShowRating
  });

  // FIX: Wire up handleRejectQuote using useQuoteReject
  const { handleRejectQuote } = useQuoteReject({
    quotes,
    setQuotes,
    lastAcceptedQuoteId,
    setLastAcceptedQuoteId,
    refreshQuotes,
    setIsProcessing,
  });

  // Accept logic - open payment dialog flow
  const handleAcceptQuote = async (quoteId: string) => {
    const quote = quotes.find(q => q.id === quoteId);
    if (!quote) return;
    if (quote.status === 'accepted') return;
    const existingAcceptedQuote = await checkIfAcceptedQuoteExists(quote.requestId, quoteId);
    if (existingAcceptedQuote) {
      setQuotes(prevQuotes => prevQuotes.map(q => q.id === quoteId ? { ...q, status: 'accepted' } : q));
      setLastAcceptedQuoteId(quoteId);
      return;
    }
    openPaymentDialog(quoteId);
  };

  return {
    handleAcceptQuote,
    handleRejectQuote,
    processQuoteAcceptance,
    showPaymentDialog,
    closePaymentDialog,
    selectedQuoteId,
    isProcessing,
    PopupComponent
  };
};
