
import { supabase } from '@/integrations/supabase/client';
import { QuoteInterface } from '@/types/dashboard';

// Fetch quotes for a specific request
export const fetchQuotesForRequest = async (requestId: string): Promise<QuoteInterface[]> => {
  console.log(`Fetching quotes for request: ${requestId}`);
  
  try {
    // Fetch quotes from the database
    const { data, error } = await supabase
      .from('quotes')
      .select(`
        id,
        price,
        description,
        estimated_time,
        sample_image_url,
        status,
        created_at,
        professional_id
      `)
      .eq('request_id', requestId);
    
    if (error) {
      console.error('Error fetching quotes:', error);
      throw error;
    }
    
    if (!data || data.length === 0) {
      console.log('No quotes found for this request');
      return [];
    }
    
    console.log(`Found ${data.length} quotes for request ${requestId}`);
    
    // For each quote, fetch the professional details
    const quotesWithProfessionals = await Promise.all(
      data.map(async (quote) => {
        try {
          // Fetch professional details
          const { data: professionalData, error: professionalError } = await supabase
            .from('professionals')
            .select('*')
            .eq('id', quote.professional_id)
            .single();
          
          if (professionalError) {
            console.error('Error fetching professional:', professionalError);
            // Return a quote with minimal professional info
            return {
              id: quote.id,
              price: quote.price,
              description: quote.description,
              estimatedTime: quote.estimated_time,
              sampleImageUrl: quote.sample_image_url,
              status: quote.status,
              createdAt: quote.created_at,
              requestId,
              professional: {
                id: quote.professional_id,
                name: 'Unknown Professional',
                phoneNumber: '',
                profession: '',
              }
            };
          }
          
          // Return a complete quote with professional details
          return {
            id: quote.id,
            price: quote.price,
            description: quote.description,
            estimatedTime: quote.estimated_time,
            sampleImageUrl: quote.sample_image_url,
            status: quote.status,
            createdAt: quote.created_at,
            requestId,
            professional: {
              id: professionalData.id,
              name: professionalData.name || 'Unknown',
              phoneNumber: professionalData.phone_number || '',
              phone: professionalData.phone_number || '',
              profession: professionalData.profession || '',
              location: professionalData.location || '',
              company_name: professionalData.company_name || '',
              companyName: professionalData.company_name || '',
              image: professionalData.image || '',
              about: professionalData.about || '',
            }
          };
        } catch (err) {
          console.error('Error processing quote:', err);
          // Return a quote with minimal professional info as a fallback
          return {
            id: quote.id,
            price: quote.price,
            description: quote.description,
            estimatedTime: quote.estimated_time,
            sampleImageUrl: quote.sample_image_url,
            status: quote.status,
            createdAt: quote.created_at,
            requestId,
            professional: {
              id: quote.professional_id,
              name: 'Unknown Professional',
              phoneNumber: '',
              profession: '',
            }
          };
        }
      })
    );
    
    return quotesWithProfessionals;
  } catch (error) {
    console.error('Error in fetchQuotesForRequest:', error);
    return [];
  }
};

// Count quotes for a specific request
export const countQuotesForRequest = async (requestId: string): Promise<number> => {
  try {
    const { count, error } = await supabase
      .from('quotes')
      .select('id', { count: 'exact', head: true })
      .eq('request_id', requestId);
    
    if (error) {
      console.error('Error counting quotes:', error);
      return 0;
    }
    
    return count || 0;
  } catch (error) {
    console.error('Error in countQuotesForRequest:', error);
    return 0;
  }
};

// Format price for display and processing
export const formatPrice = (price: string): string => {
  if (!price) return '0';
  
  // Remove any non-numeric characters except decimals
  const numericPrice = price.replace(/[^\d.]/g, '');
  
  // If there's no valid price, return '0'
  if (!numericPrice || isNaN(parseFloat(numericPrice))) {
    return '0';
  }
  
  return numericPrice;
};
