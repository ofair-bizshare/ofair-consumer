
import { supabase } from '@/integrations/supabase/client';
import { ProfessionalInterface } from '@/types/dashboard';
import { getProfessionalCategoryLabel, getLocationLabel } from './admin/utils/adminCache';

// Fetch all professionals from the database
export const fetchProfessionals = async (): Promise<ProfessionalInterface[]> => {
  try {
    console.log('Fetching professionals...');
    
    // First try with normal select
    try {
      const { data, error } = await supabase
        .from('professionals')
        .select('*')
        .order('rating', { ascending: false });
        
      if (error) {
        console.error('Error fetching professionals with standard query:', error);
        throw error;
      }
      
      if (!data || data.length === 0) {
        console.log('No professionals found in the database');
        return [];
      }
      
      // Map the database columns to our interface and add formatted fields
      return data.map(item => ({
        id: item.id,
        name: item.name,
        profession: item.profession,
        rating: item.rating || 0,
        reviewCount: item.review_count || 0,
        location: getLocationLabel(item.location),
        image: item.image,
        specialties: item.specialties || [],
        phoneNumber: item.phone_number,
        about: item.about || '',
        verified: Math.random() > 0.3, // Random for now, should be a proper field in the future
        // Add these fields to match the expected format in the Search component
        category: item.profession.toLowerCase().replace(/\s+/g, '_'),
        categoryLabel: getProfessionalCategoryLabel(item.profession.toLowerCase().replace(/\s+/g, '_')),
        area: item.location
      }));
    } catch (queryError) {
      // If we get an infinite recursion error, try using a stored procedure or manual workaround
      console.warn('Attempting alternative fetch method due to:', queryError);
      
      // In a real environment we'd use RPC (stored procedure) to bypass RLS
      // For now, use a simplified version without order to see if that works
      const { data: fallbackData, error: fallbackError } = await supabase
        .from('professionals')
        .select('*');
      
      if (fallbackError) {
        console.error('Error with fallback professional query:', fallbackError);
        return [];
      }
      
      if (!fallbackData || fallbackData.length === 0) {
        console.log('No professionals found with fallback query');
        return [];
      }
      
      // Sort in JS instead of SQL
      const sortedData = fallbackData.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      
      // Map the database columns to our interface with formatted fields
      return sortedData.map(item => ({
        id: item.id,
        name: item.name,
        profession: item.profession,
        rating: item.rating || 0,
        reviewCount: item.review_count || 0,
        location: getLocationLabel(item.location),
        image: item.image,
        specialties: item.specialties || [],
        phoneNumber: item.phone_number,
        about: item.about || '',
        verified: Math.random() > 0.3, // Random for now, should be a proper field in the future
        // Add these fields to match the expected format in the Search component
        category: item.profession.toLowerCase().replace(/\s+/g, '_'),
        categoryLabel: getProfessionalCategoryLabel(item.profession.toLowerCase().replace(/\s+/g, '_')),
        area: item.location
      }));
    }
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
      location: getLocationLabel(data.location),
      image: data.image,
      specialties: data.specialties || [],
      phoneNumber: data.phone_number,
      about: data.about || '',
      verified: Math.random() > 0.3, // Random for now, should be a proper field in the future
      // Add these fields to match the expected format
      category: data.profession.toLowerCase().replace(/\s+/g, '_'),
      categoryLabel: getProfessionalCategoryLabel(data.profession.toLowerCase().replace(/\s+/g, '_')),
      area: data.location
    };
  } catch (error) {
    console.error('Error fetching professional by ID:', error);
    return null;
  }
};

// Update the seed function to insert sample professionals if the database is empty
export const seedProfessionals = async () => {
  try {
    const { data: existingProfessionals } = await supabase
      .from('professionals')
      .select('id')
      .limit(1);
      
    if (existingProfessionals && existingProfessionals.length > 0) {
      console.log('Professionals already exist in the database, skipping seed');
      return;
    }
    
    console.log('No professionals found, seeding sample data...');
    
    const sampleProfessionals = [
      {
        name: 'אבי כהן',
        profession: 'חשמלאי מוסמך',
        rating: 4.8,
        review_count: 124,
        location: 'tel_aviv',
        image: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1180&q=80',
        specialties: ['תיקוני חשמל', 'התקנות', 'תאורה'],
        phone_number: '05012345678',
        about: 'חשמלאי מוסמך עם ניסיון של 15 שנים בתחום החשמל והתאורה. מתמחה בתיקוני חשמל, התקנות ותאורה. עובד באזור תל אביב והמרכז.'
      },
      {
        name: 'מיכל לוי',
        profession: 'מעצבת פנים',
        rating: 4.9,
        review_count: 89,
        location: 'sharon',
        image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1161&q=80',
        specialties: ['עיצוב דירות', 'תכנון חללים', 'צביעה'],
        phone_number: '05023456789',
        about: 'מעצבת פנים מנוסה עם ניסיון של 10 שנים בתחום. מתמחה בעיצוב דירות, תכנון חללים וצביעה. עובדת באזור השרון.'
      },
      {
        name: 'יוסי אברהם',
        profession: 'שיפוצניק כללי',
        rating: 4.7,
        review_count: 156,
        location: 'jerusalem',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
        specialties: ['שיפוצים כלליים', 'ריצוף', 'גבס'],
        phone_number: '05034567890',
        about: 'שיפוצניק כללי עם ניסיון של 20 שנים בתחום. מתמחה בשיפוצים כלליים, ריצוף וגבס. עובד באזור ירושלים והסביבה.'
      }
    ];
    
    const { error } = await supabase
      .from('professionals')
      .insert(sampleProfessionals);
      
    if (error) {
      console.error('Error seeding professionals:', error);
      throw error;
    }
    
    console.log('Sample professionals seeded successfully');
  } catch (error) {
    console.error('Error seeding professionals:', error);
    throw error;
  }
};
