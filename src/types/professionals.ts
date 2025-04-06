
/**
 * Professional service types
 */

// Define a simplified database response type to avoid circular references
export type ProfessionalDatabaseRecord = {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  bio?: string;
  rating?: number;
  reviews_count?: number;
  image_url?: string;
  created_at?: string;
  city?: string;
  specialty?: string;
  verified?: boolean;
  area?: string;
  category?: string;
  profession?: string;
  location?: string;
  image?: string;
  specialties?: string[];
  phoneNumber?: string;
  phone_number?: string;
  about?: string;
  reviewCount?: number;
  company_name?: string;
  work_hours?: string;
  certifications?: string[];
  experience_years?: number;
  year_established?: number;
  region?: string;
  review_count?: number;
  // Add any other properties that might come from the database
};

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
  // Add region field for the new region-based search
  region?: string;
}
