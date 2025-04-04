
import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SearchBar from '@/components/SearchBar';
import ProfessionalCard from '@/components/ProfessionalCard';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Filter, Check, Star, Award } from 'lucide-react';
import { fetchProfessionals } from '@/services/professionals';
import { ProfessionalInterface } from '@/types/dashboard';
import { getProfessionalCategoryLabel } from '@/services/admin/utils/adminCache';

// Dynamic specialties mapping by category - we'll later populate this from the database
const specialtiesByCategory = {
  'electricity': ['תיקוני חשמל', 'התקנות', 'תאורה', 'חשמל חכם', 'לוחות חשמל'],
  'plumbing': ['אינסטלציה כללית', 'פתיחת סתימות', 'ברזים וברזיות', 'דודי שמש', 'ביוב'],
  'renovations': ['שיפוצים כלליים', 'ריצוף', 'גבס', 'צביעה', 'עבודות בטון'],
  'carpentry': ['ארונות', 'מטבחים', 'רהיטים', 'דלתות', 'פרקט'],
  'architecture': ['תכנון אדריכלי', 'תכנון דירות', 'בנייה ירוקה', 'עיצוב פנים', 'הדמיות'],
  'interior_design': ['עיצוב דירות', 'תכנון חללים', 'צביעה', 'עיצוב מטבחים', 'אבזור'],
  'all': ['תיקוני חשמל', 'שיפוצים כלליים', 'אינסטלציה כללית', 'ארונות', 'צביעה', 'עיצוב פנים', 'תכנון אדריכלי', 'גבס']
};

const Search = () => {
  const [allProfessionals, setAllProfessionals] = useState<ProfessionalInterface[]>([]);
  const [professionals, setProfessionals] = useState<ProfessionalInterface[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [availableSpecialties, setAvailableSpecialties] = useState(specialtiesByCategory.all);
  const [sortOption, setSortOption] = useState('rating');
  const [filters, setFilters] = useState({
    verified: false,
    minRating: [4],
    categories: [] as string[],
  });

  // Fetch professionals from database
  useEffect(() => {
    const getProfessionals = async () => {
      try {
        setLoading(true);
        const data = await fetchProfessionals();
        setAllProfessionals(data);
        setProfessionals(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching professionals:', err);
        setError('שגיאה בטעינת בעלי המקצוע. אנא נסה שוב מאוחר יותר.');
        setLoading(false);
      }
    };

    getProfessionals();
  }, []);

  // Update available specialties when category changes
  useEffect(() => {
    if (selectedCategory in specialtiesByCategory) {
      setAvailableSpecialties(specialtiesByCategory[selectedCategory as keyof typeof specialtiesByCategory]);
      
      // Clear selected specialties that are no longer available
      setFilters(prev => ({
        ...prev,
        categories: prev.categories.filter(cat => 
          specialtiesByCategory[selectedCategory as keyof typeof specialtiesByCategory].includes(cat)
        )
      }));
    } else {
      setAvailableSpecialties(specialtiesByCategory.all);
    }
  }, [selectedCategory]);

  const handleSearch = (profession: string, location: string) => {
    setSelectedCategory(profession);
    setSelectedLocation(location);
    
    let filtered = [...allProfessionals];
    
    // Filter by profession
    if (profession !== 'all') {
      filtered = filtered.filter(p => p.category === profession);
    }
    
    // Filter by location
    if (location !== 'all') {
      filtered = filtered.filter(p => p.area === location);
    }
    
    // Apply additional filters
    applyFilters(filtered);
  };
  
  const applyFilters = (baseList = [...allProfessionals]) => {
    let filtered = [...baseList];
    
    // If selected category is applied
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }
    
    // If selected location is applied
    if (selectedLocation !== 'all') {
      filtered = filtered.filter(p => p.area === selectedLocation);
    }
    
    // Apply verification filter
    if (filters.verified) {
      filtered = filtered.filter(p => p.verified);
    }
    
    // Apply rating filter
    if (filters.minRating[0] > 0) {
      filtered = filtered.filter(p => p.rating >= filters.minRating[0]);
    }
    
    // Apply specialties filter
    if (filters.categories.length > 0) {
      filtered = filtered.filter(p => 
        filters.categories.some(cat => p.specialties && p.specialties.includes(cat))
      );
    }
    
    // Apply sorting
    sortProfessionals(filtered);
  };
  
  const sortProfessionals = (list = professionals) => {
    let sorted = [...list];
    
    switch (sortOption) {
      case 'rating':
        sorted.sort((a, b) => b.rating - a.rating);
        break;
      case 'popularity':
        sorted.sort((a, b) => b.reviewCount - a.reviewCount);
        break;
      case 'name_asc':
        sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name_desc':
        sorted.sort((a, b) => b.name.localeCompare(a.name));
        break;
      default:
        // Default is rating
        sorted.sort((a, b) => b.rating - a.rating);
    }
    
    setProfessionals(sorted);
  };
  
  const toggleCategory = (category: string) => {
    setFilters(prev => {
      const categories = prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category];
      
      return { ...prev, categories };
    });
  };
  
  const handleFilterApply = () => {
    applyFilters();
    setMobileFiltersOpen(false);
  };
  
  const resetFilters = () => {
    setFilters({
      verified: false,
      minRating: [4],
      categories: [],
    });
    
    applyFilters();
  };
  
  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOption(e.target.value);
    sortProfessionals();
  };
  
  // Apply initial filters and sorting
  useEffect(() => {
    if (allProfessionals.length > 0) {
      applyFilters();
    }
  }, [filters, sortOption, allProfessionals]);
  
  // This simulates a user revealing a phone number
  const handlePhoneReveal = (professionalName: string) => {
    console.log(`Phone revealed for: ${professionalName}`);
    return true;
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex flex-col min-h-screen" dir="rtl">
        <Header />
        <main className="flex-grow flex items-center justify-center pt-28">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700 mx-auto mb-4"></div>
            <p className="text-gray-600">טוען בעלי מקצוע...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex flex-col min-h-screen" dir="rtl">
        <Header />
        <main className="flex-grow flex items-center justify-center pt-28">
          <div className="text-center">
            <div className="text-red-500 text-5xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">שגיאה בטעינת בעלי המקצוע</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <Button onClick={() => window.location.reload()}>נסה שוב</Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Rest of component
  return (
    <div className="flex flex-col min-h-screen" dir="rtl">
      <Header />
      
      <main className="flex-grow pt-28 pb-16">
        <div className="container mx-auto px-6">
          {/* Hero section */}
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-bold text-blue-700 mb-3">
              חיפוש <span className="text-teal-500">בעלי מקצוע</span>
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              חפשו בין בעלי המקצוע המובילים בתחומם, קראו ביקורות ומצאו את המתאים ביותר לצרכים שלכם
            </p>
          </div>
          
          {/* Search bar */}
          <div className="mb-8 animate-fade-in-up">
            <SearchBar onSearch={handleSearch} useCities={true} />
          </div>
          
          {/* Content grid */}
          <div className="flex flex-col md:flex-row gap-8">
            {/* Sidebar - Desktop */}
            <div className="hidden md:block w-64 flex-shrink-0 animate-fade-in-right">
              <div className="glass-card p-6 sticky top-28">
                <h3 className="text-lg font-semibold text-blue-700 mb-4">סינון תוצאות</h3>
                
                {/* Verified filter */}
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
                
                {/* Rating filter */}
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
                
                {/* Categories */}
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
            
            {/* Mobile filter button */}
            <div className="md:hidden mb-4">
              <Button 
                variant="outline" 
                className="w-full border-gray-300 flex items-center justify-center"
                onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
              >
                <Filter size={16} className="mr-2" />
                סינון תוצאות
              </Button>
              
              {/* Mobile filters panel */}
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
                    
                    {/* Filters content - same as desktop */}
                    <div className="space-y-6 max-h-[60vh] overflow-y-auto">
                      {/* Verified filter */}
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
                      
                      {/* Rating filter */}
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
                      
                      {/* Categories */}
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
            
            {/* Main content */}
            <div className="flex-grow">
              <div className="mb-6 flex justify-between items-center">
                <h2 className="text-xl font-semibold text-blue-700">
                  נמצאו {professionals.length} בעלי מקצוע
                </h2>
                <div className="flex items-center text-sm text-gray-500">
                  <span>מיון לפי: </span>
                  <select 
                    className="appearance-none bg-transparent border-none px-1 font-medium focus:outline-none"
                    value={sortOption}
                    onChange={handleSortChange}
                  >
                    <option value="rating">דירוג</option>
                    <option value="popularity">פופולריות</option>
                    <option value="name_asc">שם א-ת</option>
                    <option value="name_desc">שם ת-א</option>
                  </select>
                </div>
              </div>
              
              {professionals.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 stagger-animation">
                  {professionals.map(professional => (
                    <ProfessionalCard 
                      key={professional.id}
                      id={professional.id}
                      name={professional.name}
                      profession={professional.profession}
                      rating={professional.rating}
                      reviewCount={professional.reviewCount}
                      location={professional.location}
                      image={professional.image || 'https://via.placeholder.com/200?text=No+Image'}
                      specialties={professional.specialties || []}
                      verified={professional.verified}
                      onPhoneReveal={() => handlePhoneReveal(professional.name)}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <Award className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">לא נמצאו תוצאות</h3>
                  <p className="text-gray-500 mb-6">
                    לא נמצאו בעלי מקצוע העונים לקריטריוני החיפוש שלך.
                  </p>
                  <Button 
                    variant="outline" 
                    onClick={resetFilters}
                    className="border-teal-500 text-teal-500 hover:bg-teal-50"
                  >
                    נקה את כל הסינונים
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Search;
