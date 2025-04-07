
import { supabase } from '@/integrations/supabase/client';

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
