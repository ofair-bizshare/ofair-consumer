
import { supabase } from '@/integrations/supabase/client';
import { ProfessionalInterface } from '@/types/dashboard';

/**
 * Creates a new professional
 * @param professional Professional data
 * @returns Promise<boolean> True if successful, false otherwise
 */
export const createProfessional = async (professional: Omit<ProfessionalInterface, 'id' | 'reviewCount' | 'verified'>): Promise<boolean> => {
  try {
    const { data, error } = await supabase.from('professionals').insert({
      name: professional.name,
      profession: professional.profession,
      location: professional.location,
      specialties: professional.specialties,
      phone_number: professional.phoneNumber,
      about: professional.about,
      rating: professional.rating,
      image: professional.image
    });
    
    if (error) {
      console.error('Error creating professional:', error);
      return false;
    }
    
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
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
    const filePath = `professionals/${fileName}`;
    
    const { data, error } = await supabase.storage
      .from('public')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });
    
    if (error) {
      console.error('Error uploading image:', error);
      return null;
    }
    
    const { data: { publicUrl } } = supabase.storage
      .from('public')
      .getPublicUrl(filePath);
    
    return publicUrl;
  } catch (error) {
    console.error('Error uploading image:', error);
    return null;
  }
};
