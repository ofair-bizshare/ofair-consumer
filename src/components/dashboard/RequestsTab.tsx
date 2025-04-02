import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { MessageSquare } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/providers/AuthProvider';
import RequestsList from './RequestsList';
import RequestDetail from './RequestDetail';
import { QuoteInterface, RequestInterface } from '@/types/dashboard';
import RequestDialog from './RequestDialog';
import { fetchUserRequests } from '@/services/requests';
import { fetchQuotesForRequest, updateQuoteStatus } from '@/services/quotes';

const RequestsTab: React.FC = () => {
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);
  const [requests, setRequests] = useState<RequestInterface[]>([]);
  const [quotes, setQuotes] = useState<QuoteInterface[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRequestDialogOpen, setIsRequestDialogOpen] = useState(false);
  const selectedRequestRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const selectedRequest = requests.find(r => r.id === selectedRequestId);
  const requestQuotes = quotes.filter(q => q.requestId === selectedRequestId);

  // Load real data from the database
  useEffect(() => {
    if (!user) return;

    const loadData = async () => {
      setIsLoading(true);
      try {
        console.log("Fetching requests for user:", user.id);
        
        // Fetch requests from the database
        const userRequests = await fetchUserRequests();
        setRequests(userRequests);
        
        // If we have a selected request, fetch the quotes for it
        if (selectedRequestId) {
          const requestQuotes = await fetchQuotesForRequest(selectedRequestId);
          setQuotes(prevQuotes => {
            // Keep quotes for other requests and add the new ones
            const otherQuotes = prevQuotes.filter(q => q.requestId !== selectedRequestId);
            return [...otherQuotes, ...requestQuotes];
          });
        }
        
      } catch (error) {
        console.error("Error loading requests:", error);
        toast({
          title: "שגיאה בטעינת הבקשות",
          description: "לא ניתן לטעון את הבקשות שלך כרגע. נסה שוב מאוחר יותר.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [user, selectedRequestId, toast]);

  React.useEffect(() => {
    if (selectedRequestId && selectedRequestRef.current) {
      setTimeout(() => {
        selectedRequestRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }, [selectedRequestId]);

  const handleAcceptQuote = async (quoteId: string) => {
    // Find the quote that's being accepted
    const acceptedQuote = quotes.find(q => q.id === quoteId);
    if (!acceptedQuote || !user) return;
    
    // Update the quote status in the database
    const success = await updateQuoteStatus(quoteId, 'accepted');
    
    if (!success) {
      toast({
        title: "שגיאה בקבלת ההצעה",
        description: "אירעה שגיאה בקבלת ההצעה. אנא נסה שוב.",
        variant: "destructive",
      });
      return;
    }
    
    // Update local state - mark this quote as accepted and others for this request as rejected
    setQuotes(prevQuotes => 
      prevQuotes.map(quote => {
        // The accepted quote
        if (quote.id === quoteId) {
          return { ...quote, status: 'accepted' };
        }
        // Other quotes for the same request should be rejected
        else if (quote.requestId === acceptedQuote.requestId && quote.status === 'pending') {
          // Update their status in the database
          updateQuoteStatus(quote.id, 'rejected').catch(error => {
            console.error("Error updating quote status:", error);
          });
          return { ...quote, status: 'rejected' };
        }
        // All other quotes remain unchanged
        return quote;
      })
    );
    
    // Save the accepted quote to the database
    try {
      const acceptedQuoteData = {
        user_id: user.id,
        quote_id: quoteId,
        request_id: acceptedQuote.requestId,
        professional_id: acceptedQuote.professional.id,
        professional_name: acceptedQuote.professional.name,
        price: acceptedQuote.price,
        date: new Date().toISOString(),
        status: 'accepted',
        description: acceptedQuote.description
      };
      
      const { error } = await supabase
        .from('accepted_quotes')
        .upsert(acceptedQuoteData, {
          onConflict: 'quote_id',
          ignoreDuplicates: false
        });
        
      if (error) throw error;
      
      // Also save phone reveal in referrals automatically
      const referral = {
        id: crypto.randomUUID(),
        user_id: user.id,
        professional_id: acceptedQuote.professional.id,
        professional_name: acceptedQuote.professional.name,
        phone_number: acceptedQuote.professional.phoneNumber || "050-1234567",
        date: new Date().toISOString(),
        status: "accepted_quote",
        profession: acceptedQuote.professional.profession,
        completed_work: false
      };
      
      const { error: referralError } = await supabase
        .from('referrals')
        .insert(referral);
      
      if (referralError) console.error("Error saving referral:", referralError);
      
    } catch (error) {
      console.error("Error saving accepted quote:", error);
    }
    
    toast({
      title: "הצעה התקבלה",
      description: "הודעה נשלחה לבעל המקצוע. הוא יצור איתך קשר בהקדם.",
      variant: "default",
    });
  };

  const handleRejectQuote = async (quoteId: string) => {
    const rejectedQuote = quotes.find(q => q.id === quoteId);
    if (!rejectedQuote) return;
    
    // Update quote status in the database
    const success = await updateQuoteStatus(quoteId, 'rejected');
    
    if (!success) {
      toast({
        title: "שגיאה בדחיית ההצעה",
        description: "אירעה שגיאה בדחיית ההצעה. אנא נסה שוב.",
        variant: "destructive",
      });
      return;
    }
    
    // If this is canceling an accepted quote
    if (rejectedQuote.status === 'accepted') {
      // Reset all quotes for this request to pending in the database
      const quotesToUpdate = quotes.filter(q => 
        q.requestId === rejectedQuote.requestId && q.id !== quoteId
      );
      
      try {
        await Promise.all(
          quotesToUpdate.map(quote => updateQuoteStatus(quote.id, 'pending'))
        );
      } catch (error) {
        console.error("Error updating quote statuses:", error);
      }
      
      // Reset quotes in local state
      setQuotes(prevQuotes => 
        prevQuotes.map(quote => 
          quote.requestId === rejectedQuote.requestId 
            ? { ...quote, status: quote.id === quoteId ? 'rejected' : 'pending' } 
            : quote
        )
      );
      
      toast({
        title: "קבלת הצעה בוטלה",
        description: "אפשר לבחור הצעה אחרת כעת.",
        variant: "default",
      });
    } else {
      // Normal rejection of a quote - just update local state
      setQuotes(prevQuotes => 
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
    }
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
            quotes={requestQuotes}
            onAcceptQuote={handleAcceptQuote}
            onRejectQuote={handleRejectQuote}
            onViewProfile={handleViewProfile}
          />
        ) : (
          <div className="glass-card flex flex-col items-center justify-center text-center p-10">
            <MessageSquare className="h-12 w-12 text-blue-200 mb-4" />
            <h3 className="text-xl font-semibold text-blue-700 mb-2">
              {isLoading 
                ? "טוען בקשות..." 
                : requests.length > 0 
                  ? "בחר בקשה לצפייה" 
                  : "אין לך בקשות עדיין"}
            </h3>
            <p className="text-gray-600 mb-6 max-w-md">
              {isLoading 
                ? "אנא המתן בזמן שאנו טוענים את הבקשות שלך" 
                : requests.length > 0 
                  ? "בחר אחת מהבקשות מהרשימה משמאל כדי לצפות בפרטים ובהצעות המחיר שהתקבלו" 
                  : "שלח את בקשתך הראשונה ובעלי מקצוע ישלחו לך הצעות מחיר"}
            </p>
            <RequestDialog 
              isOpen={isRequestDialogOpen} 
              onOpenChange={setIsRequestDialogOpen} 
              triggerClassName="bg-[#00d09e] hover:bg-[#00C090]"
              triggerLabel="שלח בקשה חדשה"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default RequestsTab;
