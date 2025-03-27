
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { MessageSquare } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import RequestsList from './RequestsList';
import RequestDetail from './RequestDetail';
import { QuoteInterface, RequestInterface } from '@/types/dashboard';
import RequestDialog from './RequestDialog';

// Mock data - this would normally come from an API
import { requests, quotes as quotesData } from '@/data/dashboardData';

const RequestsTab: React.FC = () => {
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);
  const [quotesState, setQuotesState] = useState(quotesData);
  const [isRequestDialogOpen, setIsRequestDialogOpen] = useState(false);
  const selectedRequestRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const selectedRequest = requests.find(r => r.id === selectedRequestId);
  const requestQuotes = quotesState.filter(q => q.requestId === selectedRequestId);

  React.useEffect(() => {
    if (selectedRequestId && selectedRequestRef.current) {
      setTimeout(() => {
        selectedRequestRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }, [selectedRequestId]);

  const handleAcceptQuote = (quoteId: string) => {
    setQuotesState(prevQuotes => 
      prevQuotes.map(quote => 
        quote.id === quoteId 
          ? { ...quote, status: 'accepted' } 
          : quote.requestId === prevQuotes.find(q => q.id === quoteId)?.requestId
            ? { ...quote, status: quote.status === 'pending' ? 'rejected' : quote.status }
            : quote
      )
    );
    
    toast({
      title: "הצעה התקבלה",
      description: "הודעה נשלחה לבעל המקצוע. הוא יצור איתך קשר בהקדם.",
      variant: "default",
    });
  };

  const handleRejectQuote = (quoteId: string) => {
    setQuotesState(prevQuotes => 
      prevQuotes.map(quote => 
        quote.id === quoteId 
          ? { ...quote, status: 'rejected' } 
          : quote
      )
    );
    
    toast({
      title: "הצעה נדחתה",
      description: "הודעה נשלחה לבעל המקצוע.",
      variant: "default",
    });
  };

  const handleViewProfile = (professionalId: string) => {
    // Fix: consistently use window.open to open in a new tab
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
        
        <RequestsList 
          requests={requests} 
          onSelect={setSelectedRequestId}
        />
      </div>
      
      <div className="w-full lg:w-2/3" ref={selectedRequestRef}>
        {selectedRequest ? (
          <RequestDetail 
            request={selectedRequest}
            quotes={requestQuotes}
            onAcceptQuote={handleAcceptQuote}
            onRejectQuote={handleRejectQuote}
            onViewProfile={handleViewProfile}
          />
        ) : (
          <div className="glass-card flex flex-col items-center justify-center text-center p-10">
            <MessageSquare className="h-12 w-12 text-blue-200 mb-4" />
            <h3 className="text-xl font-semibold text-blue-700 mb-2">בחר בקשה לצפייה</h3>
            <p className="text-gray-600 mb-6 max-w-md">
              בחר אחת מהבקשות מהרשימה משמאל כדי לצפות בפרטים ובהצעות המחיר שהתקבלו
            </p>
            <RequestDialog 
              isOpen={isRequestDialogOpen} 
              onOpenChange={setIsRequestDialogOpen} 
              triggerClassName="bg-[#00D09E] hover:bg-[#00C090]"
              triggerLabel="שלח בקשה חדשה"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default RequestsTab;
