
import { useState } from 'react';

export const useQuoteDialogState = () => {
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [selectedQuoteId, setSelectedQuoteId] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const openPaymentDialog = (quoteId: string) => {
    setSelectedQuoteId(quoteId);
    setShowPaymentDialog(true);
  };

  const closePaymentDialog = () => {
    setShowPaymentDialog(false);
    setSelectedQuoteId(null);
  };

  return {
    showPaymentDialog,
    selectedQuoteId,
    isProcessing,
    setIsProcessing,
    openPaymentDialog,
    closePaymentDialog,
    setSelectedQuoteId
  };
};
