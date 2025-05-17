
import { supabase } from '@/integrations/supabase/client';
import { RequestInterface } from '@/types/dashboard';

// Fetch user requests from the database
export const fetchUserRequests = async (): Promise<RequestInterface[]> => {
  try {
    const { data, error } = await supabase
      .from('requests')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching requests:', error);
      throw error;
    }

    if (!data || data.length === 0) {
      console.log('No requests found in the database');
      return [];
    }

    return data.map((item: any) => ({
      id: item.id,
      title: item.title,
      description: item.description,
      date: new Date(item.date).toLocaleDateString('he-IL'),
      location: item.location,
      status: item.status,
      quotesCount: 0,
      timing: item.timing,
      media_urls: item.media_urls || [],
      category: item.category || '', // Keep compatibility
    }));
  } catch (error) {
    console.error('Error fetching requests:', error);
    return [];
  }
};


// Create a new request in the database
export const createRequest = async (requestData: {
  title: string;
  description: string;
  location: string;
  timing?: string;
  user_id?: string;
  category?: string;
  media_urls?: string[];
}): Promise<string | null> => {
  try {
    let userId = requestData.user_id;

    if (!userId) {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.error('User not authenticated');
        return null;
      }
      userId = user.id;
    }

    // עדכון: שמירת category וגם media_urls
    const { data, error } = await supabase
      .from('requests')
      .insert({
        title: requestData.title,
        description: requestData.description,
        location: requestData.location,
        timing: requestData.timing || null,
        status: 'active',
        user_id: userId,
        category: requestData.category || requestData.title,
        media_urls: requestData.media_urls && requestData.media_urls.length > 0 
          ? requestData.media_urls 
          : null
      })
      .select('id')
      .single();

    if (error) {
      console.error('Error creating request:', error);
      throw error;
    }

    return data && 'id' in data ? String(data.id) : null;
  } catch (error) {
    console.error('Error creating request:', error);
    return null;
  }
};

// Get a single request by ID
export const getRequestById = async (id: string): Promise<RequestInterface | null> => {
  try {
    // We need to use "as any" to bypass TypeScript's type checking
    const { data, error } = await supabase
      .from('requests')
      .select('*')
      .eq('id', id)
      .maybeSingle();
      
    if (error) {
      console.error('Error fetching request by ID:', error);
      return null;
    }
    
    if (!data) {
      console.log(`Request with ID ${id} not found in database`);
      return null;
    }
    
    // Use type assertion to ensure TypeScript knows the structure
    const request = data as any;
    
    // Return the request in the format expected by the interface
    return {
      id: request.id,
      title: request.title,
      description: request.description,
      date: new Date(request.date).toLocaleDateString('he-IL'),
      location: request.location,
      status: request.status,
      quotesCount: 0, // This will be updated when we fetch quotes
      timing: request.timing
    };
  } catch (error) {
    console.error('Error fetching request by ID:', error);
    return null;
  }
};

// Update request status
export const updateRequestStatus = async (id: string, status: string): Promise<boolean> => {
  try {
    console.log(`Updating request ${id} status to ${status}`);
    // We need to use "as any" to bypass TypeScript's type checking
    const { error } = await supabase
      .from('requests')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id);
      
    if (error) {
      console.error('Error updating request status:', error);
      return false;
    }
    
    console.log(`Request ${id} status updated to ${status} successfully`);
    return true;
  } catch (error) {
    console.error('Error updating request status:', error);
    return false;
  }
};

// Delete a request with improved error handling and verification
export const deleteRequest = async (id: string): Promise<boolean> => {
  try {
    console.log(`Starting deletion process for request with ID: ${id}`);
    
    // Step 1: Delete associated quotes from accepted_quotes table
    console.log(`Step 1: Deleting accepted quotes for request ${id}`);
    try {
      const { data: acceptedQuotesData, error: acceptedQuotesError } = await supabase
        .from('accepted_quotes')
        .select('quote_id')
        .eq('request_id', id);
        
      if (acceptedQuotesError) {
        console.error('Error finding associated accepted quotes:', acceptedQuotesError);
      } else {
        console.log(`Found ${acceptedQuotesData?.length || 0} accepted quotes to delete`);
        
        if (acceptedQuotesData && acceptedQuotesData.length > 0) {
          // Log each quote being deleted
          for (const record of acceptedQuotesData) {
            console.log(`Deleting accepted quote with quote_id: ${record.quote_id}`);
          }
          
          // Delete all accepted quotes for this request
          const { error: deleteAcceptedQuotesError } = await supabase
            .from('accepted_quotes')
            .delete()
            .eq('request_id', id);
            
          if (deleteAcceptedQuotesError) {
            console.error('Error deleting associated accepted quotes:', deleteAcceptedQuotesError);
          } else {
            console.log(`Successfully deleted accepted quotes for request ${id}`);
            
            // Verify deletion of accepted quotes
            const { data: verifyData, error: verifyError } = await supabase
              .from('accepted_quotes')
              .select('*')
              .eq('request_id', id);
              
            if (verifyError) {
              console.error('Error verifying accepted quotes deletion:', verifyError);
            } else if (verifyData && verifyData.length > 0) {
              console.error('Some accepted quotes were not deleted!', verifyData);
            } else {
              console.log('Verified: all accepted quotes were deleted successfully');
            }
          }
        }
      }
    } catch (e) {
      console.error('Error in deleting associated accepted quotes:', e);
      // Continue with the process despite errors
    }
    
    // Step 2: Get and delete all quotes for this request
    console.log(`Step 2: Finding and deleting quotes for request ${id}`);
    try {
      const { data: quotesData, error: quotesError } = await supabase
        .from('quotes')
        .select('id')
        .eq('request_id', id);
        
      if (quotesError) {
        console.error('Error finding associated quotes:', quotesError);
      } else {
        console.log(`Found ${quotesData?.length || 0} quotes to delete`);
        
        // Delete all quotes for this request
        if (quotesData && quotesData.length > 0) {
          // Log each quote being deleted
          for (const quote of quotesData) {
            console.log(`Deleting quote with ID: ${quote.id}`);
          }
          
          const { error: deleteQuotesError } = await supabase
            .from('quotes')
            .delete()
            .eq('request_id', id);
            
          if (deleteQuotesError) {
            console.error('Error deleting associated quotes:', deleteQuotesError);
          } else {
            console.log(`Successfully deleted quotes for request ${id}`);
            
            // Verify deletion of quotes
            const { data: verifyData, error: verifyError } = await supabase
              .from('quotes')
              .select('*')
              .eq('request_id', id);
              
            if (verifyError) {
              console.error('Error verifying quotes deletion:', verifyError);
            } else if (verifyData && verifyData.length > 0) {
              console.error('Some quotes were not deleted!', verifyData);
            } else {
              console.log('Verified: all quotes were deleted successfully');
            }
          }
        }
      }
    } catch (e) {
      console.error('Error in deleting associated quotes:', e);
      // Continue with the process despite errors
    }
    
    // Step 3: Finally, delete the request itself
    console.log(`Step 3: Deleting request ${id}`);
    const { error, data } = await supabase
      .from('requests')
      .delete()
      .eq('id', id)
      .select();
      
    if (error) {
      console.error('Error deleting request:', error);
      return false;
    }
    
    console.log(`Successfully deleted request ${id}:`, data);
    
    // Step 4: Verify the request has been deleted
    console.log(`Step 4: Verifying request ${id} was deleted`);
    const { data: verifyData, error: verifyError } = await supabase
      .from('requests')
      .select('*')
      .eq('id', id);
      
    if (verifyError) {
      console.error('Error verifying request deletion:', verifyError);
    } else {
      if (verifyData && verifyData.length > 0) {
        console.error('Request deletion verification failed - request still exists:', verifyData);
        return false;
      } else {
        console.log('Request deletion verified successfully - request no longer exists');
      }
    }
    
    return true;
  } catch (error) {
    console.error('Error deleting request:', error);
    return false;
  }
};
