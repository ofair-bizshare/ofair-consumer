
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
  profession: string; // Changed from optional to required to match dashboard.ts
  location: string;  // Changed from optional to required to match dashboard.ts
  image: string;     // Changed from optional to required to match dashboard.ts
  specialties: string[]; // Changed from optional to required to match dashboard.ts
  phoneNumber?: string;
  about?: string;
  reviewCount: number; // Changed from optional to required to match dashboard.ts
  // Additional fields from the professional creation form
  company_name?: string;
  work_hours?: string;
  certifications?: string[];
  experience_years?: number;
  // Add phone_number as an alias for phoneNumber for backward compatibility
  phone_number?: string;
}
