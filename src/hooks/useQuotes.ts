
import { useState, useEffect, useCallback } from 'react';
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
  const [lastAcceptedQuoteId, setLastAcceptedQuoteId] = useState<string | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  const fetchQuotes = useCallback(async (requestId: string) => {
    try {
      console.log("Fetching quotes for request:", requestId);
      const requestQuotes = await fetchQuotesForRequest(requestId);
      console.log("Fetched quotes:", requestQuotes);
      
      setQuotes(prevQuotes => {
        // Keep quotes for other requests and add the new ones
        const otherQuotes = prevQuotes.filter(q => q.requestId !== requestId);
        return [...otherQuotes, ...requestQuotes];
      });
      
      // Check if there's an accepted quote and store its ID
      const acceptedQuote = requestQuotes.find(q => q.status === 'accepted');
      if (acceptedQuote) {
        setLastAcceptedQuoteId(acceptedQuote.id);
      }
    } catch (error) {
      console.error("Error fetching quotes:", error);
    }
  }, []);

  // Load quotes when selectedRequestId changes
  useEffect(() => {
    if (!selectedRequestId) return;
    console.log("Selected request ID changed, fetching quotes:", selectedRequestId);
    fetchQuotes(selectedRequestId);
  }, [selectedRequestId, fetchQuotes]);
  
  const refreshQuotes = useCallback((requestId: string) => {
    if (!requestId) return;
    console.log("Manually refreshing quotes for request:", requestId);
    fetchQuotes(requestId);
  }, [fetchQuotes]);

  const handleAcceptQuote = async (quoteId: string) => {
    // Get the quote that's being considered
    const quote = quotes.find(q => q.id === quoteId);
    console.log("Handling accept quote:", quoteId, quote);
    
    // If the quote is already accepted, don't show the payment dialog again
    if (quote?.status === 'accepted') {
      toast({
        title: "הצעה זו כבר אושרה",
        description: "הצעת המחיר הזו כבר אושרה בעבר.",
        variant: "default",
      });
      return;
    }
    
    // Store the quote ID and show payment preference dialog
    setSelectedQuoteId(quoteId);
    setShowPaymentDialog(true);
  };
  
  const processQuoteAcceptance = async (quoteId: string, paymentMethod: 'cash' | 'credit') => {
    // Find the quote that's being accepted
    const acceptedQuote = quotes.find(q => q.id === quoteId);
    if (!acceptedQuote || !user) {
      console.error("Cannot process quote acceptance: quote or user not found");
      return;
    }
    
    console.log("Processing quote acceptance:", quoteId, "Payment method:", paymentMethod);
    console.log("Quote details:", acceptedQuote);
    
    // Ensure price is properly formatted as a string with a default value
    let quotePrice = "";
    if (typeof acceptedQuote.price === 'string' && acceptedQuote.price.length > 0) {
      quotePrice = acceptedQuote.price;
    } else if (typeof acceptedQuote.price === 'number') {
      quotePrice = String(acceptedQuote.price);
    } else {
      quotePrice = "0"; // Default price if empty
    }
    
    console.log("Quote price:", quotePrice);
    
    try {
      // Start a transaction by updating multiple related records
      
      // 1. Update the quote status in the database
      console.log("Updating quote status to 'accepted'");
      const success = await updateQuoteStatus(quoteId, 'accepted');
      
      if (!success) {
        toast({
          title: "שגיאה בקבלת ההצעה",
          description: "אירעה שגיאה בקבלת ההצעה. אנא נסה שוב.",
          variant: "destructive",
        });
        return;
      }

      // Store the accepted quote ID for persistent state
      setLastAcceptedQuoteId(quoteId);
      
      // 2. Update the request status to "waiting_for_rating"
      console.log("Updating request status to 'waiting_for_rating'");
      const requestUpdateSuccess = await updateRequestStatus(acceptedQuote.requestId, 'waiting_for_rating');
      
      if (!requestUpdateSuccess) {
        console.error("Failed to update request status");
      }
      
      // 3. Update local state - mark this quote as accepted and others for this request as rejected
      console.log("Updating local quotes state");
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
      
      // 4. Save the accepted quote to the database
      console.log("Saving quote acceptance to database");
      
      console.log("Formatted quote price for storage:", quotePrice);
      
      const acceptedQuoteData = {
        user_id: user.id,
        quote_id: quoteId,
        request_id: acceptedQuote.requestId,
        professional_id: acceptedQuote.professional.id,
        professional_name: acceptedQuote.professional.name,
        price: quotePrice, // Ensure price is stored as a string with a value
        date: new Date().toISOString(),
        status: 'accepted',
        description: acceptedQuote.description,
        payment_method: paymentMethod,
        created_at: new Date().toISOString() // Explicitly set created_at
      };
      
      console.log("Accepted quote data being saved:", acceptedQuoteData);
      
      try {
        // Try to insert first, then update if insert fails
        const { error: insertError } = await supabase
          .from('accepted_quotes')
          .insert(acceptedQuoteData);
          
        if (insertError) {
          console.log("Insert failed, trying upsert instead:", insertError);
          // If insert fails, try upsert
          const { error: upsertError } = await supabase
            .from('accepted_quotes')
            .upsert(acceptedQuoteData, {
              onConflict: 'quote_id',
              ignoreDuplicates: false
            });
            
          if (upsertError) {
            console.error("Error saving accepted quote:", upsertError);
            // Don't throw here, continue with the workflow
          }
        }
      } catch (dbError) {
        console.error("Database error:", dbError);
        // Don't throw here, continue with the workflow
      }
      
      // 5. Also save phone reveal in referrals automatically
      console.log("Saving referral record");
      try {
        const referral = {
          id: crypto.randomUUID(),
          user_id: user.id,
          professional_id: acceptedQuote.professional.id,
          professional_name: acceptedQuote.professional.name,
          phone_number: acceptedQuote.professional.phoneNumber || acceptedQuote.professional.phone || "050-1234567",
          date: new Date().toISOString(),
          status: "accepted_quote",
          profession: acceptedQuote.professional.profession,
          completed_work: false
        };
        
        const { error: referralError } = await supabase
          .from('referrals')
          .insert(referral);
        
        if (referralError) {
          console.error("Error saving referral:", referralError);
        }
      } catch (refError) {
        console.error("Error creating referral:", refError);
      }
      
      // If payment method is credit card, redirect to payment page
      if (paymentMethod === 'credit') {
        // Here you would normally redirect to a payment page
        toast({
          title: "הועברת לעמוד תשלום",
          description: "עמוד התשלום ייפתח בקרוב...",
          variant: "default",
        });
        
        // Navigate to payment page
        window.location.href = `/payment/${quoteId}?price=${encodeURIComponent(quotePrice)}`;
        return;
      }
      
      toast({
        title: "הצעה התקבלה",
        description: "הודעה נשלחה לבעל המקצוע. הוא יצור איתך קשר בהקדם.",
        variant: "default",
      });
      
      // Refresh quotes after acceptance is complete
      if (selectedRequestId) {
        setTimeout(() => {
          console.log("Refreshing quotes after payment method selection");
          refreshQuotes(selectedRequestId);
        }, 500);
      }
      
    } catch (error) {
      console.error("Error in quote acceptance process:", error);
      toast({
        title: "שגיאה בתהליך קבלת ההצעה",
        description: "אירעה שגיאה בתהליך. אנא נסה שוב מאוחר יותר.",
        variant: "destructive",
      });
    }
  };

  const handleRejectQuote = async (quoteId: string) => {
    const rejectedQuote = quotes.find(q => q.id === quoteId);
    if (!rejectedQuote) {
      console.error("Cannot reject quote: quote not found");
      return;
    }
    
    console.log("Handling reject quote:", quoteId);
    
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
      console.log("Canceling previously accepted quote");
      
      // Clear the last accepted quote ID
      if (lastAcceptedQuoteId === quoteId) {
        setLastAcceptedQuoteId(null);
      }
      
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
      
      // Also update the request status back to active
      updateRequestStatus(rejectedQuote.requestId, 'active').catch(error => {
        console.error("Error updating request status:", error);
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
    
    // Refresh quotes after rejection is complete
    refreshQuotes(rejectedQuote.requestId);
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
    closePaymentDialog,
    refreshQuotes
  };
};

