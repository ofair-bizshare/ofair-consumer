
import React, { useState, useEffect } from 'react';
import { Search, MapPin } from 'lucide-react';
import { Button } from './ui/button';
import { professions } from '@/utils/professionData';
import { israelLocations, israelRegions } from '@/utils/locationData';

interface SearchBarProps {
  onSearch: (profession: string, location: string) => void;
  useCities?: boolean;
  initialProfession?: string;
  initialLocation?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ 
  onSearch, 
  useCities = false,
  initialProfession = '',
  initialLocation = ''
}) => {
  const [profession, setProfession] = useState('all');
  const [location, setLocation] = useState('all');
  const [isOpen, setIsOpen] = useState({ profession: false, location: false });
  
  const locationOptions = useCities ? israelLocations : israelRegions;

  useEffect(() => {
    if (initialProfession) {
      setProfession(initialProfession);
    }
    if (initialLocation) {
      setLocation(initialLocation);
    }
  }, [initialProfession, initialLocation]);

  const handleProfessionSelect = (id: string) => {
    setProfession(id);
    setIsOpen({ ...isOpen, profession: false });
  };

  const handleLocationSelect = (id: string) => {
    setLocation(id);
    setIsOpen({ ...isOpen, location: false });
  };

  const handleSearch = () => {
    onSearch(profession, location);
  };

  // Find the display labels for the current profession and location
  const currentProfessionLabel = professions.find(p => p.id === profession)?.label || 'בחר מקצוע';
  const currentLocationLabel = locationOptions.find(l => l.id === location)?.label || 'בחר איזור';

  return (
    <div className="glass-card p-4 md:p-6 rounded-xl shadow-lg">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <div 
            className="border rounded-lg p-3 flex items-center justify-between cursor-pointer bg-white"
            onClick={() => setIsOpen({ ...isOpen, profession: !isOpen.profession })}
          >
            <span className="text-gray-700">
              {currentProfessionLabel}
            </span>
            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
          
          {isOpen.profession && (
            <div className="absolute z-[50] mt-1 w-full rounded-md bg-white shadow-lg max-h-60 overflow-auto">
              <ul className="py-1">
                {professions.map(item => (
                  <li key={item.id} className="cursor-pointer px-4 py-2 hover:bg-blue-50" onClick={() => handleProfessionSelect(item.id)}>
                    {item.label}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        
        <div className="relative flex-1">
          <div 
            className="border rounded-lg p-3 flex items-center justify-between cursor-pointer bg-white"
            onClick={() => setIsOpen({ ...isOpen, location: !isOpen.location })}
          >
            <span className="flex items-center text-gray-700">
              <MapPin size={16} className="mr-2 text-blue-500" />
              {currentLocationLabel}
            </span>
            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
          
          {isOpen.location && (
            <div className="absolute z-[50] mt-1 w-full rounded-md bg-white shadow-lg max-h-60 overflow-auto">
              <ul className="py-1">
                {locationOptions.map(item => (
                  <li key={item.id} className="cursor-pointer px-4 py-2 hover:bg-blue-50" onClick={() => handleLocationSelect(item.id)}>
                    {item.label}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        
        <Button 
          className="bg-[#00D09E] hover:bg-[#00C090] flex items-center gap-2 px-6"
          onClick={handleSearch}
        >
          <Search size={18} />
          <span>חיפוש</span>
        </Button>
      </div>
    </div>
  );
};

export default SearchBar;
