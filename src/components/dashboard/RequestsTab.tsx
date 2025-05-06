import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/providers/AuthProvider';
import RequestsList from './RequestsList';
import RequestDetail from './RequestDetail';
import RequestDialog from './RequestDialog';
import EmptyRequestState from './EmptyRequestState';
import { useRequests } from '@/hooks/useRequests';
import { useQuotes } from '@/hooks/useQuotes';
import PaymentMethodDialog from './quotes/PaymentMethodDialog';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

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
    closePaymentDialog
  } = useQuotes(selectedRequestId);
  
  const selectedRequest = requests.find(r => r.id === selectedRequestId);
  const selectedQuote = selectedQuoteId ? quotes.find(q => q.id === selectedQuoteId) : null;

  // After a component refresh, automatically refresh quotes to ensure we have the latest status
  useEffect(() => {
    if (selectedRequestId) {
      refreshQuotes(selectedRequestId);
    }
  }, [selectedRequestId, refreshQuotes]);

  useEffect(() => {
    if (selectedRequestId && selectedRequestRef.current) {
      setTimeout(() => {
        selectedRequestRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }, [selectedRequestId]);

  const handleViewProfile = (professionalId: string) => {
    window.open(`/professional/${professionalId}`, '_blank');
  };
  
  const handleSelectPaymentMethod = (method: 'cash' | 'credit') => {
    if (selectedQuoteId) {
      processQuoteAcceptance(selectedQuoteId, method);
      closePaymentDialog();
    }
  };
  
  const handleRefresh = useCallback(() => {
    refreshRequests();
    if (selectedRequestId) {
      refreshQuotes(selectedRequestId);
    }
  }, [refreshRequests, refreshQuotes, selectedRequestId]);

  return (
    <div className="flex flex-col-reverse lg:flex-row gap-8" dir="rtl">
      <div className="w-full lg:w-1/3">
        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-blue-700">הבקשות שלי</h2>
          
          <Button 
            className="bg-[#00D09E] hover:bg-[#00C090] text-white flex items-center gap-1"
            onClick={() => setIsRequestDialogOpen(true)}
          >
            <PlusCircle size={16} />
            בקשה חדשה
          </Button>
          
          <RequestDialog 
            isOpen={isRequestDialogOpen} 
            onOpenChange={setIsRequestDialogOpen} 
            onRequestCreated={handleRefresh}
          />
        </div>
        
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#00d09e]"></div>
          </div>
        ) : (
          <RequestsList 
            requests={requests} 
            onSelect={setSelectedRequestId}
            selectedRequestId={selectedRequestId}
          />
        )}
      </div>
      
      <div className="w-full lg:w-2/3" ref={selectedRequestRef}>
        {selectedRequest ? (
          <RequestDetail 
            request={selectedRequest}
            quotes={quotes}
            onAcceptQuote={handleAcceptQuote}
            onRejectQuote={handleRejectQuote}
            onViewProfile={handleViewProfile}
            onRefresh={() => refreshQuotes(selectedRequest.id)}
          />
        ) : (
          <EmptyRequestState 
            isLoading={isLoading}
            hasRequests={requests.length > 0}
            isRequestDialogOpen={isRequestDialogOpen}
            setIsRequestDialogOpen={setIsRequestDialogOpen}
          />
        )}
      </div>
      
      {/* Payment Method Dialog */}
      {selectedQuote && (
        <PaymentMethodDialog
          open={showPaymentDialog}
          onOpenChange={closePaymentDialog}
          onSelectPaymentMethod={handleSelectPaymentMethod}
          quotePrice={selectedQuote.price}
        />
      )}
    </div>
  );
};

export default RequestsTab;
