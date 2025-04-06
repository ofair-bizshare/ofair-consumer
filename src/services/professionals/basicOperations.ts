
import { supabase } from '@/integrations/supabase/client';
import { ProfessionalDatabaseRecord } from '@/types/professionals';
import { ProfessionalInterface } from '@/types/dashboard';
import { getProfessionalFromData } from '@/utils/professionalTransformations';

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

    // Using a non-generic type to avoid deep recursion issues
    return (data || []).map(professional => {
      // Convert each professional to our defined record type
      const record: ProfessionalDatabaseRecord = professional as ProfessionalDatabaseRecord;
      return getProfessionalFromData(record);
    });
  } catch (error) {
    console.error('Error getting professionals:', error);
    return [];
  }
};

// Add alias for compatibility with existing code
export const fetchProfessionals = getProfessionals;

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

    // Explicitly cast to our database record type to avoid circular reference
    const record: ProfessionalDatabaseRecord = data as ProfessionalDatabaseRecord;
    return getProfessionalFromData(record);
  } catch (error) {
    console.error('Error getting professional:', error);
    return null;
  }
};

// Add alias for compatibility with existing code
export const getProfessionalById = getProfessional;
