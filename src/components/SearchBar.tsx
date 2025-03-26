
import React, { useState } from 'react';
import { Search, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue
} from '@/components/ui/select';

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

interface SearchBarProps {
  onSearch: (profession: string, location: string) => void;
  className?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, className = '' }) => {
  const [profession, setProfession] = useState('all');
  const [location, setLocation] = useState('all');

  const handleSearch = () => {
    onSearch(profession, location);
  };

  return (
    <div className={`bg-white rounded-xl shadow-lg p-4 ${className}`}>
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Select 
            onValueChange={setProfession}
            value={profession}
          >
            <SelectTrigger className="border-gray-200 pl-10">
              <SelectValue placeholder="בחר סוג מקצוע" />
            </SelectTrigger>
            <SelectContent>
              {professions.map(prof => (
                <SelectItem key={prof.value} value={prof.value}>
                  {prof.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="relative flex-1">
          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Select 
            onValueChange={setLocation}
            value={location}
          >
            <SelectTrigger className="border-gray-200 pl-10">
              <SelectValue placeholder="בחר אזור" />
            </SelectTrigger>
            <SelectContent>
              {locations.map(loc => (
                <SelectItem key={loc.value} value={loc.value}>
                  {loc.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
