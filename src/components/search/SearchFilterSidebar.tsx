
import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Check, Star } from 'lucide-react';
import { specialtiesByCategory } from '@/utils/professionData';

interface SearchFilterSidebarProps {
  filters: {
    verified: boolean;
    minRating: number[];
    categories: string[];
  };
  setFilters: React.Dispatch<React.SetStateAction<{
    verified: boolean;
    minRating: number[];
    categories: string[];
  }>>;
  availableSpecialties: string[];
  handleFilterApply: () => void;
  resetFilters: () => void;
  toggleCategory: (category: string) => void;
}

const SearchFilterSidebar: React.FC<SearchFilterSidebarProps> = ({
  filters,
  setFilters,
  availableSpecialties,
  handleFilterApply,
  resetFilters,
  toggleCategory
}) => {
  return (
    <div className="hidden md:block w-64 flex-shrink-0 animate-fade-in-right">
      <div className="glass-card p-6 sticky top-28">
        <h3 className="text-lg font-semibold text-blue-700 mb-4">סינון תוצאות</h3>
        
        <div className="mb-6">
          <div className="flex items-center space-x-2 space-x-reverse">
            <Checkbox 
              id="verified" 
              checked={filters.verified}
              onCheckedChange={(checked) => 
                setFilters(prev => ({ ...prev, verified: checked === true }))
              }
            />
            <Label htmlFor="verified" className="text-gray-700 cursor-pointer flex items-center">
              <Check size={16} className="text-teal-500 mr-1" />
              בעלי מקצוע מאומתים בלבד
            </Label>
          </div>
        </div>
        
        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-700 mb-2">דירוג מינימלי</h4>
          <div className="flex items-center mb-2">
            <div className="flex items-center mr-2">
              {[1, 2, 3, 4, 5].map(star => (
                <Star 
                  key={star} 
                  size={16} 
                  className={`${star <= filters.minRating[0] ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                />
              ))}
            </div>
            <span className="text-sm text-gray-500">({filters.minRating[0]}+)</span>
          </div>
          <Slider
            value={filters.minRating}
            min={0}
            max={5}
            step={0.5}
            onValueChange={(value) => 
              setFilters(prev => ({ ...prev, minRating: value }))
            }
          />
        </div>
        
        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-700 mb-2">תחומי התמחות</h4>
          <div className="space-y-2">
            {availableSpecialties.map(category => (
              <div key={category} className="flex items-center space-x-2 space-x-reverse">
                <Checkbox 
                  id={`category-${category}`} 
                  checked={filters.categories.includes(category)}
                  onCheckedChange={() => toggleCategory(category)}
                />
                <Label htmlFor={`category-${category}`} className="text-gray-700 cursor-pointer">
                  {category}
                </Label>
              </div>
            ))}
          </div>
        </div>
        
        <div className="space-y-2">
          <Button 
            onClick={handleFilterApply}
            className="w-full bg-teal-500 hover:bg-teal-600 text-white"
          >
            החל סינון
          </Button>
          <Button 
            variant="outline" 
            onClick={resetFilters}
            className="w-full border-gray-300 text-gray-600 hover:bg-gray-50"
          >
            אפס סינון
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SearchFilterSidebar;
