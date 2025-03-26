
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { MapPin, Briefcase, Search } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

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
  const navigate = useNavigate();

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
            <div className="relative">
              <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Select 
                onValueChange={setCategory}
                value={category}
              >
                <SelectTrigger className="pl-10" id="category">
                  <SelectValue placeholder="בחר קטגוריה" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(cat => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2 md:col-span-3">
            <Label htmlFor="city" className="text-gray-700">עיר</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Select 
                onValueChange={setCity}
                value={city}
              >
                <SelectTrigger className="pl-10" id="city">
                  <SelectValue placeholder="בחר עיר" />
                </SelectTrigger>
                <SelectContent>
                  {cities.map(c => (
                    <SelectItem key={c.value} value={c.value}>
                      {c.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-end md:col-span-1">
            <Button
              type="button"
              onClick={handleSearch}
              className="w-full bg-blue-600 hover:bg-blue-700 h-10"
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
