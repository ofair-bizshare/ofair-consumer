
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/providers/AuthProvider';
import RequestsList from './RequestsList';
import RequestDetail from './RequestDetail';
import RequestDialog from './RequestDialog';
import EmptyRequestState from './EmptyRequestState';
import { useRequests } from '@/hooks/useRequests';
import { useQuotes } from '@/hooks/useQuotes';

const RequestsTab: React.FC = () => {
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);
  const [isRequestDialogOpen, setIsRequestDialogOpen] = useState(false);
  const selectedRequestRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const { requests, isLoading } = useRequests();
  const { quotes, handleAcceptQuote, handleRejectQuote } = useQuotes(selectedRequestId);
  
  const selectedRequest = requests.find(r => r.id === selectedRequestId);

  // Scroll to selected request when it changes
  useEffect(() => {
    if (selectedRequestId && selectedRequestRef.current) {
      setTimeout(() => {
        selectedRequestRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }, [selectedRequestId]);

  const handleViewProfile = (professionalId: string) => {
    // Consistently use window.open to open in a new tab
    window.open(`/professional/${professionalId}`, '_blank');
  };

  return (
    <div className="flex flex-col-reverse lg:flex-row gap-8" dir="rtl">
      <div className="w-full lg:w-1/3">
        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-blue-700">הבקשות שלי</h2>
          
          <RequestDialog 
            isOpen={isRequestDialogOpen} 
            onOpenChange={setIsRequestDialogOpen} 
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
    </div>
  );
};

export default RequestsTab;
