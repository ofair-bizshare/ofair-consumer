
import React, { useState } from 'react';
import { Search, MapPin } from 'lucide-react';
import { Button } from './ui/button';

interface SearchBarProps {
  onSearch: (profession: string, location: string) => void;
  useCities?: boolean;
}

const professions = [
  { id: 'all', label: 'כל המקצועות' },
  { id: 'plumbing', label: 'אינסטלציה' },
  { id: 'electricity', label: 'חשמל' },
  { id: 'renovations', label: 'שיפוצים' },
  { id: 'carpentry', label: 'נגרות' },
  { id: 'architecture', label: 'אדריכלות' },
  { id: 'interior_design', label: 'עיצוב פנים' },
];

const locations = [
  { id: 'all', label: 'כל הארץ' },
  { id: 'tel_aviv', label: 'תל אביב והמרכז' },
  { id: 'jerusalem', label: 'ירושלים והסביבה' },
  { id: 'haifa', label: 'חיפה והצפון' },
  { id: 'beer_sheva', label: 'באר שבע והדרום' },
  { id: 'sharon', label: 'השרון' },
  { id: 'shfela', label: 'השפלה' },
];

const cities = [
  { id: 'all', label: 'כל הערים' },
  { id: 'tel_aviv', label: 'תל אביב' },
  { id: 'jerusalem', label: 'ירושלים' },
  { id: 'haifa', label: 'חיפה' },
  { id: 'rishon', label: 'ראשון לציון' },
  { id: 'petah_tikva', label: 'פתח תקווה' },
  { id: 'netanya', label: 'נתניה' },
  { id: 'beer_sheva', label: 'באר שבע' },
  { id: 'ashdod', label: 'אשדוד' },
  { id: 'ashkelon', label: 'אשקלון' },
  { id: 'holon', label: 'חולון' },
  { id: 'ramat_gan', label: 'רמת גן' },
  { id: 'rehovot', label: 'רחובות' },
  { id: 'herzliya', label: 'הרצליה' },
  { id: 'kfar_saba', label: 'כפר סבא' },
  { id: 'eilat', label: 'אילת' },
  { id: 'modiin', label: 'מודיעין' },
  { id: 'raanana', label: 'רעננה' },
];

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, useCities = false }) => {
  const [profession, setProfession] = useState('all');
  const [location, setLocation] = useState('all');
  const [isOpen, setIsOpen] = useState({ profession: false, location: false });
  
  const locationOptions = useCities ? cities : locations;

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

  return (
    <div className="glass-card p-4 md:p-6 rounded-xl shadow-lg">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <div 
            className="border rounded-lg p-3 flex items-center justify-between cursor-pointer bg-white"
            onClick={() => setIsOpen({ ...isOpen, profession: !isOpen.profession })}
          >
            <span className="text-gray-700">
              {professions.find(p => p.id === profession)?.label || 'בחר מקצוע'}
            </span>
            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
          
          {isOpen.profession && (
            <div className="absolute z-20 mt-1 w-full rounded-md bg-white shadow-lg max-h-60 overflow-auto">
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
              {locationOptions.find(l => l.id === location)?.label || 'בחר איזור'}
            </span>
            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
          
          {isOpen.location && (
            <div className="absolute z-20 mt-1 w-full rounded-md bg-white shadow-lg max-h-60 overflow-auto">
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
