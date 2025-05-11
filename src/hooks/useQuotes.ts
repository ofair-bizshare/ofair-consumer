import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { QuoteInterface } from '@/types/dashboard';
import { useAuth } from '@/providers/AuthProvider';
import { 
  fetchQuotesForRequest,
  updateQuoteStatus,
  updateRequestStatus,
  checkIfAcceptedQuoteExists,
  saveAcceptedQuote,
  deleteAcceptedQuote,
  saveReferral,
  formatPrice,
  redirectToPayment
} from '@/services/quotes';

export const useQuotes = (selectedRequestId: string | null) => {
  const [quotes, setQuotes] = useState<QuoteInterface[]>([]);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [selectedQuoteId, setSelectedQuoteId] = useState<string | null>(null);
  const [lastAcceptedQuoteId, setLastAcceptedQuoteId] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  // Load quotes when selectedRequestId changes
  useEffect(() => {
    if (!selectedRequestId) return;
    console.log("Selected request ID changed, fetching quotes:", selectedRequestId);
    refreshQuotes(selectedRequestId);
  }, [selectedRequestId]);
  
  // Function to refresh quotes
  const refreshQuotes = useCallback(async (requestId: string) => {
    if (!requestId) return;
    console.log("Manually refreshing quotes for request:", requestId);
    
    try {
      // Fetch quotes from database
      const requestQuotes = await fetchQuotesForRequest(requestId);
      
      if (!requestQuotes) {
        console.error("Failed to fetch quotes or received null/undefined");
        setQuotes([]);
        return;
      }
      
      // Check for an accepted quote in the fetched quotes
      const acceptedQuote = requestQuotes.find(q => q.status === 'accepted');
      
      // If there's an accepted quote, store its ID
      if (acceptedQuote) {
        setLastAcceptedQuoteId(acceptedQuote.id);
      } else {
        // If there's no accepted quote in the fetched quotes,
        // check if there's one in the database through accepted_quotes table
        for (const quote of requestQuotes) {
          const isAccepted = await checkIfAcceptedQuoteExists(requestId, quote.id);
          if (isAccepted) {
            // Update local state to reflect this quote is accepted
            console.log(`Quote ${quote.id} is marked as accepted in database but not in quotes table`);
            
            // Update the quote status in the database to match
            await updateQuoteStatus(quote.id, 'accepted');
            
            // Set this as the accepted quote ID
            setLastAcceptedQuoteId(quote.id);
            
            // Break since we found the accepted quote
            break;
          }
        }
      }

      setQuotes(prevQuotes => {
        // Keep quotes for other requests and add the new ones
        const otherQuotes = prevQuotes.filter(q => q.requestId !== requestId);
        return [...otherQuotes, ...requestQuotes];
      });
    } catch (error) {
      console.error("Error fetching quotes:", error);
      toast({
        title: "שגיאה בטעינת הצעות מחיר",
        description: "אירעה שגיאה בטעינת הצעות המחיר, אנא נסה שוב",
        variant: "destructive",
      });
      
      // Set to empty array to prevent undefined issues
      setQuotes(prevQuotes => {
        // Keep quotes for other requests
        return prevQuotes.filter(q => q.requestId !== requestId);
      });
    }
  }, [toast]);

  // Handle accepting a quote
  const handleAcceptQuote = async (quoteId: string) => {
    // Get the quote that's being considered
    const quote = quotes.find(q => q.id === quoteId);
    console.log("Handling accept quote:", quoteId, quote);
    
    if (!quote) {
      console.error("Quote not found:", quoteId);
      toast({
        title: "שגיאה",
        description: "הצעת המחיר לא נמצאה במערכת",
        variant: "destructive",
      });
      return;
    }
    
    // If the quote is already accepted, don't show the payment dialog again
    if (quote.status === 'accepted') {
      toast({
        title: "הצעה זו כבר אושרה",
        description: "הצעת המחיר הזו כבר אושרה בעבר.",
        variant: "default",
      });
      return;
    }

    // Check if any quote for this request is already accepted in the database
    const requestId = quote.requestId;
    const existingAcceptedQuote = await checkIfAcceptedQuoteExists(requestId, quoteId);
    
    if (existingAcceptedQuote) {
      // Update local state to reflect the database state
      setQuotes(prevQuotes => 
        prevQuotes.map(q => {
          if (q.id === quoteId) {
            return { ...q, status: 'accepted' };
          }
          return q;
        })
      );
      
      // Update the last accepted quote ID
      setLastAcceptedQuoteId(quoteId);
      
      toast({
        title: "הצעה זו כבר אושרה",
        description: "הצעת המחיר הזו כבר אושרה במערכת.",
        variant: "default",
      });
      return;
    }
    
    // Store the quote ID and show payment preference dialog
    setSelectedQuoteId(quoteId);
    setShowPaymentDialog(true);
  };
  
  // Process quote acceptance after payment method selection
  const processQuoteAcceptance = async (quoteId: string, paymentMethod: 'cash' | 'credit') => {
    if (isProcessing) {
      console.log("Already processing a quote, please wait");
      return;
    }

    setIsProcessing(true);

    // Find the quote that's being accepted
    const acceptedQuote = quotes.find(q => q.id === quoteId);
    if (!acceptedQuote || !user) {
      console.error("Cannot process quote acceptance: quote or user not found");
      setIsProcessing(false);
      return;
    }
    
    console.log("Processing quote acceptance:", quoteId, "Payment method:", paymentMethod);
    console.log("Quote details:", acceptedQuote);
    
    // Format price properly
    const quotePrice = formatPrice(acceptedQuote.price);
    console.log("Quote price:", quotePrice);
    
    try {
      // 1. Check if this quote is already accepted in the database
      const isAlreadyAccepted = await checkIfAcceptedQuoteExists(acceptedQuote.requestId, quoteId);
      
      if (isAlreadyAccepted) {
        console.log("Quote already accepted in database, skipping database operations");
        
        // Just update local state
        setQuotes(prevQuotes => 
          prevQuotes.map(quote => 
            quote.id === quoteId ? { ...quote, status: 'accepted' } : quote
          )
        );
        
        setLastAcceptedQuoteId(quoteId);
        
        toast({
          title: "הצעה התקבלה",
          description: "הצעת המחיר כבר אושרה במערכת",
          variant: "default",
        });
        
        setIsProcessing(false);
        return;
      }
      
      // 2. Update the quote status in the database to 'accepted'
      console.log("Updating quote status to 'accepted'");
      const success = await updateQuoteStatus(quoteId, 'accepted');
      
      if (!success) {
        toast({
          title: "שגיאה בקבלת ההצעה",
          description: "אירעה שגיאה בקבלת ההצעה. אנא נסה שוב.",
          variant: "destructive",
        });
        setIsProcessing(false);
        return;
      }

      // Store the accepted quote ID for persistent state
      setLastAcceptedQuoteId(quoteId);
      
      // 3. Update the request status to "waiting_for_rating"
      console.log("Updating request status to 'waiting_for_rating'");
      const requestUpdateSuccess = await updateRequestStatus(acceptedQuote.requestId, 'waiting_for_rating');
      
      if (!requestUpdateSuccess) {
        console.error("Failed to update request status");
      }
      
      // 4. Update local state - mark this quote as accepted and others for this request as rejected
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
      
      // 5. Save the accepted quote to the database
      console.log("Saving quote acceptance to database");
      
      const acceptedQuoteData = {
        user_id: user.id,
        quote_id: quoteId,
        request_id: acceptedQuote.requestId,
        professional_id: acceptedQuote.professional.id,
        professional_name: acceptedQuote.professional.name,
        price: quotePrice,
        date: new Date().toISOString(),
        status: 'accepted',
        description: acceptedQuote.description,
        payment_method: paymentMethod,
        created_at: new Date().toISOString()
      };
      
      await saveAcceptedQuote(acceptedQuoteData);
      
      // 6. Also save phone reveal in referrals automatically
      await saveReferral(
        user.id,
        acceptedQuote.professional.id,
        acceptedQuote.professional.name,
        acceptedQuote.professional.phoneNumber || acceptedQuote.professional.phone || "050-1234567",
        acceptedQuote.professional.profession
      );
      
      // If payment method is credit card, redirect to payment page
      if (paymentMethod === 'credit') {
        toast({
          title: "הועברת לעמוד תשלום",
          description: "עמוד התשלום ייפתח בקרוב...",
          variant: "default",
        });
        
        // Navigate to payment page
        redirectToPayment(quoteId, quotePrice);
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
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle rejecting a quote
  const handleRejectQuote = async (quoteId: string) => {
    if (isProcessing) {
      console.log("Already processing a quote, please wait");
      return;
    }
    
    setIsProcessing(true);
    
    // Log the action for debugging
    console.log(`Starting quote rejection process for quote ID: ${quoteId}`);
    
    const rejectedQuote = quotes.find(q => q.id === quoteId);
    if (!rejectedQuote) {
      console.error("Cannot reject quote: quote not found");
      setIsProcessing(false);
      return;
    }
    
    console.log("Handling reject quote:", quoteId);
    console.log("Quote details:", rejectedQuote);
    
    try {
      // If this is canceling an accepted quote
      if (rejectedQuote.status === 'accepted') {
        console.log("Canceling previously accepted quote");
        
        // Clear the last accepted quote ID
        if (lastAcceptedQuoteId === quoteId) {
          setLastAcceptedQuoteId(null);
        }
        
        // First, delete from accepted_quotes table
        const deleteResult = await deleteAcceptedQuote(quoteId);
        console.log("Delete from accepted_quotes result:", deleteResult);
        
        if (!deleteResult) {
          console.error("Failed to delete from accepted_quotes table");
          // Continue anyway as we still want to update the UI
        }
        
        // Update quote status in the database
        const updateSuccess = await updateQuoteStatus(quoteId, 'rejected');
        console.log("Update quote status result:", updateSuccess);
        
        if (!updateSuccess) {
          toast({
            title: "שגיאה בדחיית ההצעה",
            description: "אירעה שגיאה בדחיית ההצעה. אנא נסה שוב.",
            variant: "destructive",
          });
          setIsProcessing(false);
          return;
        }
        
        // Reset all quotes for this request to pending in the database
        const quotesToUpdate = quotes.filter(q => 
          q.requestId === rejectedQuote.requestId && q.id !== quoteId
        );
        
        console.log("Quotes to update to pending:", quotesToUpdate);
        
        try {
          const updateResults = await Promise.all(
            quotesToUpdate.map(quote => updateQuoteStatus(quote.id, 'pending'))
          );
          console.log("Update other quotes to pending results:", updateResults);
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
        
        // Update the request status back to active
        const requestUpdateSuccess = await updateRequestStatus(rejectedQuote.requestId, 'active');
        console.log("Update request status to active result:", requestUpdateSuccess);
        
        toast({
          title: "קבלת הצעה בוטלה",
          description: "אפשר לבחור הצעה אחרת כעת.",
          variant: "default",
        });
      } else {
        // Normal rejection of a quote
        console.log("Standard quote rejection (not previously accepted)");
        
        // Update quote status in the database
        const updateSuccess = await updateQuoteStatus(quoteId, 'rejected');
        console.log("Update quote status result:", updateSuccess);
        
        if (!updateSuccess) {
          toast({
            title: "שגיאה בדחיית ההצעה",
            description: "אירעה שגיאה בדחיית ההצעה. אנא נסה שוב.",
            variant: "destructive",
          });
          setIsProcessing(false);
          return;
        }
        
        // Update local state
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
    } catch (error) {
      console.error("Error in quote rejection process:", error);
      toast({
        title: "שגיאה בתהליך דחיית ההצעה",
        description: "אירעה שגיאה בתהליך. אנא נסה שוב מאוחר יותר.",
        variant: "destructive",
      });
    } finally {
      // Refresh quotes after rejection is complete
      if (rejectedQuote.requestId) {
        console.log("Refreshing quotes after rejection");
        await refreshQuotes(rejectedQuote.requestId);
      }
      setIsProcessing(false);
    }
  };

  // Close payment dialog
  const closePaymentDialog = () => {
    setShowPaymentDialog(false);
    setSelectedQuoteId(null);
  };

  return { 
    quotes: selectedRequestId ? quotes.filter(q => q.requestId === selectedRequestId) : [], 
    handleAcceptQuote, 
    handleRejectQuote,
    showPaymentDialog,
    selectedQuoteId,
    processQuoteAcceptance,
    closePaymentDialog,
    refreshQuotes,
    isProcessing
  };
};
