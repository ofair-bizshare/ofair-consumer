
import { ProfessionalInterface } from './types';

/**
 * Format a phone number for display
 * @param phone The phone number to format
 */
export const formatPhoneNumber = (phone?: string): string => {
  if (!phone) return '';
  
  // If it's just digits, format as XXX-XXXXXXX
  if (/^\d+$/.test(phone) && phone.length >= 9) {
    const prefix = phone.slice(0, 3);
    const number = phone.slice(3);
    return `${prefix}-${number}`;
  }
  
  return phone;
};

/**
 * Gets a professional from data
 * @param data Professional data
 */
export const getProfessionalFromData = (data: any): ProfessionalInterface => {
  if (!data) return null as any;
  
  // Calculate years of experience based on when they started (if available)
  const experienceYears = data.experience_years || 
    (data.year_established ? new Date().getFullYear() - data.year_established : 
    Math.floor(Math.random() * 10) + 5); // Fallback to random value between 5-15 years

  // Ensure the phone number is properly formatted  
  const phoneNumber = formatPhoneNumber(data.phone_number || data.phone || '');
  
  return {
    id: data.id,
    name: data.name,
    profession: data.specialty || data.profession || 'לא צוין',
    rating: data.rating || 0,
    reviewCount: data.reviews_count || data.review_count || 0,
    location: data.city || data.location || 'לא צוין',
    image: data.image_url || data.image || 'https://via.placeholder.com/150',
    verified: data.verified || false,
    specialties: data.specialties || [data.specialty].filter(Boolean) || [],
    // Add all compatibility fields
    phone: phoneNumber,
    phoneNumber: phoneNumber,
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
