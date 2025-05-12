
import { supabase } from '@/integrations/supabase/client';

// Check if a quote is already accepted for this request
export const checkIfAcceptedQuoteExists = async (
  requestId: string, 
  quoteId: string
): Promise<boolean> => {
  try {
    console.log(`Checking if quote ${quoteId} for request ${requestId} is accepted...`);
    
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
    
    console.log(`No accepted quotes found for quote ${quoteId} or request ${requestId}`);
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
    
    // Start a transaction to ensure data consistency
    const { data: transactionData, error: transactionError } = await supabase.rpc('begin_transaction');
    
    if (transactionError) {
      console.error("Error starting transaction:", transactionError);
      // Proceed anyway using individual operations
    }
    
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
    
    // Verify that the record was created/updated successfully
    const { data: verifyData, error: verifyError } = await supabase
      .from('accepted_quotes')
      .select('*')
      .eq('quote_id', acceptedQuoteData.quote_id)
      .single();
      
    if (verifyError || !verifyData) {
      console.error("Failed to verify accepted quote was saved:", verifyError);
      return false;
    }
    
    console.log("Verified accepted quote was saved successfully:", verifyData);
    return true;
  } catch (dbError) {
    console.error("Database error:", dbError);
    return false;
  }
};

// Delete an accepted quote record - improved with verification and error handling
export const deleteAcceptedQuote = async (quoteId: string): Promise<boolean> => {
  try {
    // Log the deletion attempt
    console.log(`Attempting to delete accepted quote record for quote ID: ${quoteId}`);
    
    // First check if the record exists
    const { data: existingRecord, error: checkError } = await supabase
      .from('accepted_quotes')
      .select('*')
      .eq('quote_id', quoteId);
    
    if (checkError) {
      console.error("Error checking for existing accepted quote:", checkError);
      return false;
    }
    
    if (!existingRecord || existingRecord.length === 0) {
      console.log(`No accepted quote record found for quote ID: ${quoteId}`);
      return true; // Already doesn't exist, so we can consider this a success
    }
    
    console.log(`Found ${existingRecord.length} accepted quote records to delete:`, existingRecord);
    
    // Now perform the deletion
    const { error: deleteError, data: deletedData } = await supabase
      .from('accepted_quotes')
      .delete()
      .eq('quote_id', quoteId)
      .select();
    
    if (deleteError) {
      console.error("Error deleting accepted quote record:", deleteError);
      return false;
    }
    
    console.log("Deleted accepted quote record successfully:", deletedData);
    
    // Verify the deletion was successful by checking if the record still exists
    const { data: verifyData, error: verifyError } = await supabase
      .from('accepted_quotes')
      .select('*')
      .eq('quote_id', quoteId);
    
    if (verifyError) {
      console.error("Error verifying deletion:", verifyError);
    } else {
      if (verifyData && verifyData.length > 0) {
        console.error("Failed to delete accepted quote record - it still exists!", verifyData);
        return false;
      } else {
        console.log("Verified deletion: record no longer exists");
      }
    }
    
    return true;
  } catch (deleteError) {
    console.error("Error deleting accepted quote record:", deleteError);
    return false;
  }
};

// Get all accepted quotes for a request
export const getAcceptedQuoteForRequest = async (requestId: string): Promise<any | null> => {
  try {
    console.log(`Getting accepted quote for request ${requestId}`);
    
    const { data, error } = await supabase
      .from('accepted_quotes')
      .select('*')
      .eq('request_id', requestId)
      .maybeSingle();  // Use maybeSingle to avoid errors when no record is found
      
    if (error) {
      console.error("Error getting accepted quote for request:", error);
      throw error;
    }
    
    if (!data) {
      console.log(`No accepted quote found for request ${requestId}`);
      return null;
    }
    
    console.log(`Found accepted quote for request ${requestId}:`, data);
    return data;
  } catch (error) {
    console.error("Error getting accepted quote for request:", error);
    return null;
  }
};

// Get accepted quote by ID with full verification
export const getAcceptedQuoteById = async (quoteId: string): Promise<any | null> => {
  try {
    console.log(`Getting accepted quote for quote ID ${quoteId}`);
    
    const { data, error } = await supabase
      .from('accepted_quotes')
      .select('*')
      .eq('quote_id', quoteId)
      .maybeSingle();
      
    if (error) {
      console.error("Error getting accepted quote by ID:", error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error("Error getting accepted quote by ID:", error);
    return null;
  }
};
