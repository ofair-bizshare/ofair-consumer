
import { supabase } from '@/integrations/supabase/client';

/**
 * Create or update a professional profile
 * @param professionalData The professional data to create or update
 * @returns Promise<any> The created/updated professional or error
 */
export const createOrUpdateProfessional = async (professionalData: any): Promise<any> => {
  try {
    console.log('Creating professional:', professionalData);
    
    // If a professional image is provided as a file, upload it first
    if (professionalData.imageFile) {
      try {
        const file = professionalData.imageFile;
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `professionals/${fileName}`;
        
        // Check if professionals bucket exists
        const { data: bucketData, error: bucketError } = await supabase.storage
          .getBucket('professionals');
          
        if (bucketError && bucketError.message.includes('The resource was not found')) {
          console.log('Creating professionals bucket...');
          const { error: createBucketError } = await supabase.storage
            .createBucket('professionals', { public: true });
            
          if (createBucketError) throw createBucketError;
        }
        
        // Upload the file
        const { error: uploadError } = await supabase.storage
          .from('professionals')
          .upload(filePath, file);
          
        if (uploadError) throw uploadError;
        
        // Get the URL
        const { data: publicURL } = supabase.storage
          .from('professionals')
          .getPublicUrl(filePath);
          
        if (!publicURL) throw new Error('Failed to get public URL');
        
        // Set the URL in the professional data
        professionalData.image = publicURL.publicUrl;
      } catch (uploadError) {
        console.error('Error uploading professional image:', uploadError);
        throw uploadError;
      }
    }
    
    // Remove the imageFile property as it's not needed in the database
    const { imageFile, ...dataForDb } = professionalData;
    
    // Ensure all required fields are present
    const requiredFields = ['name', 'profession', 'location'];
    const missingFields = requiredFields.filter(field => !dataForDb[field]);
    
    if (missingFields.length > 0) {
      throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
    }
    
    // Ensure specialties is an array
    if (dataForDb.specialties && typeof dataForDb.specialties === 'string') {
      dataForDb.specialties = dataForDb.specialties.split(',').map((s: string) => s.trim());
    }
    
    // Ensure certifications is an array
    if (dataForDb.certifications && typeof dataForDb.certifications === 'string') {
      dataForDb.certifications = dataForDb.certifications.split(',').map((c: string) => c.trim());
    }

    // Update or insert the professional
    const { data, error } = await supabase
      .from('professionals')
      .upsert([dataForDb], { 
        onConflict: 'id',
        ignoreDuplicates: false
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error creating professional:', error);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Error creating professional:', error);
    throw error;
  }
};

/**
 * Get professional by ID
 * @param id Professional ID to fetch
 * @returns Promise with the professional data
 */
export const getProfessionalById = async (id: string): Promise<any> => {
  try {
    const { data, error } = await supabase
      .from('professionals')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Error fetching professional:', error);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Error in getProfessionalById:', error);
    throw error;
  }
};

/**
 * Delete professional by ID
 * @param id Professional ID to delete
 * @returns Promise<boolean> True if successful, false otherwise
 */
export const deleteProfessionalById = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('professionals')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting professional:', error);
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error('Error in deleteProfessionalById:', error);
    return false;
  }
};

/**
 * Update professional status 
 * @param id Professional ID to update
 * @param status New status value
 * @returns Promise<boolean> True if successful, false otherwise
 */
export const updateProfessionalStatus = async (id: string, status: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('professionals')
      .update({ status })
      .eq('id', id);
    
    if (error) {
      console.error('Error updating professional status:', error);
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error('Error in updateProfessionalStatus:', error);
    return false;
  }
};

/**
 * Get all professionals
 * @returns Promise with array of professionals
 */
export const getAllProfessionals = async (): Promise<any[]> => {
  try {
    const { data, error } = await supabase
      .from('professionals')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching professionals:', error);
      throw error;
    }
    
    return data || [];
  } catch (error) {
    console.error('Error in getAllProfessionals:', error);
    throw error;
  }
};
