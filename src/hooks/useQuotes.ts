
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { fetchQuotesForRequest, updateQuoteStatus } from '@/services/quotes';
import { QuoteInterface } from '@/types/dashboard';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/providers/AuthProvider';
import { updateRequestStatus } from '@/services/requests';

export const useQuotes = (selectedRequestId: string | null) => {
  const [quotes, setQuotes] = useState<QuoteInterface[]>([]);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [selectedQuoteId, setSelectedQuoteId] = useState<string | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    if (!selectedRequestId) return;

    const fetchQuotes = async () => {
      try {
        const requestQuotes = await fetchQuotesForRequest(selectedRequestId);
        setQuotes(prevQuotes => {
          // Keep quotes for other requests and add the new ones
          const otherQuotes = prevQuotes.filter(q => q.requestId !== selectedRequestId);
          return [...otherQuotes, ...requestQuotes];
        });
      } catch (error) {
        console.error("Error fetching quotes:", error);
      }
    };

    fetchQuotes();
  }, [selectedRequestId]);

  const handleAcceptQuote = async (quoteId: string) => {
    // Store the quote ID and show payment preference dialog
    setSelectedQuoteId(quoteId);
    setShowPaymentDialog(true);
  };
  
  const processQuoteAcceptance = async (quoteId: string, paymentMethod: 'cash' | 'credit') => {
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
    
    // Update the request status to "waiting_for_rating"
    await updateRequestStatus(acceptedQuote.requestId, 'waiting_for_rating');
    
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
        description: acceptedQuote.description,
        payment_method: paymentMethod
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
      
      // If payment method is credit card, redirect to payment page
      if (paymentMethod === 'credit') {
        // Here you would normally redirect to a payment page
        // For now we'll just show a toast
        toast({
          title: "הועברת לעמוד תשלום",
          description: "עמוד התשלום ייפתח בקרוב...",
          variant: "default",
        });
        
        // Navigate to payment page (placeholder)
        window.location.href = `/payment/${quoteId}`;
        return;
      }
      
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

  const closePaymentDialog = () => {
    setShowPaymentDialog(false);
    setSelectedQuoteId(null);
  };

  return { 
    quotes: quotes.filter(q => q.requestId === selectedRequestId), 
    handleAcceptQuote, 
    handleRejectQuote,
    showPaymentDialog,
    selectedQuoteId,
    processQuoteAcceptance,
    closePaymentDialog
  };
};
