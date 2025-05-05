
import React from 'react';
import { Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ProfessionalCard from '@/components/ProfessionalCard';
import { ProfessionalInterface } from '@/types/dashboard';

interface SearchResultsProps {
  professionals: ProfessionalInterface[];
  sortOption: string;
  handleSortChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  handlePhoneReveal: (professionalName: string) => boolean;
  resetFilters: () => void;
}

const SearchResults: React.FC<SearchResultsProps> = ({
  professionals,
  sortOption,
  handleSortChange,
  handlePhoneReveal,
  resetFilters
}) => {
  return (
    <div className="flex-grow">
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-xl font-semibold text-blue-700">
          נמצאו {professionals.length} בעלי מקצוע
        </h2>
        <div className="flex items-center text-sm text-gray-500">
          <span>מיון לפי: </span>
          <select 
            className="appearance-none bg-transparent border-none px-1 font-medium focus:outline-none"
            value={sortOption}
            onChange={handleSortChange}
          >
            <option value="rating">דירוג</option>
            <option value="popularity">פופולריות</option>
            <option value="name_asc">שם א-ת</option>
            <option value="name_desc">שם ת-א</option>
          </select>
        </div>
      </div>
      
      {professionals.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 stagger-animation">
          {professionals.map(professional => (
            <ProfessionalCard 
              key={professional.id}
              id={professional.id}
              name={professional.name}
              profession={professional.profession}
              rating={professional.rating}
              reviewCount={professional.reviewCount}
              location={professional.location}
              image={professional.image || 'https://images.unsplash.com/photo-1514539079130-25950c84af65?auto=format&fit=crop&q=80&w=800&h=450'}
              specialties={professional.specialties || []}
              phoneNumber={professional.phone || professional.phoneNumber}
              verified={professional.verified}
              onPhoneReveal={() => handlePhoneReveal(professional.name)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <Award className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">לא נמצאו תוצאות</h3>
          <p className="text-gray-500 mb-6">
            לא נמצאו בעלי מקצוע העונים לקריטריוני החיפוש שלך.
          </p>
          <Button 
            variant="outline" 
            onClick={resetFilters}
            className="border-teal-500 text-teal-500 hover:bg-teal-50"
          >
            נקה את כל הסינונים
          </Button>
        </div>
      )}
    </div>
  );
};

export default SearchResults;
