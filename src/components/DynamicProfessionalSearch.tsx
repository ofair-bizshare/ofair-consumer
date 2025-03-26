
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MapPin, Briefcase, Search } from 'lucide-react';

// Professional categories
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

// Cities
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

interface DynamicProfessionalSearchProps {
  className?: string;
}

const DynamicProfessionalSearch: React.FC<DynamicProfessionalSearchProps> = ({ className = '' }) => {
  const [categoryQuery, setCategoryQuery] = useState('');
  const [cityQuery, setCityQuery] = useState('');
  const [filteredCategories, setFilteredCategories] = useState(categories);
  const [filteredCities, setFilteredCities] = useState(cities);
  const [showCategorySuggestions, setShowCategorySuggestions] = useState(false);
  const [showCitySuggestions, setShowCitySuggestions] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const categoryInputRef = useRef<HTMLInputElement>(null);
  const cityInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const filtered = categories.filter(category =>
      category.label.includes(categoryQuery) || 
      category.value.includes(categoryQuery.toLowerCase())
    );
    setFilteredCategories(filtered);
  }, [categoryQuery]);

  useEffect(() => {
    const filtered = cities.filter(city =>
      city.label.includes(cityQuery) || 
      city.value.includes(cityQuery.toLowerCase())
    );
    setFilteredCities(filtered);
  }, [cityQuery]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (categoryInputRef.current && !categoryInputRef.current.contains(event.target as Node)) {
        setShowCategorySuggestions(false);
      }
      if (cityInputRef.current && !cityInputRef.current.contains(event.target as Node)) {
        setShowCitySuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleCategoryClick = (category: { label: string; value: string }) => {
    setCategoryQuery(category.label);
    setSelectedCategory(category.value);
    setShowCategorySuggestions(false);
  };

  const handleCityClick = (city: { label: string; value: string }) => {
    setCityQuery(city.label);
    setSelectedCity(city.value);
    setShowCitySuggestions(false);
  };

  const handleSearch = () => {
    if (selectedCategory && selectedCity) {
      navigate(`/search?category=${selectedCategory}&city=${selectedCity}`);
    }
  };

  return (
    <Card className={`glass-card bg-blue-50/70 overflow-hidden animate-fade-in-up ${className}`} aria-labelledby="dynamic-search-form-title">
      <div className="p-5 md:p-6">
        <h2 id="dynamic-search-form-title" className="text-xl font-bold text-blue-700 mb-4">
          <span className="text-blue-500">חיפוש</span> בעלי מקצוע לפי עיר
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
          <div className="space-y-2 md:col-span-3">
            <Label htmlFor="dynamic-category" className="text-gray-700">קטגוריה</Label>
            <div className="relative" ref={categoryInputRef}>
              <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input
                id="dynamic-category"
                placeholder="בחר קטגוריה"
                value={categoryQuery}
                onChange={(e) => {
                  setCategoryQuery(e.target.value);
                  setShowCategorySuggestions(true);
                  if (e.target.value === '') {
                    setSelectedCategory(null);
                  }
                }}
                onClick={() => setShowCategorySuggestions(true)}
                className="pl-10"
              />
              {showCategorySuggestions && (
                <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md border border-gray-200 max-h-60 overflow-y-auto">
                  {filteredCategories.length > 0 ? (
                    filteredCategories.map((category) => (
                      <div
                        key={category.value}
                        className="px-4 py-2 hover:bg-blue-50 cursor-pointer"
                        onClick={() => handleCategoryClick(category)}
                      >
                        {category.label}
                      </div>
                    ))
                  ) : (
                    <div className="px-4 py-2 text-gray-500">לא נמצאו תוצאות</div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2 md:col-span-3">
            <Label htmlFor="dynamic-city" className="text-gray-700">עיר</Label>
            <div className="relative" ref={cityInputRef}>
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input
                id="dynamic-city"
                placeholder="בחר עיר"
                value={cityQuery}
                onChange={(e) => {
                  setCityQuery(e.target.value);
                  setShowCitySuggestions(true);
                  if (e.target.value === '') {
                    setSelectedCity(null);
                  }
                }}
                onClick={() => setShowCitySuggestions(true)}
                className="pl-10"
              />
              {showCitySuggestions && (
                <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md border border-gray-200 max-h-60 overflow-y-auto">
                  {filteredCities.length > 0 ? (
                    filteredCities.map((city) => (
                      <div
                        key={city.value}
                        className="px-4 py-2 hover:bg-blue-50 cursor-pointer"
                        onClick={() => handleCityClick(city)}
                      >
                        {city.label}
                      </div>
                    ))
                  ) : (
                    <div className="px-4 py-2 text-gray-500">לא נמצאו תוצאות</div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-end md:col-span-1">
            <Button
              type="button"
              onClick={handleSearch}
              className="w-full bg-blue-600 hover:bg-blue-700 h-10"
              aria-label="חיפוש בעלי מקצוע לפי קטגוריה ועיר"
              disabled={!selectedCategory || !selectedCity}
            >
              <Search size={18} />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default DynamicProfessionalSearch;
