export interface ProfessionalInterface {
  id: string;
  name: string;
  profession: string;
  rating: number;
  reviewCount: number;
  location: string;
  image: string;
  verified?: boolean;
  specialties: string[];
  phoneNumber?: string;
  about?: string;
  // Add compatibility with services/professionals.ts
  phone?: string;
  email?: string;
  bio?: string;
  reviews_count?: number;
  image_url?: string;
  created_at?: string;
  city?: string;
  specialty?: string;
  area?: string;
  category?: string;
  // Add the new properties that were missing
  company_name?: string;
  work_hours?: string;
  certifications?: string[];
  experience_years?: number;
  // Add phone_number as an alias for phoneNumber for backward compatibility
  phone_number?: string;
}

export interface RequestInterface {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  status: string;
  quotesCount: number;
  timing?: string;
}

export interface QuoteInterface {
  id: string;
  requestId: string;
  professional: ProfessionalInterface;
  price: string;
  estimatedTime: string;
  description: string;
  status: string;
}

export interface ReferralInterface {
  id?: string;
  user_id?: string;
  professionalId: string;
  professionalName: string;
  phoneNumber: string;
  date: string;
  status: string;
  profession?: string;
  completedWork?: boolean;
}

export interface UserProfileInterface {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  profile_image?: string;
}

export interface ArticleInterface {
  id: string;
  title: string;
  content: string;
  summary?: string;
  image?: string;
  author?: string;
  created_at: string;
  updated_at?: string;
  published: boolean;
  category?: string;
  excerpt?: string;
  date?: string;
  readTime?: string;
  categoryLabel?: string;
}

export interface AdminUserInterface {
  id: string;
  user_id: string;
  is_super_admin: boolean;
  created_at: string;
}

export interface UserMessageInterface {
  id: string;
  sender_id: string;
  recipient_id?: string;
  recipient_email?: string;
  subject: string;
  content: string;
  read: boolean;
  created_at: string;
}
