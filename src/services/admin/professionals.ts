
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
    const filePath = `professionals/${fileName}`;
    
    // Try to upload to images bucket first
    try {
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });
        
      if (uploadError) {
        console.error('Error uploading to images bucket:', uploadError);
        throw uploadError;
      }
      
      const { data: publicURL } = supabase.storage
        .from('images')
        .getPublicUrl(filePath);
      
      console.log('Successfully uploaded to images bucket:', publicURL.publicUrl);
      return publicURL.publicUrl;
    } catch (imagesError) {
      console.error('Failed to upload to images bucket, trying public bucket:', imagesError);
      
      // Fallback to public bucket
      const { data: fallbackData, error: fallbackError } = await supabase.storage
        .from('public')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });
        
      if (fallbackError) {
        console.error('Error uploading to public bucket:', fallbackError);
        throw fallbackError;
      }
      
      const { data: fallbackURL } = supabase.storage
        .from('public')
        .getPublicUrl(filePath);
      
      console.log('Successfully uploaded to public bucket:', fallbackURL.publicUrl);
      return fallbackURL.publicUrl;
    }
  } catch (error) {
    console.error('Error uploading professional image:', error);
    // Return a placeholder image URL as fallback
    return 'https://via.placeholder.com/150';
  }
};
