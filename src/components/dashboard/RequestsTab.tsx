import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/providers/AuthProvider';
import RequestsList from './RequestsList';
import RequestDetail from './RequestDetail';
import RequestDialog from './RequestDialog';
import EmptyRequestState from './EmptyRequestState';
import { useRequests } from '@/hooks/useRequests';
import { useQuotes } from '@/hooks/useQuotes'; // Import path remains the same
import PaymentMethodDialog from './quotes/PaymentMethodDialog';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
const RequestsTab: React.FC = () => {
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);
  const [isRequestDialogOpen, setIsRequestDialogOpen] = useState(false);
  const selectedRequestRef = useRef<HTMLDivElement>(null);
  const {
    user
  } = useAuth();
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
      // For credit card payment, the redirect will happen
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
        }, 1500); // Slightly longer delay to allow database to update
      }
    }
  };

  // Handle refresh button click
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
  return <div className="flex flex-col-reverse lg:flex-row gap-8" dir="rtl">
      <div className="w-full lg:w-1/3">
        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-blue-700">הבקשות שלי</h2>
          
          <Button onClick={() => setIsRequestDialogOpen(true)} className="bg-[#00D09E] hover:bg-[#00C090] text-white flex items-center gap-1 rounded">
            <PlusCircle size={16} />
            בקשה חדשה
          </Button>
          
          <RequestDialog isOpen={isRequestDialogOpen} onOpenChange={setIsRequestDialogOpen} onRequestCreated={handleRefresh} />
        </div>
        
        {isLoading ? <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#00d09e]"></div>
          </div> : <RequestsList requests={requests} onSelect={async id => {
        setSelectedRequestId(id);
        // Auto refresh quotes when selecting a new request
        if (id) {
          try {
            await refreshQuotes(id);
          } catch (err) {
            console.error("Error refreshing quotes on selection:", err);
          }
        }
      }} selectedRequestId={selectedRequestId} />}
      </div>
      
      <div className="w-full lg:w-2/3" ref={selectedRequestRef}>
        {selectedRequest ? <RequestDetail request={selectedRequest} quotes={quotes} onAcceptQuote={handleAcceptQuote} onRejectQuote={handleRejectQuote} onViewProfile={handleViewProfile} onRefresh={async () => {
        if (selectedRequestId) {
          console.log("Manual refresh of quotes triggered");
          try {
            await refreshQuotes(selectedRequestId);
            // Also refresh the requests to get updated status
            await refreshRequests();
          } catch (err) {
            console.error("Error during manual refresh:", err);
          }
        }
      }} /> : <EmptyRequestState isLoading={isLoading} hasRequests={requests.length > 0} isRequestDialogOpen={isRequestDialogOpen} setIsRequestDialogOpen={setIsRequestDialogOpen} />}
      </div>
      
      {/* Payment Method Dialog */}
      {selectedQuote && <PaymentMethodDialog open={showPaymentDialog} onOpenChange={closePaymentDialog} onSelectPaymentMethod={handleSelectPaymentMethod} quotePrice={selectedQuote.price} isProcessing={isProcessing} />}
    </div>;
};
export default RequestsTab;