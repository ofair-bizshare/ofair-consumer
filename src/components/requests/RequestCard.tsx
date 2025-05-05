
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, CheckCircle, AlertCircle, X, ExternalLink, Star } from 'lucide-react';
import { RequestInterface } from '@/types/dashboard';
import { Badge } from '@/components/ui/badge';

interface RequestCardProps {
  request: RequestInterface;
  onView: (id: string) => void;
  onCancel?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export const getStatusBadge = (status: string) => {
  switch (status) {
    case 'active':
      return <Badge className="bg-green-500">פעילה</Badge>;
    case 'completed':
      return <Badge className="bg-blue-500">הושלמה</Badge>;
    case 'expired':
      return <Badge className="bg-amber-500">פגה תוקף</Badge>;
    case 'canceled':
      return <Badge className="bg-red-500">בוטלה</Badge>;
    case 'waiting_for_rating':
      return <Badge className="bg-amber-400">ממתין לדירוג</Badge>;
    default:
      return <Badge>לא ידוע</Badge>;
  }
};

export const getStatusIcon = (status: string) => {
  switch (status) {
    case 'active':
      return <Clock className="h-5 w-5 text-green-500" />;
    case 'completed':
      return <CheckCircle className="h-5 w-5 text-blue-500" />;
    case 'expired':
      return <AlertCircle className="h-5 w-5 text-amber-500" />;
    case 'canceled':
      return <X className="h-5 w-5 text-red-500" />;
    case 'waiting_for_rating':
      return <Star className="h-5 w-5 text-amber-400" />;
    default:
      return null;
  }
};

const RequestCard: React.FC<RequestCardProps> = ({ 
  request, 
  onView, 
  onCancel, 
  onDelete 
}) => {
  return (
    <Card key={request.id} className="overflow-hidden shadow-md hover:shadow-lg transition-shadow">
      <div className={`border-r-4 ${
        request.status === 'active' ? 'border-green-500' : 
        request.status === 'completed' ? 'border-blue-500' : 
        request.status === 'expired' ? 'border-amber-500' : 
        request.status === 'waiting_for_rating' ? 'border-amber-400' :
        'border-red-500'
      } h-full`}>
        <CardContent className="p-0">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 p-6">
            <div className="md:col-span-3">
              <div className="flex items-center mb-3">
                {getStatusIcon(request.status)}
                <h3 className="text-xl font-medium mr-2">{request.title}</h3>
                {getStatusBadge(request.status)}
              </div>
              <p className="text-gray-600 mb-2 line-clamp-2">{request.description}</p>
              <div className="flex flex-wrap text-sm text-gray-500 gap-x-4 gap-y-1 mt-2">
                <span>תאריך: {request.date}</span>
                <span>מיקום: {request.location}</span>
                <span>הצעות מחיר: {request.quotesCount}</span>
              </div>
            </div>
            <div className="md:col-span-2 flex flex-wrap items-center justify-start md:justify-end gap-2">
              <Button 
                variant="outline" 
                className="text-blue-600 border-blue-300 hover:bg-blue-50"
                onClick={() => onView(request.id)}
              >
                <ExternalLink className="h-4 w-4 ml-1" />
                פרטים מלאים
              </Button>
              
              {request.status === 'active' && onCancel && (
                <Button 
                  variant="outline" 
                  className="text-red-600 border-red-300 hover:bg-red-50"
                  onClick={() => onCancel(request.id)}
                >
                  <X className="h-4 w-4 ml-1" />
                  ביטול
                </Button>
              )}
              
              {(request.status === 'completed' || request.status === 'expired' || request.status === 'canceled' || request.status === 'waiting_for_rating') && onDelete && (
                <Button 
                  variant="outline" 
                  className="text-red-600 border-red-300 hover:bg-red-50"
                  onClick={() => onDelete(request.id)}
                >
                  <X className="h-4 w-4 ml-1" />
                  מחיקה
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </div>
    </Card>
  );
};

export default RequestCard;
