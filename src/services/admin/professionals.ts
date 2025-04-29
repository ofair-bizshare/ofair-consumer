
import { supabase } from '@/integrations/supabase/client';
import { ProfessionalInterface } from '@/services/professionals/types';
import { getProfessionalFromData } from '../professionals/professionalUtils';

/**
 * Creates a new professional
 * @param professional Professional data
 * @returns Promise<ProfessionalInterface | null> The created professional or null if failed
 */
export const createProfessional = async (professional: Omit<ProfessionalInterface, 'id' | 'reviewCount' | 'verified'>): Promise<ProfessionalInterface | null> => {
  try {
    console.log('Creating professional:', professional);
    
    // Prepare the data for insertion
    const professionalData = {
      name: professional.name,
      profession: professional.profession,
      location: professional.location,
      city: professional.city || professional.location,  // Use location as city if not provided
      specialty: professional.specialty || (professional.specialties && professional.specialties.length > 0 ? professional.specialties[0] : ''),
      specialties: professional.specialties,
      phone_number: professional.phoneNumber || professional.phone_number || professional.phone,
      about: professional.about || professional.bio,
      rating: professional.rating || 0,
      image: professional.image || professional.image_url || 'https://via.placeholder.com/150',
      company_name: professional.company_name,
      work_hours: professional.work_hours || professional.working_hours,
      certifications: professional.certifications,
      experience_years: professional.experience_years,
      // Add compatibility fields
      review_count: professional.reviews_count || 0,
      areas: professional.area || professional.areas || professional.location || '' // Use location as areas if not provided
    };
    
    const { data, error } = await supabase.from('professionals').insert(professionalData).select();
    
    if (error) {
      console.error('Error creating professional:', error);
      throw error;
    }
    
    if (!data || data.length === 0) {
      console.error('No data returned from professional creation');
      throw new Error('No data returned from professional creation');
    }
    
    console.log('Professional created successfully:', data[0]);
    
    // Use the utility function to transform the data
    return getProfessionalFromData(data[0]);
  } catch (error) {
    console.error('Error creating professional:', error);
    throw error;
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
 * @returns Promise<ProfessionalInterface | null> The updated professional data or null on error
 */
export const updateProfessional = async (id: string, professional: Partial<Omit<ProfessionalInterface, 'id' | 'reviewCount' | 'verified'>>): Promise<ProfessionalInterface | null> => {
  try {
    console.log(`Updating professional ${id}:`, professional);
    
    // Create an object with only the fields we want to update
    const updateData: any = {};
    
    // Only include fields that are defined
    if (professional.name) updateData.name = professional.name;
    if (professional.profession) updateData.profession = professional.profession;
    if (professional.location) {
      updateData.location = professional.location;
      // Also update city with location if not explicitly provided
      if (!professional.city) updateData.city = professional.location;
    }
    if (professional.specialties) {
      updateData.specialties = professional.specialties;
      // Also update specialty with first specialty if not explicitly provided
      if (!professional.specialty && professional.specialties.length > 0) {
        updateData.specialty = professional.specialties[0];
      }
    }
    if (professional.phoneNumber || professional.phone_number || professional.phone) {
      updateData.phone_number = professional.phoneNumber || professional.phone_number || professional.phone;
    }
    if (professional.about || professional.bio) updateData.about = professional.about || professional.bio;
    if (professional.rating !== undefined) updateData.rating = professional.rating;
    if (professional.image || professional.image_url) updateData.image = professional.image || professional.image_url;
    if (professional.company_name !== undefined) updateData.company_name = professional.company_name;
    if (professional.work_hours !== undefined || professional.working_hours !== undefined) {
      updateData.work_hours = professional.work_hours || professional.working_hours;
      updateData.working_hours = professional.work_hours || professional.working_hours;
    }
    if (professional.certifications !== undefined) updateData.certifications = professional.certifications;
    if (professional.experience_years !== undefined) updateData.experience_years = professional.experience_years;
    if (professional.city) updateData.city = professional.city;
    if (professional.specialty) updateData.specialty = professional.specialty;
    if (professional.area || professional.areas) updateData.areas = professional.area || professional.areas;
    
    // Add updated_at timestamp
    updateData.updated_at = new Date().toISOString();
    
    const { data, error } = await supabase
      .from('professionals')
      .update(updateData)
      .eq('id', id)
      .select();
    
    if (error) {
      console.error('Error updating professional:', error);
      throw error;
    }
    
    if (!data || data.length === 0) {
      console.error('No data returned from professional update');
      return null;
    }
    
    console.log('Professional updated successfully:', data[0]);
    
    // Use the utility function to transform the data
    return getProfessionalFromData(data[0]);
  } catch (error) {
    console.error('Error updating professional:', error);
    throw error;
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

/**
 * Uploads professionals from Excel file
 * @param professionals Array of professional data from Excel
 * @returns Promise<{success: boolean, error?: string}> Result of the upload operation
 */
export const uploadProfessionalsFromExcel = async (
  professionals: Array<{
    name: string;
    profession: string;
    location: string;
    specialties: string;
    phoneNumber: string;
    about: string;
    rating?: number;
    company_name?: string;
    work_hours?: string;
    certifications?: string;
    experience_years?: number;
  }>
): Promise<{success: boolean, error?: string}> => {
  try {
    console.log('Uploading professionals from Excel:', professionals.length);
    
    if (!professionals || professionals.length === 0) {
      return { success: false, error: 'אין נתונים להעלאה' };
    }
    
    // Transform data for the database
    const professionalsToInsert = professionals.map(p => ({
      name: p.name,
      profession: p.profession,
      location: p.location,
      specialties: p.specialties ? p.specialties.split(',').map(s => s.trim()) : [],
      phone_number: p.phoneNumber,
      about: p.about || `בעל מקצוע בתחום ${p.profession}`,
      rating: p.rating || 5.0,
      image: 'https://via.placeholder.com/150',
      company_name: p.company_name || '',
      work_hours: p.work_hours || 'ימים א-ה: 8:00-18:00, יום ו: 8:00-13:00',
      certifications: p.certifications ? p.certifications.split(',').map(c => c.trim()) : ['מוסמך מקצועי'],
      experience_years: p.experience_years || 5
    }));
    
    // Insert all professionals in one batch
    const { error } = await supabase
      .from('professionals')
      .insert(professionalsToInsert);
    
    if (error) {
      console.error('Error uploading professionals:', error);
      return { success: false, error: `שגיאה בהעלאה: ${error.message}` };
    }
    
    console.log('Professionals uploaded successfully:', professionalsToInsert.length);
    return { success: true };
  } catch (error) {
    console.error('Error uploading professionals from Excel:', error);
    return { success: false, error: 'שגיאה כללית בהעלאה' };
  }
};
