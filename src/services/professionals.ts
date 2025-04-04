import { supabase } from '@/integrations/supabase/client';

/**
 * Professionals Service
 */

export interface ProfessionalInterface {
  id: string;
  name: string;
  phone: string;
  email: string;
  bio: string;
  rating: number;
  reviews_count: number;
  image_url: string;
  created_at: string;
  city: string;
  specialty: string;
  verified: boolean;
  area?: string;
  category?: string;
}

/**
 * Gets all professionals
 */
export const getProfessionals = async (): Promise<ProfessionalInterface[]> => {
  try {
    const { data, error } = await supabase
      .from('professionals')
      .select('*');

    if (error) {
      console.error('Error fetching professionals:', error);
      return [];
    }

    return data.map(professional => getProfessionalFromData(professional));
  } catch (error) {
    console.error('Error getting professionals:', error);
    return [];
  }
};

/**
 * Gets a professional by ID
 * @param id Professional ID
 */
export const getProfessional = async (id: string): Promise<ProfessionalInterface | null> => {
  try {
    const { data, error } = await supabase
      .from('professionals')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching professional:', error);
      return null;
    }

    return getProfessionalFromData(data);
  } catch (error) {
    console.error('Error getting professional:', error);
    return null;
  }
};

/**
 * Gets a professional from data
 * @param data Professional data
 */
export const getProfessionalFromData = (data: any): ProfessionalInterface => {
  if (!data) return null;
  
  return {
    id: data.id,
    name: data.name,
    phone: data.phone,
    email: data.email,
    bio: data.bio,
    rating: data.rating || 0,
    reviews_count: data.reviews_count || 0,
    image_url: data.image_url || 'https://via.placeholder.com/150',
    created_at: data.created_at,
    city: data.city || 'לא צוין',
    specialty: data.specialty || 'לא צוין',
    verified: data.verified || false,
    area: data.area,
    category: data.category
  };
};

/**
 * Seeds professionals
 */
export const seedProfessionals = async (): Promise<void> => {
  try {
    // Check if professionals already exist
    const { data, error } = await supabase
      .from('professionals')
      .select('id')
      .limit(1);

    if (error) {
      console.error('Error checking professionals:', error);
      return;
    }

    if (data && data.length > 0) {
      console.log('Professionals already exist, skipping seed');
      return;
    }

    // Seed professionals
    const professionals = [
      {
        name: 'אבי חשמלאי',
        phone: '050-1234567',
        email: 'avi@example.com',
        bio: 'חשמלאי מוסמך עם 10 שנות ניסיון',
        rating: 4.5,
        reviews_count: 20,
        image_url: 'https://via.placeholder.com/150',
        created_at: new Date().toISOString(),
        city: 'תל אביב',
        specialty: 'חשמלאי',
        verified: true,
        area: 'tel_aviv',
        category: 'electricity'
      },
      {
        name: 'משה אינסטלטור',
        phone: '052-7654321',
        email: 'moshe@example.com',
        bio: 'אינסטלטור מומחה עם 15 שנות ניסיון',
        rating: 4.8,
        reviews_count: 35,
        image_url: 'https://via.placeholder.com/150',
        created_at: new Date().toISOString(),
        city: 'ירושלים',
        specialty: 'אינסטלטור',
        verified: true,
        area: 'jerusalem',
        category: 'plumbing'
      },
      {
        name: 'שרה שיפוצים',
        phone: '054-2345678',
        email: 'sara@example.com',
        bio: 'קבלנית שיפוצים עם 20 שנות ניסיון',
        rating: 4.2,
        reviews_count: 15,
        image_url: 'https://via.placeholder.com/150',
        created_at: new Date().toISOString(),
        city: 'חיפה',
        specialty: 'שיפוצים',
        verified: true,
        area: 'haifa',
        category: 'renovations'
      },
      {
        name: 'דוד נגר',
        phone: '055-8765432',
        email: 'david@example.com',
        bio: 'נגר אומן עם 25 שנות ניסיון',
        rating: 4.9,
        reviews_count: 40,
        image_url: 'https://via.placeholder.com/150',
        created_at: new Date().toISOString(),
        city: 'באר שבע',
        specialty: 'נגר',
        verified: true,
        area: 'beer_sheva',
        category: 'carpentry'
      },
      {
        name: 'רחל גננת',
        phone: '053-3456789',
        email: 'rachel@example.com',
        bio: 'גננת מומחית עם 30 שנות ניסיון',
        rating: 4.6,
        reviews_count: 25,
        image_url: 'https://via.placeholder.com/150',
        created_at: new Date().toISOString(),
        city: 'תל אביב',
        specialty: 'גננת',
        verified: true,
        area: 'tel_aviv',
        category: 'gardening'
      }
    ];

    // Insert professionals
    const { error: insertError } = await supabase
      .from('professionals')
      .insert(professionals);

    if (insertError) {
      console.error('Error seeding professionals:', insertError);
      return;
    }

    console.log('Professionals seeded successfully');
  } catch (error) {
    console.error('Error seeding professionals:', error);
  }
};
