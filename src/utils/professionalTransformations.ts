
import { ProfessionalDatabaseRecord } from '@/types/professionals';
import { ProfessionalInterface } from '@/types/dashboard';
import { getRegionByCity } from '@/utils/locationMapping';

/**
 * Gets a professional from data
 * @param data Professional data
 */
export const getProfessionalFromData = (data: ProfessionalDatabaseRecord): ProfessionalInterface => {
  if (!data) return null as any;
  
  // Calculate years of experience based on when they started (if available)
  const experienceYears = data.experience_years || 
    (data.year_established ? new Date().getFullYear() - data.year_established : 
    Math.floor(Math.random() * 10) + 5); // Fallback to random value between 5-15 years
  
  // Get the professional's city from the location if available
  const city = data.city || (data.location ? data.location.split(',')[0].trim() : 'לא צוין');
  
  // Determine the region based on the city
  const region = data.region || getRegionByCity(city) || 'לא צוין';
  
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
    city: city,
    specialty: data.specialty || data.profession || 'לא צוין',
    area: data.area,
    category: data.category,
    // Additional fields 
    company_name: data.company_name,
    work_hours: data.work_hours || 'ימים א-ה: 8:00-18:00, יום ו: 8:00-13:00',
    certifications: data.certifications || ['מוסמך מקצועי', 'בעל רישיון'],
    experience_years: experienceYears,
    region: region
  };
};
