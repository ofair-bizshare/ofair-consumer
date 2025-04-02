
import { supabase } from '@/integrations/supabase/client';
import { ProfessionalInterface } from '@/types/dashboard';

export const fetchProfessionals = async (): Promise<ProfessionalInterface[]> => {
  try {
    const { data, error } = await supabase
      .from('professionals')
      .select('*')
      .order('rating', { ascending: false });
      
    if (error) {
      throw error;
    }
    
    if (!data) {
      return [];
    }
    
    // Map the database columns to our interface and ensure ID is a string
    return data.map(item => ({
      id: item.id.toString(),
      name: item.name,
      profession: item.profession,
      rating: item.rating,
      reviewCount: item.review_count,
      location: item.location,
      image: item.image,
      specialties: item.specialties || [],
      phoneNumber: item.phone_number,
      about: item.about || ''
    }));
  } catch (error) {
    console.error('Error fetching professionals:', error);
    throw error;
  }
};

export const getProfessionalById = async (id: string): Promise<ProfessionalInterface | null> => {
  try {
    const { data, error } = await supabase
      .from('professionals')
      .select('*')
      .eq('id', id)
      .maybeSingle();
      
    if (error) {
      throw error;
    }
    
    if (!data) {
      return null;
    }
    
    // Ensure ID is consistently a string
    return {
      id: data.id.toString(),
      name: data.name,
      profession: data.profession,
      rating: data.rating,
      reviewCount: data.review_count,
      location: data.location,
      image: data.image,
      specialties: data.specialties || [],
      phoneNumber: data.phone_number,
      about: data.about || ''
    };
  } catch (error) {
    console.error('Error fetching professional by ID:', error);
    throw error;
  }
};

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
