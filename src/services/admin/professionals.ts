
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
      image: professional.image || 'https://via.placeholder.com/150',
      company_name: professional.company_name,
      work_hours: professional.work_hours,
      certifications: professional.certifications,
      experience_years: professional.experience_years
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
    
    // Try uploading to the professionals bucket
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('professionals')
      .upload(`images/${fileName}`, file, {
        cacheControl: '3600',
        upsert: false
      });
      
    if (uploadError) {
      console.error(`Error uploading to professionals bucket:`, uploadError);
      
      // Try uploading to the images bucket as fallback
      const { data: fallbackData, error: fallbackError } = await supabase.storage
        .from('images')
        .upload(`professionals/${fileName}`, file, {
          cacheControl: '3600',
          upsert: false
        });
        
      if (fallbackError) {
        console.error(`Error uploading to images bucket:`, fallbackError);
        return 'https://via.placeholder.com/150';
      }
      
      const { data: fallbackUrl } = supabase.storage
        .from('images')
        .getPublicUrl(`professionals/${fileName}`);
      
      return fallbackUrl.publicUrl;
    }
    
    // Get public URL from professionals bucket
    const { data: publicURL } = supabase.storage
      .from('professionals')
      .getPublicUrl(`images/${fileName}`);
    
    return publicURL.publicUrl;
  } catch (error) {
    console.error('Error uploading professional image:', error);
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
