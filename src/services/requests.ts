
import { supabase } from '@/integrations/supabase/client';
import { RequestInterface } from '@/types/dashboard';

// Fetch user requests from the database
export const fetchUserRequests = async (): Promise<RequestInterface[]> => {
  try {
    // Use a type assertion to allow working with the new table
    const { data, error } = await supabase
      .from('requests' as any)
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
}): Promise<string | null> => {
  try {
    // Get current user ID
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.error('User not authenticated');
      return null;
    }

    // Use a type assertion to allow working with the new table
    const { data, error } = await supabase
      .from('requests' as any)
      .insert({
        title: requestData.title,
        description: requestData.description,
        location: requestData.location,
        timing: requestData.timing || null,
        status: 'active',
        user_id: user.id
      })
      .select('id')
      .single();
      
    if (error) {
      console.error('Error creating request:', error);
      throw error;
    }
    
    console.log('Request created successfully:', data);
    return data.id;
  } catch (error) {
    console.error('Error creating request:', error);
    return null;
  }
};

// Get a single request by ID
export const getRequestById = async (id: string): Promise<RequestInterface | null> => {
  try {
    // Use a type assertion to allow working with the new table
    const { data, error } = await supabase
      .from('requests' as any)
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
    
    // Return the request in the format expected by the interface
    return {
      id: data.id,
      title: data.title,
      description: data.description,
      date: new Date(data.date).toLocaleDateString('he-IL'),
      location: data.location,
      status: data.status,
      quotesCount: 0, // This will be updated when we fetch quotes
      timing: data.timing
    };
  } catch (error) {
    console.error('Error fetching request by ID:', error);
    return null;
  }
};

// Update request status
export const updateRequestStatus = async (id: string, status: string): Promise<boolean> => {
  try {
    // Use a type assertion to allow working with the new table
    const { error } = await supabase
      .from('requests' as any)
      .update({ status, updated_at: new Date() })
      .eq('id', id);
      
    if (error) {
      console.error('Error updating request status:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error updating request status:', error);
    return false;
  }
};

// Delete a request
export const deleteRequest = async (id: string): Promise<boolean> => {
  try {
    // Use a type assertion to allow working with the new table
    const { error } = await supabase
      .from('requests' as any)
      .delete()
      .eq('id', id);
      
    if (error) {
      console.error('Error deleting request:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error deleting request:', error);
    return false;
  }
};
