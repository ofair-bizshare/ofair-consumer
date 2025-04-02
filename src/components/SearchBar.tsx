
import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const professions = [
  { label: 'כל המקצועות', value: 'all' },
  { label: 'שיפוצים', value: 'renovations' },
  { label: 'חשמל', value: 'electricity' },
  { label: 'אינסטלציה', value: 'plumbing' },
  { label: 'נגרות', value: 'carpentry' },
  { label: 'מיזוג אוויר', value: 'air_conditioning' },
  { label: 'גינון', value: 'gardening' },
  { label: 'ניקיון', value: 'cleaning' },
  { label: 'צביעה', value: 'painting' },
  { label: 'הובלות', value: 'moving' },
];

const locations = [
  { label: 'כל האזורים', value: 'all' },
  { label: 'תל אביב והמרכז', value: 'tel_aviv' },
  { label: 'ירושלים והסביבה', value: 'jerusalem' },
  { label: 'חיפה והצפון', value: 'haifa' },
  { label: 'באר שבע והדרום', value: 'beer_sheva' },
  { label: 'אזור השרון', value: 'sharon' },
  { label: 'השפלה', value: 'shfela' },
];

const cities = [
  { label: 'כל הערים', value: 'all' },
  { label: 'תל אביב', value: 'tel_aviv' },
  { label: 'ירושלים', value: 'jerusalem' },
  { label: 'חיפה', value: 'haifa' },
  { label: 'באר שבע', value: 'beer_sheva' },
  { label: 'רמת גן', value: 'ramat_gan' },
  { label: 'הרצליה', value: 'herzliya' },
  { label: 'ראשון לציון', value: 'rishon' },
  { label: 'אשדוד', value: 'ashdod' },
  { label: 'נתניה', value: 'netanya' },
];

interface SearchBarProps {
  onSearch: (profession: string, location: string) => void;
  className?: string;
  useCities?: boolean; // Added this property to fix the TypeScript error
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, className = '', useCities = false }) => {
  const [professionQuery, setProfessionQuery] = useState('');
  const [locationQuery, setLocationQuery] = useState('');
  const [filteredProfessions, setFilteredProfessions] = useState(professions);
  const [filteredLocations, setFilteredLocations] = useState(useCities ? cities : locations);
  const [showProfessionSuggestions, setShowProfessionSuggestions] = useState(false);
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);
  const [selectedProfession, setSelectedProfession] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const professionInputRef = useRef<HTMLInputElement>(null);
  const locationInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const filtered = professions.filter(prof =>
      prof.label.includes(professionQuery) || 
      prof.value.includes(professionQuery.toLowerCase())
    );
    setFilteredProfessions(filtered);
  }, [professionQuery]);

  useEffect(() => {
    const locationOptions = useCities ? cities : locations;
    const filtered = locationOptions.filter(loc =>
      loc.label.includes(locationQuery) || 
      loc.value.includes(locationQuery.toLowerCase())
    );
    setFilteredLocations(filtered);
  }, [locationQuery, useCities]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (professionInputRef.current && !professionInputRef.current.contains(event.target as Node)) {
        setShowProfessionSuggestions(false);
      }
      if (locationInputRef.current && !locationInputRef.current.contains(event.target as Node)) {
        setShowLocationSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleProfessionClick = (prof: { label: string; value: string }) => {
    setProfessionQuery(prof.label);
    setSelectedProfession(prof.value);
    setShowProfessionSuggestions(false);
  };

  const handleLocationClick = (loc: { label: string; value: string }) => {
    setLocationQuery(loc.label);
    setSelectedLocation(loc.value);
    setShowLocationSuggestions(false);
  };

  const handleSearch = () => {
    onSearch(selectedProfession, selectedLocation);
  };

  return (
    <div className={`bg-white rounded-xl shadow-lg p-4 ${className}`}>
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1" ref={professionInputRef}>
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input
            placeholder="בחר סוג מקצוע"
            value={professionQuery}
            onChange={(e) => {
              setProfessionQuery(e.target.value);
              setShowProfessionSuggestions(true);
              if (e.target.value === '') {
                setSelectedProfession('all');
              }
            }}
            onClick={() => setShowProfessionSuggestions(true)}
            className="pl-10 border-gray-200"
          />
          {showProfessionSuggestions && (
            <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md border border-gray-200 max-h-60 overflow-y-auto">
              {filteredProfessions.length > 0 ? (
                filteredProfessions.map((prof) => (
                  <div
                    key={prof.value}
                    className="px-4 py-2 hover:bg-blue-50 cursor-pointer"
                    onClick={() => handleProfessionClick(prof)}
                  >
                    {prof.label}
                  </div>
                ))
              ) : (
                <div className="px-4 py-2 text-gray-500">לא נמצאו תוצאות</div>
              )}
            </div>
          )}
        </div>
        
        <div className="relative flex-1" ref={locationInputRef}>
          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input
            placeholder={useCities ? "בחר עיר" : "בחר אזור"}
            value={locationQuery}
            onChange={(e) => {
              setLocationQuery(e.target.value);
              setShowLocationSuggestions(true);
              if (e.target.value === '') {
                setSelectedLocation('all');
              }
            }}
            onClick={() => setShowLocationSuggestions(true)}
            className="pl-10 border-gray-200"
          />
          {showLocationSuggestions && (
            <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md border border-gray-200 max-h-60 overflow-y-auto">
              {filteredLocations.length > 0 ? (
                filteredLocations.map((loc) => (
                  <div
                    key={loc.value}
                    className="px-4 py-2 hover:bg-blue-50 cursor-pointer"
                    onClick={() => handleLocationClick(loc)}
                  >
                    {loc.label}
                  </div>
                ))
              ) : (
                <div className="px-4 py-2 text-gray-500">לא נמצאו תוצאות</div>
              )}
            </div>
          )}
        </div>
        
        <Button 
          type="button" 
          onClick={handleSearch}
          className="bg-teal-500 hover:bg-teal-600 text-white min-w-28"
        >
          חיפוש
        </Button>
      </div>
    </div>
  );
};

export default SearchBar;
