
import { supabase } from '@/integrations/supabase/client';
import { ProfessionalDatabaseRecord } from '@/types/professionals';
import { ProfessionalInterface } from '@/types/dashboard';
import { getRegionByCity } from '@/utils/locationMapping';
import { getProfessionalFromData } from '@/utils/professionalTransformations';

/**
 * Searches for professionals by city, and maps to region internally
 * @param city The city to search for
 * @param category Optional category to filter by
 */
export const searchProfessionalsByCity = async (
  city: string,
  category?: string
): Promise<ProfessionalInterface[]> => {
  try {
    // Get the region for this city
    const region = getRegionByCity(city);
    if (!region) {
      console.warn(`No region found for city: ${city}`);
      return [];
    }

    let query = supabase
      .from('professionals')
      .select('*')
      .eq('region', region);
    
    if (category) {
      // If category is provided, filter by it
      query = query.eq('category', category);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error searching professionals by city:', error);
      return [];
    }

    // Explicitly cast to avoid deep type recursion issues
    const professionals = data as unknown as ProfessionalDatabaseRecord[];
    
    return professionals.map(professional => getProfessionalFromData(professional));
  } catch (error) {
    console.error('Error in searchProfessionalsByCity:', error);
    return [];
  }
};
