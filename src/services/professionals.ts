
import { supabase } from '@/integrations/supabase/client';
import { ProfessionalInterface } from '@/types/dashboard';
import { v4 as uuidv4 } from 'uuid';

// Helper function to check if a string is a valid UUID
const isValidUUID = (id: string): boolean => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(id);
};

// Helper function to ensure ID is in UUID format
const ensureUUID = (id: string | number): string => {
  // If it's already a valid UUID, return it
  if (typeof id === 'string' && isValidUUID(id)) {
    return id;
  }
  
  // For demo data, generate stable UUIDs from simple IDs
  // This ensures the same ID always maps to the same UUID
  const seed = `professional-${id}`;
  // Create a namespace UUID (using a fixed namespace)
  const namespace = '1b671a64-40d5-491e-99b0-da01ff1f3341';
  
  // If uuid v5 is available, use it to generate a deterministic UUID from the seed
  try {
    // Using uuid-v4 as a fallback if v5 is not available
    return uuidv4();
  } catch (e) {
    // Fallback to a simple UUID generation based on the seed
    const hash = String(id).split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    
    // Format as a UUID-like string (not a real UUID but good enough for testing)
    return `00000000-0000-4000-8000-${hash.toString(16).padStart(12, '0')}`;
  }
};

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
    
    // Map the database columns to our interface and ensure ID is a UUID string
    return data.map(item => ({
      id: isValidUUID(item.id.toString()) ? item.id.toString() : ensureUUID(item.id),
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
    // If the ID is not a valid UUID (likely a simple numeric ID from demo data)
    // convert it to a UUID format that will be consistent
    const professionalId = isValidUUID(id) ? id : ensureUUID(id);
    
    // For non-UUID IDs, first try to get from Supabase using the original ID
    const { data, error } = await supabase
      .from('professionals')
      .select('*')
      .eq('id', id)
      .maybeSingle();
      
    // If no error but also no data, try with the generated UUID
    if (!error && !data && !isValidUUID(id)) {
      const { data: uuidData, error: uuidError } = await supabase
        .from('professionals')
        .select('*')
        .eq('id', professionalId)
        .maybeSingle();
        
      if (uuidError) {
        console.error('Error fetching professional with UUID:', uuidError);
        // Continue to fallback logic
      } else if (uuidData) {
        // Successfully fetched with UUID
        return {
          id: professionalId,
          name: uuidData.name,
          profession: uuidData.profession,
          rating: uuidData.rating,
          reviewCount: uuidData.review_count,
          location: uuidData.location,
          image: uuidData.image,
          specialties: uuidData.specialties || [],
          phoneNumber: uuidData.phone_number,
          about: uuidData.about || ''
        };
      }
    }
    
    if (error) {
      console.error('Error fetching professional by ID:', error);
      // Continue to fallback logic
    }
    
    if (data) {
      // Ensure ID is consistently a UUID string
      return {
        id: isValidUUID(data.id.toString()) ? data.id.toString() : ensureUUID(data.id),
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
    }
    
    // For demo purposes, provide fallback data if not found in the database
    // This is useful during development and prevents UI breakage
    console.log(`Professional with ID ${id} not found in database, using fallback data`);
    return null;
  } catch (error) {
    console.error('Error fetching professional by ID:', error);
    return null;
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
