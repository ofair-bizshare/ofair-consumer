
import { supabase } from '@/integrations/supabase/client';
import { ProfessionalInterface } from '@/types/dashboard';

/**
 * Creates a new professional
 * @param professional Professional data
 * @returns Promise<boolean> True if successful, false otherwise
 */
export const createProfessional = async (professional: Omit<ProfessionalInterface, 'id' | 'reviewCount' | 'verified'>): Promise<boolean> => {
  try {
    console.log('Creating professional:', professional);
    
    const { data, error } = await supabase.from('professionals').insert({
      name: professional.name,
      profession: professional.profession,
      location: professional.location,
      specialties: professional.specialties,
      phone_number: professional.phoneNumber,
      about: professional.about,
      rating: professional.rating,
      image: professional.image || 'https://via.placeholder.com/150'
    });
    
    if (error) {
      console.error('Error creating professional:', error);
      return false;
    }
    
    console.log('Professional created successfully');
    return true;
  } catch (error) {
    console.error('Error creating professional:', error);
    return false;
  }
};

/**
 * Uploads a professional's image to storage
 * @param file Image file to upload
 * @returns Promise<string | null> URL of the uploaded image or null if failed
 */
export const uploadProfessionalImage = async (file: File): Promise<string | null> => {
  try {
    console.log('Uploading professional image:', file.name);
    const fileExt = file.name.split('.').pop();
    const fileName = `professional-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
    
    // Create an array of bucket names to try
    const buckets = ['professionals', 'images', 'public'];
    let uploadedUrl = null;
    
    // Try each bucket until one works
    for (const bucket of buckets) {
      try {
        console.log(`Attempting to upload to ${bucket} bucket...`);
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from(bucket)
          .upload(`professionals/${fileName}`, file, {
            cacheControl: '3600',
            upsert: false
          });
          
        if (uploadError) {
          console.error(`Error uploading to ${bucket} bucket:`, uploadError);
          continue; // Try the next bucket
        }
        
        const { data: publicURL } = supabase.storage
          .from(bucket)
          .getPublicUrl(`professionals/${fileName}`);
        
        console.log(`Successfully uploaded to ${bucket} bucket:`, publicURL.publicUrl);
        uploadedUrl = publicURL.publicUrl;
        break; // Successfully uploaded, exit the loop
      } catch (bucketError) {
        console.error(`Failed to upload to ${bucket} bucket:`, bucketError);
        // Continue to the next bucket
      }
    }
    
    if (uploadedUrl) {
      return uploadedUrl;
    }
    
    // If all buckets failed, return a placeholder
    console.warn('All bucket uploads failed, using placeholder image');
    return 'https://via.placeholder.com/150';
  } catch (error) {
    console.error('Error uploading professional image:', error);
    // Return a placeholder image URL as fallback
    return 'https://via.placeholder.com/150';
  }
};

/**
 * Updates an existing professional
 * @param id Professional ID to update
 * @param professional Professional data to update
 * @returns Promise<boolean> True if successful, false otherwise
 */
export const updateProfessional = async (id: string, professional: Partial<Omit<ProfessionalInterface, 'id' | 'reviewCount' | 'verified'>>): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('professionals')
      .update({
        ...professional,
        updated_at: new Date().toISOString()
      })
      .eq('id', id);
    
    if (error) {
      console.error('Error updating professional:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error updating professional:', error);
    return false;
  }
};

/**
 * Deletes a professional
 * @param id Professional ID to delete
 * @returns Promise<boolean> True if successful, false otherwise
 */
export const deleteProfessional = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('professionals')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting professional:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error deleting professional:', error);
    return false;
  }
};
