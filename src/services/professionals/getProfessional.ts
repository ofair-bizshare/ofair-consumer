
import { supabase } from '@/integrations/supabase/client';
import { ProfessionalInterface } from './types';
import { getProfessionalFromData } from './professionalUtils';

/**
 * Gets a professional by ID
 * @param id Professional ID
 */
export const getProfessional = async (id: string): Promise<ProfessionalInterface | null> => {
  try {
    const { data, error } = await supabase
      .from('professionals')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching professional:', error);
      return null;
    }

    return getProfessionalFromData(data);
  } catch (error) {
    console.error('Error getting professional:', error);
    return null;
  }
};

// Add alias for compatibility with existing code
export const getProfessionalById = getProfessional;
