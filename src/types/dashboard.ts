


// Request status types
export type RequestStatus = 'active' | 'completed' | 'expired' | 'canceled' | 'waiting_for_rating';

// Quote status types
export type QuoteStatus = 'pending' | 'accepted' | 'rejected' | 'expired';

// Professional interface
export interface ProfessionalInterface {
  id: string;
  name: string;
  profession: string;
  phoneNumber?: string;
  phone?: string;
  image?: string;
  image_url?: string;
  rating?: number;
  reviewCount?: number;
  is_verified?: boolean;
  verified?: boolean; // Added this property as it's being used in SearchResults.tsx
  about?: string;
  location?: string;
  specialties?: string[];
}

// Quote interface
export interface QuoteInterface {
  id: string;
  requestId: string;
  professional: ProfessionalInterface;
  price: string;
  estimatedTime?: string;
  description: string;
  status: QuoteStatus;
  sampleImageUrl?: string | null;
}

// Request interface
export interface RequestInterface {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  status: RequestStatus;
  quotesCount: number;
  timing?: string;
}

// Notification interface
export interface NotificationInterface {
  id: string;
  title: string;
  description: string;
  type: string;
  created_at: string;
  is_read: boolean;
  related_id?: string;
  related_type?: string;
}

// Referral interface
export interface ReferralInterface {
  id: string;
  professional_name: string;
  phone_number: string;
  profession?: string;
  date: string;
  status?: string;
  completed_work?: boolean;
  professional_id?: string;
  user_id?: string;
}

// Article interface
export interface ArticleInterface {
  id: string;
  title: string;
  content: string;
  summary?: string;
  author?: string;
  image?: string;
  created_at: string;
  updated_at?: string;
  published: boolean;
  category?: string;
  // Adding missing properties used in ArticleDetail.tsx
  excerpt?: string;
  date?: string;
  categoryLabel?: string;
  readTime?: string;
}

// User Profile interface
export interface UserProfileInterface {
  id: string;
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  profile_image?: string;
  created_at?: string;
  updated_at?: string;
}

// Admin User interface
export interface AdminUserInterface {
  id: string;
  user_id: string;
  is_super_admin: boolean;
  created_at: string;
  updated_at?: string;
}

// User Message interface
export interface UserMessageInterface {
  id: string;
  sender_id: string;
  recipient_id?: string;
  recipient_email?: string;
  subject: string;
  content: string;
  read: boolean;
  created_at: string;
  updated_at: string;
}

