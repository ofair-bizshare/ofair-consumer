
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';
import { formatError } from '@/utils/errorUtils';
import { ProfessionalInterface } from '@/services/professionals/types';
import { getProfessionalFromData } from '../professionals/professionalUtils';
import { createBucketIfNotExists, findBucketByName } from './utils/storageUtils';
import { getBucketName } from './utils/bucketNameUtils';

/**
 * Creates a new professional
 * @param {object} professionalData - Professional data
 * @returns {Promise<ProfessionalInterface | null>} - Created professional
 */
export const createProfessional = async (professionalData: any): Promise<ProfessionalInterface | null> => {
  try {
    console.log('Creating professional with data:', professionalData);
    
    // Ensure image field is properly set
    // If image_url exists but image doesn't, copy the value
    if (professionalData.image_url && !professionalData.image) {
      professionalData.image = professionalData.image_url;
    }
    // If image exists but image_url doesn't, copy the value
    if (professionalData.image && !professionalData.image_url) {
      professionalData.image_url = professionalData.image;
    }
    
    // Prepare data for insert
    const professionalToInsert = {
      ...professionalData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      review_count: 0,  // Changed from reviews_count to review_count
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
    
    // Ensure image field is properly set
    if (professionalData.image_url && !professionalData.image) {
      professionalData.image = professionalData.image_url;
    }
    if (professionalData.image && !professionalData.image_url) {
      professionalData.image_url = professionalData.image;
    }
    
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
    
    const bucketKey = 'professionals';
    
    // First ensure the bucket exists
    const bucketCreated = await createBucketIfNotExists(bucketKey, true);
    console.log('Bucket creation status:', bucketCreated);
    
    // Generate a unique file name to avoid conflicts
    const fileExt = imageFile.name.split('.').pop();
    const fileName = `${uuidv4()}.${fileExt}`;
    const filePath = `profile/${fileName}`;
    
    // Get the actual bucket name (handles different naming conventions)
    const bucketName = await findBucketByName(bucketKey) || getBucketName(bucketKey);
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

/**
 * Upload professionals from Excel file data
 * @param {Array} professionals - Array of professional objects from Excel
 * @returns {Promise<{success: boolean, created: number, errors: number, error?: string}>} - Result of the operation
 */
export const uploadProfessionalsFromExcel = async (professionals: any[]): Promise<{
  success: boolean;
  created: number;
  errors: number;
  error?: string;
}> => {
  try {
    console.log(`Processing ${professionals.length} professionals from Excel`);
    
    if (!professionals || professionals.length === 0) {
      return {
        success: false,
        created: 0,
        errors: 0,
        error: 'No professionals data found in Excel file'
      };
    }
    
    let created = 0;
    let errors = 0;
    
    // Process each professional
    for (const professional of professionals) {
      try {
        // Prepare the professional data with required fields
        const professionalData = {
          name: professional.name,
          profession: professional.profession,
          location: professional.location,
          city: professional.location, // Set city to location for consistency
          phoneNumber: professional.phoneNumber,
          phone_number: professional.phoneNumber, // Add both field names for compatibility
          about: professional.about || '',
          specialties: professional.specialties ? 
            (typeof professional.specialties === 'string' ? 
              professional.specialties.split(',').map((s: string) => s.trim()) : 
              [professional.specialties]) : 
            [],
          specialty: professional.specialties ? 
            (typeof professional.specialties === 'string' ? 
              professional.specialties.split(',')[0].trim() : 
              professional.specialties) : 
            '',
          rating: professional.rating || 4.0,
          image: professional.image || 'https://via.placeholder.com/150',
          image_url: professional.image || 'https://via.placeholder.com/150',
          company_name: professional.company_name || '',
          work_hours: professional.work_hours || '',
          certifications: professional.certifications ? 
            (typeof professional.certifications === 'string' ? 
              professional.certifications.split(',').map((s: string) => s.trim()) : 
              [professional.certifications]) : 
            [],
          experience_years: professional.experience_years || 0,
          review_count: 0, // Changed from reviews_count to review_count
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          status: 'active',
          is_verified: false
        };
        
        // Create the professional
        await createProfessional(professionalData);
        created++;
      } catch (error) {
        console.error(`Error creating professional from Excel: ${professional.name}`, error);
        errors++;
      }
    }
    
    console.log(`Upload complete. Created: ${created}, Errors: ${errors}`);
    
    return {
      success: created > 0,
      created,
      errors,
      error: errors > 0 ? `${errors} professionals failed to import` : undefined
    };
  } catch (error) {
    console.error('Error in uploadProfessionalsFromExcel:', error);
    return {
      success: false,
      created: 0,
      errors: professionals?.length || 0,
      error: formatError(error, 'Failed to upload professionals from Excel')
    };
  }
};
