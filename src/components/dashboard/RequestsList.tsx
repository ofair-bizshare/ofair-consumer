
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, CheckCircle, AlertCircle, ArrowRight } from 'lucide-react';
import { RequestInterface } from '@/types/dashboard';

interface RequestsListProps {
  requests: RequestInterface[];
  onSelect: (id: string) => void;
}

const RequestsList: React.FC<RequestsListProps> = ({ requests, onSelect }) => {
  return (
    <div className="space-y-4">
      {requests.map(request => (
        <RequestCard 
          key={request.id} 
          request={request} 
          onSelect={onSelect}
        />
      ))}
    </div>
  );
};

interface RequestCardProps {
  request: RequestInterface;
  onSelect: (id: string) => void;
}

const RequestCard: React.FC<RequestCardProps> = ({ request, onSelect }) => {
  const getStatusIcon = () => {
    switch (request.status) {
      case 'active':
        return <Clock className="h-5 w-5 text-blue-500" />;
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-[#00D09E]" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusText = () => {
    switch (request.status) {
      case 'active':
        return 'פעיל';
      case 'completed':
        return 'הושלם';
      default:
        return 'ממתין';
    }
  };

  return (
    <Card id={`request-${request.id}`} className="overflow-hidden hover:shadow-md transition-shadow">
      <CardContent className="p-0">
        <div className="p-5">
          <div className="flex justify-between items-start mb-3">
            <div>
              <h3 className="text-lg font-semibold">{request.title}</h3>
              <p className="text-gray-500 text-sm">{request.date}</p>
            </div>
            <div className="flex items-center text-sm">
              {getStatusIcon()}
              <span className="mr-1">{getStatusText()}</span>
            </div>
          </div>
          
          <p className="text-gray-700 mb-3 line-clamp-2">
            {request.description}
          </p>
          
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-500">
              {request.location}
            </div>
            
            <div className="flex items-center text-sm">
              {request.quotesCount > 0 ? (
                <>
                  <span className="text-blue-700 font-medium">{request.quotesCount}</span>
                  <span className="text-gray-500 mr-1">הצעות מחיר</span>
                </>
              ) : (
                <span className="text-gray-500">אין הצעות עדיין</span>
              )}
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-100 p-3 bg-gray-50 flex justify-end">
          <Button 
            onClick={() => onSelect(request.id)}
            variant="ghost" 
            className="text-blue-700 hover:text-blue-800 hover:bg-blue-50 text-sm"
          >
            הצג פרטים
            <ArrowRight size={16} className="mr-1" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default RequestsList;
