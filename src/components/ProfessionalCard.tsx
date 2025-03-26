
import React from 'react';
import { Star, MapPin, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface ProfessionalCardProps {
  id: string;
  name: string;
  profession: string;
  rating: number;
  reviewCount: number;
  location: string;
  image: string;
  verified: boolean;
  specialties: string[];
}

const ProfessionalCard: React.FC<ProfessionalCardProps> = ({
  id,
  name,
  profession,
  rating,
  reviewCount,
  location,
  image,
  verified,
  specialties,
}) => {
  return (
    <div className="glass-card group hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
      <div className="relative overflow-hidden rounded-t-xl h-48">
        <img 
          src={image} 
          alt={name} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {verified && (
          <div className="absolute top-3 right-3 bg-teal-500 text-white text-xs px-2 py-1 rounded-full flex items-center border-2 border-white shadow-sm">
            <CheckCircle size={12} className="mr-1" />
            מאומת
          </div>
        )}
      </div>
      
      <div className="p-5">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold">{name}</h3>
            <p className="text-gray-600 text-sm">{profession}</p>
          </div>
          <div className="flex items-center space-x-1 space-x-reverse">
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
        
        <div className="mt-4">
          <Button 
            asChild
            className="w-full bg-teal-500 hover:bg-teal-600 text-white transition-all"
          >
            <Link to={`/professional/${id}`}>צפה בפרופיל</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProfessionalCard;
