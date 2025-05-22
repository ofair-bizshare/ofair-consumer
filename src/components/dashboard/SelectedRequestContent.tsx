
import React, { RefObject } from 'react';
import RequestDetail from './RequestDetail';
import EmptyRequestState from './EmptyRequestState';

interface SelectedRequestContentProps {
  selectedRequest: any | undefined;
  quotes: any[];
  isLoading: boolean;
  filteredRequests: any[];
  selectedRequestRef: RefObject<HTMLDivElement>;
  isRequestDialogOpen: boolean;
  setIsRequestDialogOpen: (open: boolean) => void;
  onAcceptQuote: (quoteId: string) => void;
  onRejectQuote: (quoteId: string) => void;
  onViewProfile: (professionalId: string) => void;
  onRefresh: () => Promise<void>;
  selectedRequestId: string | null;
  refreshQuotes: (id: string) => Promise<void>;
  refreshRequests: () => Promise<void>;
}

const SelectedRequestContent: React.FC<SelectedRequestContentProps> = ({
  selectedRequest,
  quotes,
  isLoading,
  filteredRequests,
  selectedRequestRef,
  isRequestDialogOpen,
  setIsRequestDialogOpen,
  onAcceptQuote,
  onRejectQuote,
  onViewProfile,
  onRefresh,
  selectedRequestId,
  refreshQuotes,
  refreshRequests,
}) => {
  // Only show request detail if it's not waiting for rating
  if (selectedRequest && selectedRequest.status !== "waiting_for_rating") {
    return (
      <div className="w-full lg:w-2/3" ref={selectedRequestRef}>
        <RequestDetail
          request={selectedRequest}
          quotes={quotes}
          onAcceptQuote={onAcceptQuote}
          onRejectQuote={onRejectQuote}
          onViewProfile={onViewProfile}
          onRefresh={onRefresh}
        />
      </div>
    );
  }
  return (
    <div className="w-full lg:w-2/3" ref={selectedRequestRef}>
      <EmptyRequestState
        isLoading={isLoading}
        hasRequests={filteredRequests.length > 0}
        isRequestDialogOpen={isRequestDialogOpen}
        setIsRequestDialogOpen={setIsRequestDialogOpen}
      />
    </div>
  );
};

export default SelectedRequestContent;
