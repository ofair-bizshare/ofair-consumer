
export interface ProfessionalInterface {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  bio?: string;
  rating: number;
  reviews_count: number;
  image_url: string;
  created_at: string;
  city?: string; // Made optional to match database structure
  specialty?: string; // Made optional to match database structure
  verified?: boolean;
  area?: string;
  category?: string;
  // Adding compatibility with Search and Components
  profession: string;
  location: string;
  image: string;
  specialties: string[];
  phoneNumber?: string;
  about?: string;
  reviewCount: number;
  // Additional fields from the professional creation form
  company_name?: string;
  work_hours?: string;
  certifications?: string[];
  experience_years?: number;
  // Add phone_number as an alias for phoneNumber for backward compatibility
  phone_number?: string;
  // Additional fields from Supabase database mapping
  areas?: string;
  working_hours?: string;
  is_verified?: boolean;
}
