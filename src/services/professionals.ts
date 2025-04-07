
import { supabase } from '@/integrations/supabase/client';
import { ProfessionalInterface as DashboardProfessionalInterface } from '@/types/dashboard';

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
  // Additional fields from the professional creation form
  company_name?: string;
  work_hours?: string;
  certifications?: string[];
  experience_years?: number;
}

/**
 * Gets all professionals
 */
export const getProfessionals = async (): Promise<DashboardProfessionalInterface[]> => {
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
export const getProfessional = async (id: string): Promise<DashboardProfessionalInterface | null> => {
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
export const getProfessionalFromData = (data: any): DashboardProfessionalInterface => {
  if (!data) return null as any;
  
  // Calculate years of experience based on when they started (if available)
  const experienceYears = data.experience_years || 
    (data.year_established ? new Date().getFullYear() - data.year_established : 
    Math.floor(Math.random() * 10) + 5); // Fallback to random value between 5-15 years
  
  return {
    id: data.id,
    name: data.name,
    profession: data.specialty || data.profession || 'לא צוין',
    rating: data.rating || 0,
    reviewCount: data.reviews_count || data.review_count || 0,
    location: data.city || data.location || 'לא צוין',
    image: data.image_url || data.image || 'https://via.placeholder.com/150',
    verified: data.verified || false,
    specialties: data.specialties || [data.specialty] || [],
    // Add all compatibility fields
    phone: data.phone || data.phoneNumber || data.phone_number,
    phoneNumber: data.phone || data.phone_number,
    email: data.email,
    bio: data.bio,
    about: data.bio || data.about,
    reviews_count: data.reviews_count || data.reviewCount || 0,
    image_url: data.image_url || data.image || 'https://via.placeholder.com/150',
    created_at: data.created_at,
    city: data.city || data.location || 'לא צוין',
    specialty: data.specialty || data.profession || 'לא צוין',
    area: data.area,
    category: data.category,
    // Additional fields 
    company_name: data.company_name,
    work_hours: data.work_hours || 'ימים א-ה: 8:00-18:00, יום ו: 8:00-13:00',
    certifications: data.certifications || ['מוסמך מקצועי', 'בעל רישיון'],
    experience_years: experienceYears
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

    // Convert sample data to match the database schema
    const professionals = [
      {
        name: 'אבי חשמלאי',
        profession: 'חשמלאי',
        phone: '050-1234567',
        email: 'avi@example.com',
        bio: 'חשמלאי מוסמך עם 10 שנות ניסיון',
        rating: 4.5,
        reviews_count: 20,
        image_url: 'https://via.placeholder.com/150',
        city: 'תל אביב',
        specialty: 'חשמלאי',
        specialties: ['חשמלאי', 'התקנת מזגנים'],
        area: 'tel_aviv',
        category: 'electricity',
        verified: true,
        location: 'תל אביב'
      },
      {
        name: 'משה אינסטלטור',
        profession: 'אינסטלטור',
        phone: '052-7654321',
        email: 'moshe@example.com',
        bio: 'אינסטלטור מומחה עם 15 שנות ניסיון',
        rating: 4.8,
        reviews_count: 35,
        image_url: 'https://via.placeholder.com/150',
        city: 'ירושלים',
        specialty: 'אינסטלטור',
        specialties: ['אינסטלטור', 'תיקון נזילות'],
        area: 'jerusalem',
        category: 'plumbing',
        verified: true,
        location: 'ירושלים'
      },
      {
        name: 'שרה שיפוצים',
        profession: 'שיפוצים',
        phone: '054-2345678',
        email: 'sara@example.com',
        bio: 'קבלנית שיפוצים עם 20 שנות ניסיון',
        rating: 4.2,
        reviews_count: 15,
        image_url: 'https://via.placeholder.com/150',
        city: 'חיפה',
        specialty: 'שיפוצים',
        specialties: ['שיפוצים', 'צביעה'],
        area: 'haifa',
        category: 'renovations',
        verified: false,
        location: 'חיפה'
      },
      {
        name: 'דוד נגר',
        profession: 'נגר',
        phone: '055-8765432',
        email: 'david@example.com',
        bio: 'נגר אומן עם 25 שנות ניסיון',
        rating: 4.9,
        reviews_count: 40,
        image_url: 'https://via.placeholder.com/150',
        city: 'באר שבע',
        specialty: 'נגרות',
        specialties: ['נגרות', 'רהיטים'],
        area: 'beer_sheva',
        category: 'carpentry',
        verified: true,
        location: 'באר שבע'
      },
      {
        name: 'רחל גננת',
        profession: 'גננית',
        phone: '053-3456789',
        email: 'rachel@example.com',
        bio: 'גננת מומחית עם 30 שנות ניסיון',
        rating: 4.6,
        reviews_count: 25,
        image_url: 'https://via.placeholder.com/150',
        city: 'תל אביב',
        specialty: 'גינון',
        specialties: ['גינון', 'עיצוב גינות'],
        area: 'tel_aviv',
        category: 'gardening',
        verified: false,
        location: 'תל אביב'
      }
    ];

    // These are database professionals - map them to the DB fields
    const dbProfessionals = professionals.map(p => ({
      name: p.name,
      profession: p.profession,
      location: p.location,
      image: p.image_url,
      specialties: p.specialties,
      phone_number: p.phone,
      about: p.bio,
      rating: p.rating,
      review_count: p.reviews_count,
      city: p.city,
      specialty: p.specialty,
      verified: p.verified,
      area: p.area,
      category: p.category
    }));

    // Insert professionals
    const { error: insertError } = await supabase
      .from('professionals')
      .insert(dbProfessionals);

    if (insertError) {
      console.error('Error seeding professionals:', insertError);
      return;
    }

    console.log('Professionals seeded successfully');
  } catch (error) {
    console.error('Error seeding professionals:', error);
  }
};
