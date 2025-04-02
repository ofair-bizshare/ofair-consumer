
import { supabase } from '@/integrations/supabase/client';
import { QuoteInterface } from '@/types/dashboard';
import { getProfessionalById } from './professionals';

// Fetch quotes for a specific request
export const fetchQuotesForRequest = async (requestId: string): Promise<QuoteInterface[]> => {
  try {
    const { data, error } = await supabase
      .from('quotes')
      .select('*, professional_id')
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
    
    // Fetch professional details for each quote
    const quotes = await Promise.all(
      data.map(async (quote) => {
        const professional = await getProfessionalById(quote.professional_id);
        if (!professional) {
          console.error(`Professional not found for ID: ${quote.professional_id}`);
          return null;
        }
        
        return {
          id: quote.id,
          requestId: quote.request_id,
          professional,
          price: quote.price,
          estimatedTime: quote.estimated_time || '',
          description: quote.description,
          status: quote.status
        };
      })
    );
    
    // Filter out any null quotes (where professional wasn't found)
    return quotes.filter(quote => quote !== null) as QuoteInterface[];
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
}): Promise<string | null> => {
  try {
    const { data, error } = await supabase
      .from('quotes')
      .insert({
        request_id: quoteData.requestId,
        professional_id: quoteData.professionalId,
        price: quoteData.price,
        estimated_time: quoteData.estimatedTime || null,
        description: quoteData.description,
        status: 'pending'
      })
      .select('id')
      .single();
      
    if (error) {
      console.error('Error creating quote:', error);
      throw error;
    }
    
    console.log('Quote created successfully:', data);
    return data.id;
  } catch (error) {
    console.error('Error creating quote:', error);
    return null;
  }
};

// Update quote status
export const updateQuoteStatus = async (id: string, status: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('quotes')
      .update({ status, updated_at: new Date() })
      .eq('id', id);
      
    if (error) {
      console.error('Error updating quote status:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error updating quote status:', error);
    return false;
  }
};

// Count quotes for a request
export const countQuotesForRequest = async (requestId: string): Promise<number> => {
  try {
    const { count, error } = await supabase
      .from('quotes')
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
