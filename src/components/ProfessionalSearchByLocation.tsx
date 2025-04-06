
import React, { useState, useEffect } from 'react';
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
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import { useDebounce } from '@/hooks/useDebounce';

const categories = [
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

const cities = [
  { label: 'תל אביב', value: 'tel_aviv' },
  { label: 'ירושלים', value: 'jerusalem' },
  { label: 'חיפה', value: 'haifa' },
  { label: 'באר שבע', value: 'beer_sheva' },
  { label: 'נתניה', value: 'netanya' },
  { label: 'חולון', value: 'holon' },
  { label: 'רמת גן', value: 'ramat_gan' },
  { label: 'ראשון לציון', value: 'rishon' },
  { label: 'פתח תקווה', value: 'petah_tikva' },
  { label: 'אשדוד', value: 'ashdod' },
];

const ProfessionalSearchByLocation = () => {
  const [category, setCategory] = useState('');
  const [city, setCity] = useState('');
  const [openCategory, setOpenCategory] = useState(false);
  const [openCity, setOpenCity] = useState(false);
  const [categorySearchTerm, setCategorySearchTerm] = useState('');
  const [citySearchTerm, setCitySearchTerm] = useState('');
  const [filteredCategories, setFilteredCategories] = useState(categories);
  const [filteredCities, setFilteredCities] = useState(cities);
  
  const debouncedCategorySearch = useDebounce(categorySearchTerm, 300);
  const debouncedCitySearch = useDebounce(citySearchTerm, 300);
  
  const navigate = useNavigate();

  // Filter categories based on search term
  useEffect(() => {
    if (debouncedCategorySearch) {
      const filtered = categories.filter(cat => 
        cat.label.toLowerCase().includes(debouncedCategorySearch.toLowerCase())
      );
      setFilteredCategories(filtered);
    } else {
      setFilteredCategories(categories);
    }
  }, [debouncedCategorySearch]);

  // Filter cities based on search term
  useEffect(() => {
    if (debouncedCitySearch) {
      const filtered = cities.filter(c => 
        c.label.toLowerCase().includes(debouncedCitySearch.toLowerCase())
      );
      setFilteredCities(filtered);
    } else {
      setFilteredCities(cities);
    }
  }, [debouncedCitySearch]);

  const handleSearch = () => {
    if (category && city) {
      navigate(`/search?category=${category}&city=${city}`);
    }
  };

  return (
    <Card className="glass-card bg-blue-50/70 overflow-hidden animate-fade-in-up w-full max-w-xl mx-auto mt-6" aria-labelledby="location-search-form-title">
      <div className="p-5 md:p-6">
        <h2 id="location-search-form-title" className="text-xl font-bold text-blue-700 mb-4">
          <span className="text-blue-500">חיפוש</span> בעלי מקצוע לפי עיר
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
                  {category ? categories.find(cat => cat.value === category)?.label : "בחר קטגוריה"}
                  <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0" align="start">
                <Command dir="rtl">
                  <CommandInput 
                    placeholder="חפש קטגוריה..." 
                    value={categorySearchTerm}
                    onValueChange={setCategorySearchTerm}
                  />
                  <CommandEmpty>לא נמצאו תוצאות</CommandEmpty>
                  <CommandList>
                    <CommandGroup>
                      {filteredCategories.map(cat => (
                        <CommandItem
                          key={cat.value}
                          value={cat.label}
                          onSelect={() => {
                            setCategory(cat.value);
                            setCategorySearchTerm('');
                            setOpenCategory(false);
                          }}
                          className="flex items-center justify-between"
                        >
                          {cat.label}
                          {cat.value === category && <Check className="ml-2 h-4 w-4" />}
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
                  {city ? cities.find(c => c.value === city)?.label : "בחר עיר"}
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0" align="start">
                <Command dir="rtl">
                  <CommandInput 
                    placeholder="חפש עיר..." 
                    value={citySearchTerm}
                    onValueChange={setCitySearchTerm}
                  />
                  <CommandEmpty>לא נמצאו תוצאות</CommandEmpty>
                  <CommandList>
                    <CommandGroup>
                      {filteredCities.map(c => (
                        <CommandItem
                          key={c.value}
                          value={c.label}
                          onSelect={() => {
                            setCity(c.value);
                            setCitySearchTerm('');
                            setOpenCity(false);
                          }}
                          className="flex items-center justify-between"
                        >
                          {c.label}
                          {c.value === city && <Check className="ml-2 h-4 w-4" />}
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

export default ProfessionalSearchByLocation;
