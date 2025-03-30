
export interface ProfessionalInterface {
  id: string;
  name: string;
  profession: string;
  rating: number;
  reviewCount: number;
  location: string;
  image: string;
  verified?: boolean; // Keeping for backward compatibility
  specialties: string[];
  phoneNumber?: string;
}

export interface RequestInterface {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  status: 'active' | 'completed' | 'pending';
  quotesCount: number;
}

export interface QuoteInterface {
  id: string;
  requestId: string;
  professional: ProfessionalInterface;
  price: string;
  estimatedTime: string;
  description: string;
  status: 'pending' | 'accepted' | 'rejected';
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
  published: boolean;
}
