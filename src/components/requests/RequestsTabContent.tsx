
import React from 'react';
import { RequestInterface } from '@/types/dashboard';
import RequestCard from './RequestCard';
import EmptyStateCard from './EmptyStateCard';

interface RequestsTabContentProps {
  requests: RequestInterface[];
  onViewRequest: (id: string) => void;
  onCancelRequest?: (id: string) => void;
  onDeleteRequest?: (id: string) => void;
  onCreateRequest: () => void;
  emptyText?: string;
}

const RequestsTabContent: React.FC<RequestsTabContentProps> = ({ 
  requests, 
  onViewRequest, 
  onCancelRequest, 
  onDeleteRequest,
  onCreateRequest,
  emptyText
}) => {
  if (requests.length === 0) {
    return <EmptyStateCard onCreateRequest={onCreateRequest} text={emptyText} />;
  }

  return (
    <div className="space-y-4">
      {requests.map((request) => (
        <RequestCard 
          key={request.id}
          request={request}
          onView={onViewRequest}
          onCancel={onCancelRequest}
          onDelete={onDeleteRequest}
        />
      ))}
    </div>
  );
};

export default RequestsTabContent;
