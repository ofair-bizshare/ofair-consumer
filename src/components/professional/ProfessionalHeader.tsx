
import React from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Building, Star, MapPin, Calendar, CheckCircle } from 'lucide-react';

interface ProfessionalHeaderProps {
  professional: {
    name: string;
    profession: string;
    image: string;
    verified?: boolean;
    rating: number;
    reviewCount: number;
    location: string;
    yearEstablished?: number;
    companyName?: string;
  };
}

const ProfessionalHeader: React.FC<ProfessionalHeaderProps> = ({ professional }) => {
  return (
    <div className="mb-8 p-6 bg-gradient-to-r from-blue-600 to-teal-500 rounded-xl text-white shadow-lg">
      <div className="flex flex-col md:flex-row items-center gap-6">
        <div className="relative">
          <Avatar className="h-28 w-28 border-4 border-white shadow-md">
            <AvatarImage src={professional.image} alt={professional.name} className="object-cover" />
            <AvatarFallback>{professional.name.substring(0, 2)}</AvatarFallback>
          </Avatar>
          {professional.verified && (
            <Badge className="absolute -top-2 -right-2 bg-white text-teal-500 border-2 border-teal-500">
              <CheckCircle className="h-3 w-3 mr-1" />
              מאומת
            </Badge>
          )}
        </div>
        
        <div className="text-center md:text-right flex-1">
          <h1 className="text-3xl font-bold">{professional.name}</h1>
          <p className="text-xl text-blue-50">{professional.profession}</p>
          
          {professional.companyName && (
            <p className="text-lg text-blue-100 mt-1">
              <Building className="inline-block h-4 w-4 ml-1" />
              {professional.companyName}
            </p>
          )}
          
          <div className="flex items-center justify-center md:justify-start mt-2">
            <div className="flex items-center bg-white/20 rounded-full px-3 py-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 ml-1" />
              <span className="font-medium">{professional.rating}</span>
              <span className="text-sm text-blue-50 mr-1">({professional.reviewCount} ביקורות)</span>
            </div>
            <div className="flex items-center mx-4">
              <MapPin className="h-4 w-4 ml-1 text-blue-50" />
              <span className="text-sm">{professional.location}</span>
            </div>
            <div className="flex items-center">
              <Calendar className="h-4 w-4 ml-1 text-blue-50" />
              <span className="text-sm">פועל משנת {professional.yearEstablished}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfessionalHeader;
