import { supabase } from '@/integrations/supabase/client';
import { RequestInterface } from '@/types/dashboard';

// Fetch user requests from the database
export const fetchUserRequests = async (): Promise<RequestInterface[]> => {
  try {
    // We need to use "as any" to bypass TypeScript's type checking
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
    
    // Map the database columns to our interface
    return data.map((item: any) => ({
      id: item.id,
      title: item.title,
      description: item.description,
      date: new Date(item.date).toLocaleDateString('he-IL'),
      location: item.location,
      status: item.status,
      quotesCount: 0, // This will be updated when we fetch quotes
      timing: item.timing
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
}): Promise<string | null> => {
  try {
    // Get current user ID if not provided
    let userId = requestData.user_id;
    
    if (!userId) {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.error('User not authenticated');
        return null;
      }
      userId = user.id;
    }

    // We need to use "as any" to bypass TypeScript's type checking
    const { data, error } = await supabase
      .from('requests')
      .insert({
        title: requestData.title,
        description: requestData.description,
        location: requestData.location,
        timing: requestData.timing || null,
        status: 'active',
        user_id: userId
      })
      .select('id')
      .single();
      
    if (error) {
      console.error('Error creating request:', error);
      throw error;
    }
    
    console.log('Request created successfully:', data);
    // Fix: Add type assertion to ensure data.id is a string
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

// Delete a request
export const deleteRequest = async (id: string): Promise<boolean> => {
  try {
    console.log(`Attempting to delete request with ID: ${id}`);
    
    // First, delete associated quotes from accepted_quotes table
    try {
      console.log(`Deleting accepted quotes for request ${id}`);
      const { data: acceptedQuotesData, error: acceptedQuotesError } = await supabase
        .from('accepted_quotes')
        .select('*')
        .eq('request_id', id);
        
      if (acceptedQuotesError) {
        console.error('Error finding associated accepted quotes:', acceptedQuotesError);
      } else {
        console.log(`Found ${acceptedQuotesData?.length || 0} accepted quotes to delete`);
        
        if (acceptedQuotesData && acceptedQuotesData.length > 0) {
          const { error: deleteAcceptedQuotesError } = await supabase
            .from('accepted_quotes')
            .delete()
            .eq('request_id', id);
            
          if (deleteAcceptedQuotesError) {
            console.error('Error deleting associated accepted quotes:', deleteAcceptedQuotesError);
          } else {
            console.log(`Successfully deleted accepted quotes for request ${id}`);
          }
        }
      }
    } catch (e) {
      console.error('Error in deleting associated accepted quotes:', e);
    }
    
    // Next, get all quotes for this request
    try {
      console.log(`Finding quotes for request ${id}`);
      const { data: quotesData, error: quotesError } = await supabase
        .from('quotes')
        .select('*')
        .eq('request_id', id);
        
      if (quotesError) {
        console.error('Error finding associated quotes:', quotesError);
      } else {
        console.log(`Found ${quotesData?.length || 0} quotes to delete`);
        
        // Delete all quotes for this request
        if (quotesData && quotesData.length > 0) {
          const { error: deleteQuotesError } = await supabase
            .from('quotes')
            .delete()
            .eq('request_id', id);
            
          if (deleteQuotesError) {
            console.error('Error deleting associated quotes:', deleteQuotesError);
          } else {
            console.log(`Successfully deleted quotes for request ${id}`);
          }
        }
      }
    } catch (e) {
      console.error('Error in deleting associated quotes:', e);
    }
    
    // Finally, delete the request itself
    console.log(`Deleting request ${id}`);
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
    
    // Verify the request has been deleted
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
