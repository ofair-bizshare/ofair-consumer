
export interface ProfessionalInterface {
  id: string;
  name: string;
  profession: string;
  rating: number;
  reviewCount: number;
  location: string;
  image: string;
  verified: boolean;
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
  professionalId: string;
  professionalName: string;
  phoneNumber: string;
  date: string;
  status: string;
  profession?: string;
  completedWork?: boolean;
}
