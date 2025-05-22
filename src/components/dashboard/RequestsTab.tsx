import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/providers/AuthProvider';
import { useRequests } from '@/hooks/useRequests';
import { useQuotes } from '@/hooks/useQuotes';
import PaymentMethodDialog from './quotes/PaymentMethodDialog';
// Import the new sidebar and detail components
import RequestsSidebar from './RequestsSidebar';
import SelectedRequestContent from './SelectedRequestContent';

const RequestsTab: React.FC = () => {
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);
  const [isRequestDialogOpen, setIsRequestDialogOpen] = useState(false);
  const selectedRequestRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  const navigate = useNavigate();
  const {
    requests,
    isLoading,
    refreshRequests
  } = useRequests();
  const {
    quotes,
    handleAcceptQuote,
    handleRejectQuote,
    refreshQuotes,
    showPaymentDialog,
    selectedQuoteId,
    processQuoteAcceptance,
    closePaymentDialog,
    isProcessing
  } = useQuotes(selectedRequestId);
  const selectedRequest = requests.find(r => r.id === selectedRequestId);
  const selectedQuote = selectedQuoteId ? quotes.find(q => q.id === selectedQuoteId) : null;

  // Define filtered requests: exclude waiting_for_rating requests
  const filteredRequests = requests.filter(
    r => r.status !== 'waiting_for_rating'
  );

  // Initial data load when component mounts
  useEffect(() => {
    const initialLoad = async () => {
      await refreshRequests();
      if (selectedRequestId) {
        await refreshQuotes(selectedRequestId);
      }
    };
    initialLoad();
  }, []);

  // After a component refresh or when selected request changes, automatically refresh quotes
  useEffect(() => {
    if (selectedRequestId) {
      console.log("Auto-refreshing quotes for newly selected request:", selectedRequestId);
      refreshQuotes(selectedRequestId).catch(err => {
        console.error("Error refreshing quotes:", err);
      });
    }
  }, [selectedRequestId, refreshQuotes]);

  // Scroll to the selected request when it changes
  useEffect(() => {
    if (selectedRequestId && selectedRequestRef.current) {
      setTimeout(() => {
        selectedRequestRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }, 100);
    }
  }, [selectedRequestId]);

  // Handle view professional profile
  const handleViewProfile = (professionalId: string) => {
    window.open(`/professional/${professionalId}`, '_blank');
  };

  // Handle payment method selection
  const handleSelectPaymentMethod = (method: 'cash' | 'credit') => {
    if (selectedQuoteId) {
      processQuoteAcceptance(selectedQuoteId, method);

      // Only close the dialog after processing if it's cash payment
      if (method === 'cash') {
        setTimeout(() => {
          closePaymentDialog();
        }, 1000);
      }
      // Refresh quotes after accepting to ensure UI is up to date
      if (selectedRequestId) {
        setTimeout(() => {
          console.log("Refreshing quotes after payment method selection");
          refreshQuotes(selectedRequestId).catch(err => {
            console.error("Error refreshing quotes after payment:", err);
          });
        }, 1500);
      }
    }
  };

  // Handle refresh button click and other places: always async!
  const handleRefresh = useCallback(async () => {
    try {
      await refreshRequests();
      if (selectedRequestId) {
        await refreshQuotes(selectedRequestId);
      }
    } catch (error) {
      console.error("Error during refresh:", error);
    }
  }, [refreshRequests, refreshQuotes, selectedRequestId]);

  // Select request handler
  const handleSelectRequest = useCallback(async (id: string) => {
    setSelectedRequestId(id);
    if (id) {
      try {
        await refreshQuotes(id);
      } catch (err) {
        console.error("Error refreshing quotes on selection:", err);
      }
    }
  }, [refreshQuotes]);

  return (
    <div className="flex flex-col-reverse lg:flex-row gap-8" dir="rtl">
      <RequestsSidebar
        isLoading={isLoading}
        requests={requests}
        filteredRequests={filteredRequests}
        isRequestDialogOpen={isRequestDialogOpen}
        setIsRequestDialogOpen={setIsRequestDialogOpen}
        onCreateRequest={() => setIsRequestDialogOpen(true)}
        onSelectRequest={handleSelectRequest}
        selectedRequestId={selectedRequestId}
        handleRefresh={handleRefresh}
      />
      <SelectedRequestContent
        selectedRequest={selectedRequest}
        quotes={quotes}
        isLoading={isLoading}
        filteredRequests={filteredRequests}
        selectedRequestRef={selectedRequestRef}
        isRequestDialogOpen={isRequestDialogOpen}
        setIsRequestDialogOpen={setIsRequestDialogOpen}
        onAcceptQuote={handleAcceptQuote}
        onRejectQuote={handleRejectQuote}
        onViewProfile={handleViewProfile}
        // Always return a Promise
        onRefresh={async () => {
          if (selectedRequestId) {
            console.log("Manual refresh of quotes triggered");
            try {
              await refreshQuotes(selectedRequestId);
              await refreshRequests();
            } catch (err) {
              console.error("Error during manual refresh:", err);
            }
            return;
          } else {
            // Always explicit Promise
            return Promise.resolve();
          }
        }}
        selectedRequestId={selectedRequestId}
        refreshQuotes={refreshQuotes}
        refreshRequests={refreshRequests}
      />
      {/* Payment Method Dialog */}
      {selectedQuote && <PaymentMethodDialog open={showPaymentDialog} onOpenChange={closePaymentDialog} onSelectPaymentMethod={handleSelectPaymentMethod} quotePrice={selectedQuote.price} isProcessing={isProcessing} />}
    </div>
  );
};

export default RequestsTab;
