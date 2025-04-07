
import { supabase } from '@/integrations/supabase/client';
import { ProfessionalInterface } from './types';
import { getProfessionalFromData } from './professionalUtils';

/**
 * Gets all professionals
 */
export const getProfessionals = async (): Promise<ProfessionalInterface[]> => {
  try {
    const { data, error } = await supabase
      .from('professionals')
      .select('*');

    if (error) {
      console.error('Error fetching professionals:', error);
      return [];
    }

    return data.map(professional => getProfessionalFromData(professional));
  } catch (error) {
    console.error('Error getting professionals:', error);
    return [];
  }
};

// Add alias for compatibility with existing code
export const fetchProfessionals = getProfessionals;
