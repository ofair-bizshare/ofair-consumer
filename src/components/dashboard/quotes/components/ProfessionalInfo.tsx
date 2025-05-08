
import React, { useState } from 'react';
import { User } from 'lucide-react';
import { Star } from 'lucide-react';
import { ProfessionalInterface } from '@/types/dashboard';

interface ProfessionalInfoProps {
  professional: ProfessionalInterface;
}

const ProfessionalInfo: React.FC<ProfessionalInfoProps> = ({ professional }) => {
  const [imageError, setImageError] = useState(false);
  
  const professionalImage = professional.image || professional.image_url;
  
  return (
    <div className="flex justify-between items-start mb-4">
      <div className="flex items-center">
        <div className="w-14 h-14 overflow-hidden rounded-full bg-gray-100 mr-3 flex-shrink-0 border border-gray-200">
          {!imageError && professionalImage ? (
            <img 
              src={professionalImage} 
              alt={professional.name}
              className="w-full h-full object-cover"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-full bg-gray-100 flex items-center justify-center">
              <User className="text-gray-400 w-7 h-7" />
            </div>
          )}
        </div>
        <div>
          <h3 className="text-lg font-semibold flex items-center">
            {professional.name}
            {professional.is_verified && (
              <span className="mr-1 bg-blue-50 text-blue-600 text-xs px-2 py-0.5 rounded-full">
                מאומת ✓
              </span>
            )}
          </h3>
          <p className="text-gray-500 text-sm">{professional.profession}</p>
        </div>
      </div>
      <div className="flex items-center space-x-1">
        <span className="text-sm font-medium">{professional.rating || "0"}</span>
        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
        <span className="text-xs text-gray-500">({professional.reviewCount || "0"})</span>
      </div>
    </div>
  );
};

export default ProfessionalInfo;
