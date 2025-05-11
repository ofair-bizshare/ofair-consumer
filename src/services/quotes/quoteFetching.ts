
import { supabase } from '@/integrations/supabase/client';
import { QuoteInterface, QuoteStatus } from '@/types/dashboard';

/**
 * Count quotes for a specific request
 */
export const countQuotesForRequest = async (requestId: string): Promise<number> => {
  try {
    console.log("Counting quotes for request:", requestId);
    
    const { count, error } = await supabase
      .from('quotes')
      .select('*', { count: 'exact', head: true })
      .eq('request_id', requestId);
    
    if (error) {
      console.error("Error counting quotes:", error);
      return 0;
    }
    
    return count || 0;
  } catch (error) {
    console.error("Error in countQuotesForRequest:", error);
    return 0;
  }
};

/**
 * Fetches all quotes for a specific request
 */
export const fetchQuotesForRequest = async (requestId: string): Promise<QuoteInterface[]> => {
  try {
    console.log("Fetching quotes for request:", requestId);
    
    // Fetch quotes for the request, including professional info
    const { data: quotes, error } = await supabase
      .from('quotes')
      .select(`
        id,
        price,
        description,
        estimated_time,
        sample_image_url,
        status,
        created_at,
        request_id,
        professional_id,
        professionals (
          id, 
          name, 
          phone_number,
          profession,
          image_url,
          rating,
          review_count,
          is_verified,
          company_name
        )
      `)
      .eq('request_id', requestId);
    
    if (error) {
      console.error("Error fetching quotes:", error);
      return [];
    }
    
    console.log(`Found ${quotes?.length || 0} quotes for request ${requestId}`);
    
    if (!quotes || quotes.length === 0) {
      return [];
    }

    // Check for any accepted quotes in accepted_quotes table
    const { data: acceptedQuotes, error: acceptedQuotesError } = await supabase
      .from('accepted_quotes')
      .select('*')
      .eq('request_id', requestId);
    
    if (acceptedQuotesError) {
      console.error("Error checking accepted quotes:", acceptedQuotesError);
    }
    
    if (acceptedQuotes && acceptedQuotes.length > 0) {
      console.log("This quote is already accepted in the database:", acceptedQuotes[0]);
    }
    
    // Map database results to QuoteInterface
    const formattedQuotes = quotes.map(quote => {
      const professional = quote.professionals;
      
      return {
        id: quote.id,
        price: quote.price,
        description: quote.description,
        estimatedTime: quote.estimated_time || '',
        sampleImageUrl: quote.sample_image_url,
        status: quote.status as QuoteStatus, // Cast to correct type
        createdAt: quote.created_at,
        requestId: quote.request_id,
        professional: {
          id: professional.id,
          name: professional.name,
          phoneNumber: professional.phone_number,
          profession: professional.profession,
          image: professional.image_url,
          image_url: professional.image_url,
          rating: professional.rating,
          reviewCount: professional.review_count,
          is_verified: professional.is_verified,
          verified: professional.is_verified,
          company_name: professional.company_name || '',
        }
      };
    }) as QuoteInterface[]; // Cast the entire array to ensure type safety
    
    return formattedQuotes;
  } catch (error) {
    console.error("Error in fetchQuotesForRequest:", error);
    return [];
  }
};

/**
 * Format price to ensure it's in the correct format
 */
export const formatQuotePrice = (price: string | number): string => {
  if (typeof price === 'number') {
    return price.toString();
  }
  
  // Handle different price formats
  if (!price || price === "" || price === "0") {
    return "0";
  }
  
  // Clean the price string
  let cleanPrice = price
    .toString()
    .replace(/[^\d.,]/g, '') // Remove non-digit characters except . and ,
    .replace(/,/g, '.');     // Replace commas with dots
  
  // Handle multiple decimal points
  const parts = cleanPrice.split('.');
  if (parts.length > 2) {
    cleanPrice = parts[0] + '.' + parts.slice(1).join('');
  }
  
  return cleanPrice;
};
