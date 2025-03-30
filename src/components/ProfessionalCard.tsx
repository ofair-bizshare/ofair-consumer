
import React from 'react';
import { Star, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import PhoneRevealButton from '@/components/PhoneRevealButton';

interface ProfessionalCardProps {
  id: string;
  name: string;
  profession: string;
  rating: number;
  reviewCount: number;
  location: string;
  image: string;
  specialties: string[];
  phoneNumber?: string;
}

const ProfessionalCard: React.FC<ProfessionalCardProps> = ({
  id,
  name,
  profession,
  rating,
  reviewCount,
  location,
  image,
  specialties,
  phoneNumber = "050-5555555", // Default phone number if not provided
}) => {
  return (
    <div className="glass-card group hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
      <div className="relative overflow-hidden rounded-t-xl h-48">
        <img 
          src={image} 
          alt={name} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      
      <div className="p-5">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold">{name}</h3>
            <p className="text-gray-600 text-sm">{profession}</p>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-sm font-medium">{rating}</span>
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="text-xs text-gray-500">({reviewCount})</span>
          </div>
        </div>
        
        <div className="flex items-center mt-2 text-gray-500 text-sm">
          <MapPin size={14} className="ml-1" />
          <span>{location}</span>
        </div>
        
        <div className="mt-3">
          <div className="flex flex-wrap gap-1">
            {specialties.map((specialty, index) => (
              <span 
                key={index} 
                className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full"
              >
                {specialty}
              </span>
            ))}
          </div>
        </div>
        
        <div className="mt-4 space-y-2">
          <PhoneRevealButton 
            phoneNumber={phoneNumber}
            professionalName={name}
            professionalId={id}
            profession={profession}
          />
          
          <Button 
            asChild
            variant="outline"
            className="w-full border-teal-500 text-teal-600 hover:bg-teal-50"
          >
            <Link to={`/professional/${id}`}>צפה בפרופיל</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProfessionalCard;
