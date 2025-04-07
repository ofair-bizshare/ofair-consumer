
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { MapPin, Briefcase, Search } from 'lucide-react';
import { Label } from '@/components/ui/label';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check } from "lucide-react";
import { useDebounce } from '@/hooks/useDebounce';
import { professions } from '@/utils/professionData';
import { israelLocations } from '@/utils/locationData';

interface DynamicSearchComponentProps {
  className?: string;
  onSearch?: (profession: string, location: string) => void;
  initialProfession?: string;
  initialLocation?: string;
  title?: string;
}

const DynamicSearchComponent: React.FC<DynamicSearchComponentProps> = ({
  className = "",
  onSearch,
  initialProfession = "",
  initialLocation = "",
  title = "חיפוש בעלי מקצוע לפי עיר"
}) => {
  const [category, setCategory] = useState('');
  const [city, setCity] = useState('');
  const [openCategory, setOpenCategory] = useState(false);
  const [openCity, setOpenCity] = useState(false);
  const [categorySearchTerm, setCategorySearchTerm] = useState('');
  const [citySearchTerm, setCitySearchTerm] = useState('');
  const [filteredCategories, setFilteredCategories] = useState(professions);
  const [filteredCities, setFilteredCities] = useState(israelLocations);
  
  const debouncedCategorySearch = useDebounce(categorySearchTerm, 300);
  const debouncedCitySearch = useDebounce(citySearchTerm, 300);
  
  const navigate = useNavigate();

  // Set initial values from props
  useEffect(() => {
    if (initialProfession) {
      setCategory(initialProfession);
    }
    if (initialLocation) {
      setCity(initialLocation);
    }
  }, [initialProfession, initialLocation]);

  // Filter categories based on search term
  useEffect(() => {
    if (debouncedCategorySearch) {
      const filtered = professions.filter(cat => 
        cat.label.toLowerCase().includes(debouncedCategorySearch.toLowerCase())
      );
      setFilteredCategories(filtered);
    } else {
      setFilteredCategories(professions);
    }
  }, [debouncedCategorySearch]);

  // Filter cities based on search term
  useEffect(() => {
    if (debouncedCitySearch) {
      const filtered = israelLocations.filter(c => 
        c.label.toLowerCase().includes(debouncedCitySearch.toLowerCase()) || 
        c.id.toLowerCase().includes(debouncedCitySearch.toLowerCase())
      );
      setFilteredCities(filtered);
    } else {
      setFilteredCities(israelLocations);
    }
  }, [debouncedCitySearch]);

  const handleSearch = () => {
    if (onSearch) {
      onSearch(category, city);
    } else if (category || city) {
      const professionalName = category ? professions.find(p => p.id === category)?.label || "" : "";
      navigate(`/search?profession=${category}&location=${city}${professionalName ? `&displayName=${encodeURIComponent(professionalName)}` : ''}`);
    }
  };

  return (
    <Card className={`glass-card bg-blue-50/70 overflow-hidden animate-fade-in-up w-full max-w-xl mx-auto ${className}`} aria-labelledby="location-search-form-title">
      <div className="p-5 md:p-6">
        <h2 id="location-search-form-title" className="text-xl font-bold text-blue-700 mb-4">
          <span className="text-blue-500">חיפוש</span> {title}
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
          <div className="space-y-2 md:col-span-3">
            <Label htmlFor="category" className="text-gray-700">קטגוריה</Label>
            <Popover open={openCategory} onOpenChange={setOpenCategory}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={openCategory}
                  className="w-full justify-between text-right pl-10 relative"
                >
                  {category ? professions.find(cat => cat.id === category)?.label || "בחר קטגוריה" : "בחר קטגוריה"}
                  <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0 z-[200]" align="start">
                <Command dir="rtl">
                  <CommandInput 
                    placeholder="חפש קטגוריה..." 
                    value={categorySearchTerm}
                    onValueChange={setCategorySearchTerm}
                  />
                  <CommandEmpty>לא נמצאו תוצאות</CommandEmpty>
                  <CommandList className="max-h-[300px] overflow-y-auto">
                    <CommandGroup>
                      {filteredCategories.map(cat => (
                        <CommandItem
                          key={cat.id}
                          value={cat.id}
                          onSelect={() => {
                            setCategory(cat.id);
                            setCategorySearchTerm('');
                            setOpenCategory(false);
                          }}
                          className="flex items-center justify-between cursor-pointer"
                        >
                          {cat.label}
                          {cat.id === category && <Check className="ml-2 h-4 w-4" />}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2 md:col-span-3">
            <Label htmlFor="city" className="text-gray-700">עיר</Label>
            <Popover open={openCity} onOpenChange={setOpenCity}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={openCity}
                  className="w-full justify-between text-right pl-10 relative"
                >
                  {city ? israelLocations.find(c => c.id === city)?.label || "בחר עיר" : "בחר עיר"}
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0 z-[200]" align="start">
                <Command dir="rtl">
                  <CommandInput 
                    placeholder="חפש עיר..." 
                    value={citySearchTerm}
                    onValueChange={setCitySearchTerm}
                  />
                  <CommandEmpty>לא נמצאו תוצאות</CommandEmpty>
                  <CommandList className="max-h-[300px] overflow-y-auto">
                    <CommandGroup>
                      {filteredCities.map(c => (
                        <CommandItem
                          key={c.id}
                          value={c.id}
                          onSelect={() => {
                            setCity(c.id);
                            setCitySearchTerm('');
                            setOpenCity(false);
                          }}
                          className="flex items-center justify-between cursor-pointer"
                        >
                          {c.label}
                          {c.id === city && <Check className="ml-2 h-4 w-4" />}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          <div className="flex items-end md:col-span-1">
            <Button
              type="button"
              onClick={handleSearch}
              className="w-full bg-blue-600 hover:bg-blue-700 h-10 flex items-center justify-between"
              aria-label="חיפוש בעלי מקצוע לפי קטגוריה ועיר"
            >
              <Search size={18} />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default DynamicSearchComponent;
