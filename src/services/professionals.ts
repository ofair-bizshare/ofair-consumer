
import { supabase } from '@/integrations/supabase/client';
import { ProfessionalInterface } from '@/types/dashboard';

// Fetch all professionals from the database
export const fetchProfessionals = async (): Promise<ProfessionalInterface[]> => {
  try {
    const { data, error } = await supabase
      .from('professionals')
      .select('*')
      .order('rating', { ascending: false });
      
    if (error) {
      console.error('Error fetching professionals:', error);
      throw error;
    }
    
    if (!data || data.length === 0) {
      console.log('No professionals found in the database');
      return [];
    }
    
    // Map the database columns to our interface
    return data.map(item => ({
      id: item.id,
      name: item.name,
      profession: item.profession,
      rating: item.rating || 0,
      reviewCount: item.review_count || 0,
      location: item.location,
      image: item.image,
      specialties: item.specialties || [],
      phoneNumber: item.phone_number,
      about: item.about || ''
    }));
  } catch (error) {
    console.error('Error fetching professionals:', error);
    return [];
  }
};

// Get a professional by ID
export const getProfessionalById = async (id: string): Promise<ProfessionalInterface | null> => {
  try {
    if (!id) {
      console.error('No professional ID provided');
      return null;
    }
    
    console.log(`Fetching professional with ID: ${id}`);
    
    const { data, error } = await supabase
      .from('professionals')
      .select('*')
      .eq('id', id)
      .maybeSingle();
      
    if (error) {
      console.error('Error fetching professional by ID:', error);
      return null;
    }
    
    if (!data) {
      console.log(`Professional with ID ${id} not found in database`);
      return null;
    }
    
    return {
      id: data.id,
      name: data.name,
      profession: data.profession,
      rating: data.rating || 0,
      reviewCount: data.review_count || 0,
      location: data.location,
      image: data.image,
      specialties: data.specialties || [],
      phoneNumber: data.phone_number,
      about: data.about || ''
    };
  } catch (error) {
    console.error('Error fetching professional by ID:', error);
    return null;
  }
};

// Seed professionals if the database is empty
export const seedProfessionals = async () => {
  try {
    console.log('Calling seed-professionals function...');
    // Call the edge function to seed professionals
    const { data, error } = await supabase.functions.invoke('seed-professionals');
    
    if (error) {
      console.error('Error from seed-professionals function:', error);
      throw error;
    }
    
    console.log('Seed professionals result:', data);
    return data;
  } catch (error) {
    console.error('Error seeding professionals:', error);
    throw error;
  }
};
