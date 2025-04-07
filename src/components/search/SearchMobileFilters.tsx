
import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Check, Filter, Star } from 'lucide-react';

interface SearchMobileFiltersProps {
  mobileFiltersOpen: boolean;
  setMobileFiltersOpen: React.Dispatch<React.SetStateAction<boolean>>;
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

const SearchMobileFilters: React.FC<SearchMobileFiltersProps> = ({
  mobileFiltersOpen,
  setMobileFiltersOpen,
  filters,
  setFilters,
  availableSpecialties,
  handleFilterApply,
  resetFilters,
  toggleCategory
}) => {
  return (
    <div className="md:hidden mb-4">
      <Button 
        variant="outline" 
        className="w-full border-gray-300 flex items-center justify-center"
        onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
      >
        <Filter size={16} className="mr-2" />
        סינון תוצאות
      </Button>
      
      {mobileFiltersOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 animate-fade-in">
          <div className="absolute bottom-0 right-0 left-0 bg-white rounded-t-xl p-6 animate-fade-in-up">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-blue-700">סינון תוצאות</h3>
              <button 
                className="text-gray-500"
                onClick={() => setMobileFiltersOpen(false)}
              >
                ×
              </button>
            </div>
            
            <div className="space-y-6 max-h-[60vh] overflow-y-auto">
              <div>
                <div className="flex items-center space-x-2 space-x-reverse">
                  <Checkbox 
                    id="verified-mobile" 
                    checked={filters.verified}
                    onCheckedChange={(checked) => 
                      setFilters(prev => ({ ...prev, verified: checked === true }))
                    }
                  />
                  <Label htmlFor="verified-mobile" className="text-gray-700 cursor-pointer flex items-center">
                    <Check size={16} className="text-teal-500 mr-1" />
                    בעלי מקצוע מאומתים בלבד
                  </Label>
                </div>
              </div>
              
              <div>
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
              
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">תחומי התמחות</h4>
                <div className="space-y-2">
                  {availableSpecialties.map(category => (
                    <div key={category} className="flex items-center space-x-2 space-x-reverse">
                      <Checkbox 
                        id={`category-mobile-${category}`} 
                        checked={filters.categories.includes(category)}
                        onCheckedChange={() => toggleCategory(category)}
                      />
                      <Label htmlFor={`category-mobile-${category}`} className="text-gray-700 cursor-pointer">
                        {category}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="flex gap-2 mt-6">
              <Button 
                onClick={handleFilterApply}
                className="flex-1 bg-teal-500 hover:bg-teal-600 text-white"
              >
                החל סינון
              </Button>
              <Button 
                variant="outline" 
                onClick={resetFilters}
                className="flex-1 border-gray-300 text-gray-600 hover:bg-gray-50"
              >
                אפס
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchMobileFilters;
