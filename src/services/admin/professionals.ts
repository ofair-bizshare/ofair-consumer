
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';
import { formatError } from '@/utils/errorUtils';
import { ProfessionalInterface } from '@/services/professionals/types';
import { getProfessionalFromData } from '../professionals/professionalUtils';
import { createBucketIfNotExists, findBucketByName } from './utils/storageUtils';

/**
 * Creates a new professional
 * @param {object} professionalData - Professional data
 * @returns {Promise<ProfessionalInterface | null>} - Created professional
 */
export const createProfessional = async (professionalData: any): Promise<ProfessionalInterface | null> => {
  try {
    console.log('Creating professional with data:', professionalData);
    
    // Prepare data for insert
    const professionalToInsert = {
      ...professionalData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      review_count: 0,
      is_verified: false,
      status: 'active',
    };
    
    // Insert the professional
    const { data, error } = await supabase
      .from('professionals')
      .insert(professionalToInsert)
      .select()
      .single();
      
    if (error) {
      console.error('Error creating professional:', error);
      throw error;
    }
    
    console.log('Professional created successfully:', data);
    return getProfessionalFromData(data);
  } catch (error) {
    console.error('Error in createProfessional:', error);
    throw new Error(formatError(error, 'Failed to create professional'));
  }
};

/**
 * Updates a professional
 * @param {string} id - Professional ID
 * @param {object} professionalData - Professional data to update
 * @returns {Promise<ProfessionalInterface | null>} - Updated professional
 */
export const updateProfessional = async (id: string, professionalData: any): Promise<ProfessionalInterface | null> => {
  try {
    console.log(`Updating professional ${id} with data:`, professionalData);
    
    // Prepare data for update
    const professionalToUpdate = {
      ...professionalData,
      updated_at: new Date().toISOString(),
    };
    
    // Update the professional
    const { data, error } = await supabase
      .from('professionals')
      .update(professionalToUpdate)
      .eq('id', id)
      .select()
      .single();
      
    if (error) {
      console.error('Error updating professional:', error);
      throw error;
    }
    
    console.log('Professional updated successfully:', data);
    return getProfessionalFromData(data);
  } catch (error) {
    console.error('Error in updateProfessional:', error);
    throw new Error(formatError(error, 'Failed to update professional'));
  }
};

/**
 * Deletes a professional
 * @param {string} id - Professional ID
 * @returns {Promise<boolean>} - Whether deletion was successful
 */
export const deleteProfessional = async (id: string): Promise<boolean> => {
  try {
    console.log(`Deleting professional ${id}`);
    
    const { error } = await supabase
      .from('professionals')
      .delete()
      .eq('id', id);
      
    if (error) {
      console.error('Error deleting professional:', error);
      throw error;
    }
    
    console.log('Professional deleted successfully');
    return true;
  } catch (error) {
    console.error('Error in deleteProfessional:', error);
    throw new Error(formatError(error, 'Failed to delete professional'));
  }
};

/**
 * Uploads a professional image and returns the URL
 * @param {File} imageFile - Image file to upload
 * @returns {Promise<string>} - URL of the uploaded image
 */
export const uploadProfessionalImage = async (imageFile: File): Promise<string> => {
  try {
    console.log('Uploading professional image', imageFile.name);
    
    // First ensure the bucket exists
    await createBucketIfNotExists('professionals', true);
    
    // Generate a unique file name to avoid conflicts
    const fileExt = imageFile.name.split('.').pop();
    const fileName = `${uuidv4()}.${fileExt}`;
    const filePath = `profile/${fileName}`;
    
    // Try to find the bucket with case-insensitive matching
    const bucketName = await findBucketByName('professionals') || 'professionals';
    console.log(`Using bucket: ${bucketName} for professional image upload`);
    
    // Upload the file
    const { error: uploadError, data } = await supabase.storage
      .from(bucketName)
      .upload(filePath, imageFile, {
        cacheControl: '3600',
        upsert: true,
      });
      
    if (uploadError) {
      console.error('Error uploading image:', uploadError);
      throw uploadError;
    }
    
    // Get the public URL
    const { data: urlData } = supabase.storage
      .from(bucketName)
      .getPublicUrl(filePath);
      
    console.log('Image uploaded successfully:', urlData.publicUrl);
    return urlData.publicUrl;
  } catch (error) {
    console.error('Error in uploadProfessionalImage:', error);
    throw new Error(formatError(error, 'Failed to upload image'));
  }
};
