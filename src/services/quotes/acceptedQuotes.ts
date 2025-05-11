
import { supabase } from '@/integrations/supabase/client';

// Check if a quote is already accepted for this request
export const checkIfAcceptedQuoteExists = async (
  requestId: string, 
  quoteId: string
): Promise<boolean> => {
  try {
    // First check if the quote itself is already accepted
    const { data: acceptedData, error: acceptedError } = await supabase
      .from('accepted_quotes')
      .select('*')
      .eq('quote_id', quoteId)
      .single();

    if (acceptedData) {
      console.log("This quote is already accepted in the database:", acceptedData);
      return true;
    }
    
    // Then check if any quote for this request is accepted
    const { data: requestAcceptedData, error: requestAcceptedError } = await supabase
      .from('accepted_quotes')
      .select('*')
      .eq('request_id', requestId);
      
    if (requestAcceptedData && requestAcceptedData.length > 0) {
      console.log("Another quote for this request is already accepted:", requestAcceptedData);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error("Error checking for existing accepted quote:", error);
    return false;
  }
};

// Save an accepted quote to the database
export const saveAcceptedQuote = async (
  acceptedQuoteData: {
    user_id: string;
    quote_id: string;
    request_id: string;
    professional_id: string;
    professional_name: string;
    price: string;
    date: string;
    status: string;
    description: string;
    payment_method: 'cash' | 'credit';
    created_at: string;
  }
): Promise<boolean> => {
  try {
    console.log("Accepted quote data being saved:", acceptedQuoteData);
    
    // Check if record exists first
    const { data: existingRecord, error: checkError } = await supabase
      .from('accepted_quotes')
      .select('*')
      .eq('quote_id', acceptedQuoteData.quote_id)
      .single();
      
    if (existingRecord) {
      console.log("Record already exists, updating:", existingRecord);
      
      // Update the existing record
      const { error: updateError } = await supabase
        .from('accepted_quotes')
        .update({
          status: 'accepted',
          payment_method: acceptedQuoteData.payment_method,
          updated_at: new Date().toISOString()
        })
        .eq('quote_id', acceptedQuoteData.quote_id);
        
      if (updateError) {
        console.error("Error updating accepted quote:", updateError);
        return false;
      }
    } else {
      // Create a new record
      const { error: insertError } = await supabase
        .from('accepted_quotes')
        .insert(acceptedQuoteData);
        
      if (insertError) {
        console.log("Insert failed, trying upsert instead:", insertError);
        // If insert fails, try upsert with the new RLS policy
        const { error: upsertError } = await supabase
          .from('accepted_quotes')
          .upsert(acceptedQuoteData, {
            onConflict: 'quote_id',
            ignoreDuplicates: false
          });
          
        if (upsertError) {
          console.error("Error saving accepted quote:", upsertError);
          return false;
        }
      }
    }
    
    return true;
  } catch (dbError) {
    console.error("Database error:", dbError);
    return false;
  }
};

// Delete an accepted quote record
export const deleteAcceptedQuote = async (quoteId: string): Promise<boolean> => {
  try {
    // Log the deletion attempt
    console.log(`Attempting to delete accepted quote record for quote ID: ${quoteId}`);
    
    const { error: deleteError, data } = await supabase
      .from('accepted_quotes')
      .delete()
      .eq('quote_id', quoteId)
      .select();
    
    if (deleteError) {
      console.error("Error deleting accepted quote record:", deleteError);
      return false;
    }
    
    console.log("Deleted accepted quote record successfully:", data);
    return true;
  } catch (deleteError) {
    console.error("Error deleting accepted quote record:", deleteError);
    return false;
  }
};
