
import { supabase } from '@/integrations/supabase/client';
import { QuoteInterface } from '@/types/dashboard';
import { getProfessional } from '@/services/professionals';

// Fetch quotes for a specific request
export const fetchQuotesForRequest = async (requestId: string): Promise<QuoteInterface[]> => {
  try {
    console.log(`Fetching quotes for request: ${requestId}`);
    // We need to use "as any" to bypass TypeScript's type checking for tables that aren't in the generated types
    const { data, error } = await supabase
      .from('quotes' as any)
      .select('*')
      .eq('request_id', requestId)
      .order('created_at', { ascending: false });
      
    if (error) {
      console.error('Error fetching quotes:', error);
      throw error;
    }
    
    if (!data || data.length === 0) {
      console.log('No quotes found for this request');
      return [];
    }
    
    console.log(`Found ${data.length} quotes for request ${requestId}`);
    
    // Fetch professional details for each quote
    const quotes = await Promise.all(
      data.map(async (quote: any) => {
        try {
          const professional = await getProfessional(quote.professional_id);
          if (!professional) {
            console.error(`Professional not found for ID: ${quote.professional_id}`);
            return null;
          }
          
          // Ensure price is always a string
          const price = typeof quote.price === 'string' ? quote.price : String(quote.price);
          
          return {
            id: quote.id,
            requestId: quote.request_id,
            professional,
            price: price, // Ensure price is a string
            estimatedTime: quote.estimated_time || '',
            description: quote.description,
            status: quote.status,
            sampleImageUrl: quote.sample_image_url || null
          };
        } catch (err) {
          console.error(`Error processing quote:`, err);
          return null;
        }
      })
    );
    
    // Filter out any null quotes (where professional wasn't found)
    const validQuotes = quotes.filter(quote => quote !== null) as QuoteInterface[];
    console.log('Processed quotes:', validQuotes);
    return validQuotes;
  } catch (error) {
    console.error('Error fetching quotes for request:', error);
    return [];
  }
};

// Create a new quote
export const createQuote = async (quoteData: {
  requestId: string;
  professionalId: string;
  price: string;
  estimatedTime?: string;
  description: string;
  sampleImageUrl?: string;
}): Promise<string | null> => {
  try {
    console.log('Creating new quote:', quoteData);
    
    // Ensure price is always stored as a string
    const price = typeof quoteData.price === 'string' ? quoteData.price : String(quoteData.price);
    
    // We need to use "as any" to bypass TypeScript's type checking
    const { data, error } = await supabase
      .from('quotes' as any)
      .insert({
        request_id: quoteData.requestId,
        professional_id: quoteData.professionalId,
        price: price, // Store as string
        estimated_time: quoteData.estimatedTime || null,
        description: quoteData.description,
        sample_image_url: quoteData.sampleImageUrl || null,
        status: 'pending',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select('id')
      .single();
      
    if (error) {
      console.error('Error creating quote:', error);
      throw error;
    }
    
    console.log('Quote created successfully:', data);
    // Fix: Add type assertion to ensure data.id is a string
    return data && 'id' in data ? String(data.id) : null;
  } catch (error) {
    console.error('Error creating quote:', error);
    return null;
  }
};

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

// Count quotes for a request
export const countQuotesForRequest = async (requestId: string): Promise<number> => {
  try {
    // We need to use "as any" to bypass TypeScript's type checking
    const { count, error } = await supabase
      .from('quotes' as any)
      .select('*', { count: 'exact', head: true })
      .eq('request_id', requestId);
      
    if (error) {
      console.error('Error counting quotes:', error);
      return 0;
    }
    
    return count || 0;
  } catch (error) {
    console.error('Error counting quotes:', error);
    return 0;
  }
};
