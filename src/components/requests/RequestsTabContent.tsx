
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
  // הצג רק בקשות שאינן ממתינות לדירוג (בקרת כפולה - המחלקה המרכזית מסננת גם)
  const filtered = requests.filter(r => r.status !== "waiting_for_rating");

  if (filtered.length === 0) {
    return <EmptyStateCard onCreateRequest={onCreateRequest} text={emptyText} />;
  }

  return (
    <div className="space-y-4">
      {filtered.map((request) => (
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
