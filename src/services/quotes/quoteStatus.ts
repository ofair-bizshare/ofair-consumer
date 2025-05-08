
import { supabase } from '@/integrations/supabase/client';

// Update quote status
export const updateQuoteStatus = async (id: string, status: string): Promise<boolean> => {
  try {
    console.log(`Updating quote ${id} status to ${status}`);
    const timestamp = new Date().toISOString();
    
    // We need to use "as any" to bypass TypeScript's type checking
    const { error, data } = await supabase
      .from('quotes' as any)
      .update({ 
        status, 
        updated_at: timestamp 
      })
      .eq('id', id)
      .select();
      
    if (error) {
      console.error('Error updating quote status:', error);
      return false;
    }
    
    console.log(`Quote ${id} status updated to ${status} successfully:`, data);
    return true;
  } catch (error) {
    console.error('Error updating quote status:', error);
    return false;
  }
};

// Update request status
export const updateRequestStatus = async (requestId: string, status: string): Promise<boolean> => {
  try {
    console.log(`Updating request ${requestId} status to ${status}`);
    // We need to use "as any" to bypass TypeScript's type checking
    const { error } = await supabase
      .from('requests' as any)
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', requestId);
      
    if (error) {
      console.error('Error updating request status:', error);
      return false;
    }
    
    console.log(`Request ${requestId} status updated to ${status} successfully`);
    return true;
  } catch (error) {
    console.error('Error updating request status:', error);
    return false;
  }
};
