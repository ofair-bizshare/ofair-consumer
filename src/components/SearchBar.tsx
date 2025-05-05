
import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin } from 'lucide-react';
import { Button } from './ui/button';
import { professions } from '@/utils/professionData';
import { israelLocations, israelRegions } from '@/utils/locationData';
import { useDebounce } from '@/hooks/useDebounce';

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
  const [searchText, setSearchText] = useState({ profession: '', location: '' });
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const locationOptions = useCities ? israelLocations : israelRegions;

  // Filter options based on search text
  const debouncedProfessionSearch = useDebounce(searchText.profession, 300);
  const debouncedLocationSearch = useDebounce(searchText.location, 300);
  
  const filteredProfessions = professions.filter(p => 
    !debouncedProfessionSearch || 
    p.label.includes(debouncedProfessionSearch) || 
    p.id.includes(debouncedProfessionSearch)
  );
  
  const filteredLocations = locationOptions.filter(l => 
    !debouncedLocationSearch || 
    l.label.includes(debouncedLocationSearch) || 
    l.id.includes(debouncedLocationSearch)
  );

  useEffect(() => {
    if (initialProfession) {
      setProfession(initialProfession);
    }
    if (initialLocation) {
      setLocation(initialLocation);
    }
  }, [initialProfession, initialLocation]);

  useEffect(() => {
    // Close dropdowns when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen({ profession: false, location: false });
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleProfessionSelect = (id: string) => {
    setProfession(id);
    setIsOpen({ ...isOpen, profession: false });
    setSearchText({ ...searchText, profession: '' });
    // Perform search automatically when both fields are selected
    if (location !== 'all') {
      onSearch(id, location);
    }
  };

  const handleLocationSelect = (id: string) => {
    setLocation(id);
    setIsOpen({ ...isOpen, location: false });
    setSearchText({ ...searchText, location: '' });
    // Perform search automatically when both fields are selected
    if (profession !== 'all') {
      onSearch(profession, id);
    }
  };

  const handleSearch = () => {
    onSearch(profession, location);
  };

  const handleProfessionSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText({ ...searchText, profession: e.target.value });
  };

  const handleLocationSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText({ ...searchText, location: e.target.value });
  };

  // Find the display labels for the current profession and location
  const currentProfessionLabel = professions.find(p => p.id === profession)?.label || 'בחר מקצוע';
  const currentLocationLabel = locationOptions.find(l => l.id === location)?.label || 'בחר איזור';

  return (
    <div className="glass-card p-4 md:p-6 rounded-xl shadow-lg" ref={dropdownRef}>
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <div 
            className="border rounded-lg p-3 flex items-center justify-between cursor-pointer bg-white"
            onClick={() => setIsOpen({ 
              profession: !isOpen.profession, 
              location: false 
            })}
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
              <div className="sticky top-0 p-2 bg-white border-b">
                <input
                  type="text"
                  placeholder="חפש מקצוע..."
                  className="w-full p-2 border rounded-md text-right"
                  value={searchText.profession}
                  onChange={handleProfessionSearchChange}
                  autoFocus
                />
              </div>
              <ul className="py-1">
                {filteredProfessions.map(item => (
                  <li 
                    key={item.id} 
                    className="cursor-pointer px-4 py-2 hover:bg-blue-50"
                    onClick={() => handleProfessionSelect(item.id)}
                  >
                    {item.label}
                  </li>
                ))}
                {filteredProfessions.length === 0 && (
                  <li className="px-4 py-2 text-gray-500">לא נמצאו תוצאות</li>
                )}
              </ul>
            </div>
          )}
        </div>
        
        <div className="relative flex-1">
          <div 
            className="border rounded-lg p-3 flex items-center justify-between cursor-pointer bg-white"
            onClick={() => setIsOpen({ 
              profession: false,
              location: !isOpen.location 
            })}
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
              <div className="sticky top-0 p-2 bg-white border-b">
                <input
                  type="text"
                  placeholder="חפש איזור..."
                  className="w-full p-2 border rounded-md text-right"
                  value={searchText.location}
                  onChange={handleLocationSearchChange}
                  autoFocus
                />
              </div>
              <ul className="py-1">
                {filteredLocations.map(item => (
                  <li 
                    key={item.id} 
                    className="cursor-pointer px-4 py-2 hover:bg-blue-50"
                    onClick={() => handleLocationSelect(item.id)}
                  >
                    {item.label}
                  </li>
                ))}
                {filteredLocations.length === 0 && (
                  <li className="px-4 py-2 text-gray-500">לא נמצאו תוצאות</li>
                )}
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
