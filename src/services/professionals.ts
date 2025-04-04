
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
  // Adding compatibility with Search and Components
  profession?: string;
  location?: string;
  image?: string;
  specialties?: string[];
  phoneNumber?: string;
  about?: string;
  reviewCount?: number;
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

// Add alias for compatibility with existing code
export const fetchProfessionals = getProfessionals;

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

// Add alias for compatibility with existing code
export const getProfessionalById = getProfessional;

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
    category: data.category,
    // Add compatibility fields
    profession: data.specialty || data.profession || 'לא צוין',
    location: data.city || data.location || 'לא צוין',
    image: data.image_url || data.image || 'https://via.placeholder.com/150',
    specialties: data.specialties || [data.specialty] || [],
    phoneNumber: data.phone || data.phone_number,
    about: data.bio || data.about,
    reviewCount: data.reviews_count || data.review_count || 0
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

    // Convert our sample data to match database fields
    const professionals = [
      {
        name: 'אבי חשמלאי',
        profession: 'חשמלאי',
        phone_number: '050-1234567',
        email: 'avi@example.com',
        about: 'חשמלאי מוסמך עם 10 שנות ניסיון',
        rating: 4.5,
        review_count: 20,
        image: 'https://via.placeholder.com/150',
        location: 'תל אביב',
        specialties: ['חשמלאי', 'התקנת מזגנים'],
        area: 'tel_aviv',
        category: 'electricity'
      },
      {
        name: 'משה אינסטלטור',
        profession: 'אינסטלטור',
        phone_number: '052-7654321',
        email: 'moshe@example.com',
        about: 'אינסטלטור מומחה עם 15 שנות ניסיון',
        rating: 4.8,
        review_count: 35,
        image: 'https://via.placeholder.com/150',
        location: 'ירושלים',
        specialties: ['אינסטלטור', 'תיקון נזילות'],
        area: 'jerusalem',
        category: 'plumbing'
      },
      {
        name: 'שרה שיפוצים',
        profession: 'שיפוצים',
        phone_number: '054-2345678',
        email: 'sara@example.com',
        about: 'קבלנית שיפוצים עם 20 שנות ניסיון',
        rating: 4.2,
        review_count: 15,
        image: 'https://via.placeholder.com/150',
        location: 'חיפה',
        specialties: ['שיפוצים', 'צביעה'],
        area: 'haifa',
        category: 'renovations'
      },
      {
        name: 'דוד נגר',
        profession: 'נגר',
        phone_number: '055-8765432',
        email: 'david@example.com',
        about: 'נגר אומן עם 25 שנות ניסיון',
        rating: 4.9,
        review_count: 40,
        image: 'https://via.placeholder.com/150',
        location: 'באר שבע',
        specialties: ['נגרות', 'רהיטים'],
        area: 'beer_sheva',
        category: 'carpentry'
      },
      {
        name: 'רחל גננת',
        profession: 'גננית',
        phone_number: '053-3456789',
        email: 'rachel@example.com',
        about: 'גננת מומחית עם 30 שנות ניסיון',
        rating: 4.6,
        review_count: 25,
        image: 'https://via.placeholder.com/150',
        location: 'תל אביב',
        specialties: ['גינון', 'עיצוב גינות'],
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
