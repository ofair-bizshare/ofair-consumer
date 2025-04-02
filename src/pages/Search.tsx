
import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SearchBar from '@/components/SearchBar';
import ProfessionalCard from '@/components/ProfessionalCard';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Filter, Check, Star, Award } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useAuth } from '@/providers/AuthProvider';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

// Sample data for professionals
const allProfessionals = [
  {
    id: '1',
    name: 'אבי כהן',
    profession: 'חשמלאי מוסמך',
    rating: 4.8,
    reviewCount: 124,
    location: 'תל אביב',
    image: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1180&q=80',
    verified: true,
    specialties: ['תיקוני חשמל', 'התקנות', 'תאורה'],
    category: 'electricity',
    area: 'tel_aviv',
  },
  {
    id: '2',
    name: 'מיכל לוי',
    profession: 'מעצבת פנים',
    rating: 4.9,
    reviewCount: 89,
    location: 'רמת גן',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1161&q=80',
    verified: true,
    specialties: ['עיצוב דירות', 'תכנון חללים', 'צביעה'],
    category: 'interior_design',
    area: 'ramat_gan',
  },
  {
    id: '3',
    name: 'יוסי אברהם',
    profession: 'שיפוצניק כללי',
    rating: 4.7,
    reviewCount: 156,
    location: 'ירושלים',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
    verified: false,
    specialties: ['שיפוצים כלליים', 'ריצוף', 'גבס'],
    category: 'renovations',
    area: 'jerusalem',
  },
  {
    id: '4',
    name: 'רונית שטרן',
    profession: 'אדריכלית',
    rating: 5.0,
    reviewCount: 47,
    location: 'חיפה',
    image: 'https://images.unsplash.com/photo-1534751516642-a1af1ef26a56?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=778&q=80',
    verified: true,
    specialties: ['תכנון אדריכלי', 'תכנון דירות', 'בנייה ירוקה'],
    category: 'architecture',
    area: 'haifa',
  },
  {
    id: '5',
    name: 'דוד לוינסון',
    profession: 'אינסטלטור',
    rating: 4.6,
    reviewCount: 112,
    location: 'באר שבע',
    image: 'https://images.unsplash.com/photo-1566753323558-f4e0952af115?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2122&q=80',
    verified: true,
    specialties: ['אינסטלציה כללית', 'פתיחת סתימות', 'ברזים וברזיות'],
    category: 'plumbing',
    area: 'beer_sheva',
  },
  {
    id: '6',
    name: 'שחר גולן',
    profession: 'נגר',
    rating: 4.8,
    reviewCount: 67,
    location: 'הרצליה',
    image: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80',
    verified: false,
    specialties: ['ארונות', 'מטבחים', 'רהיטים'],
    category: 'carpentry',
    area: 'herzliya',
  },
];

// Specialties mapping by profession category
const specialtiesByCategory = {
  electricity: ['תיקוני חשמל', 'התקנות', 'תאורה', 'לוחות חשמל', 'חשמל חכם'],
  plumbing: ['אינסטלציה כללית', 'פתיחת סתימות', 'ברזים וברזיות', 'דודי שמש', 'ביוב'],
  renovations: ['שיפוצים כלליים', 'ריצוף', 'גבס', 'החלפת אמבטיה', 'צביעה'],
  carpentry: ['ארונות', 'מטבחים', 'רהיטים', 'פרקט', 'דלתות'],
  interior_design: ['עיצוב דירות', 'תכנון חללים', 'צביעה', 'הום סטיילינג', 'אביזרים'],
  architecture: ['תכנון אדריכלי', 'תכנון דירות', 'בנייה ירוקה', 'היתרי בנייה', 'הרחבות'],
  all: ['תיקוני חשמל', 'שיפוצים כלליים', 'אינסטלציה כללית', 'ארונות', 'צביעה', 'תכנון אדריכלי']
};

const Search = () => {
  const [professionals, setProfessionals] = useState(allProfessionals);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [filters, setFilters] = useState({
    verified: false,
    minRating: [4],
    categories: [] as string[],
    sortBy: 'rating'
  });
  const [currentCategory, setCurrentCategory] = useState<string>('all');
  const [currentCity, setCurrentCity] = useState<string>('all');
  const [specialtiesList, setSpecialtiesList] = useState<string[]>(specialtiesByCategory.all);
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Update specialties list when category changes
  useEffect(() => {
    if (currentCategory in specialtiesByCategory) {
      setSpecialtiesList(specialtiesByCategory[currentCategory as keyof typeof specialtiesByCategory]);
      // Reset categories filter when category changes
      setFilters(prev => ({ ...prev, categories: [] }));
    }
  }, [currentCategory]);

  const handleSearch = (profession: string, location: string) => {
    let filtered = [...allProfessionals];
    
    setCurrentCategory(profession);
    setCurrentCity(location);
    
    // Filter by profession
    if (profession !== 'all') {
      filtered = filtered.filter(p => p.category === profession);
    }
    
    // Filter by location
    if (location !== 'all') {
      filtered = filtered.filter(p => p.area === location);
    }
    
    // Apply additional filters
    if (filters.verified) {
      filtered = filtered.filter(p => p.verified);
    }
    
    if (filters.minRating[0] > 0) {
      filtered = filtered.filter(p => p.rating >= filters.minRating[0]);
    }
    
    if (filters.categories.length > 0) {
      filtered = filtered.filter(p => 
        filters.categories.some(cat => p.specialties.includes(cat))
      );
    }
    
    // Apply sorting
    switch (filters.sortBy) {
      case 'rating':
        filtered = filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'reviews':
        filtered = filtered.sort((a, b) => b.reviewCount - a.reviewCount);
        break;
      case 'name':
        filtered = filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
    }
    
    setProfessionals(filtered);
  };
  
  const toggleCategory = (category: string) => {
    setFilters(prev => {
      const categories = prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category];
      
      return { ...prev, categories };
    });
  };
  
  const applyFilters = () => {
    handleSearch(currentCategory, currentCity);
    setMobileFiltersOpen(false);
  };
  
  const resetFilters = () => {
    setFilters({
      verified: false,
      minRating: [4],
      categories: [],
      sortBy: 'rating'
    });
    setProfessionals(allProfessionals);
  };
  
  const handleSortChange = (value: string) => {
    setFilters(prev => ({ ...prev, sortBy: value }));
    
    // Apply the sorting immediately
    let sorted = [...professionals];
    switch (value) {
      case 'rating':
        sorted = sorted.sort((a, b) => b.rating - a.rating);
        break;
      case 'reviews':
        sorted = sorted.sort((a, b) => b.reviewCount - a.reviewCount);
        break;
      case 'name':
        sorted = sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;
    }
    
    setProfessionals(sorted);
  };
  
  const handleLoginRedirect = () => {
    setShowLoginDialog(false);
    navigate('/login', { state: { returnUrl: window.location.pathname } });
  };
  
  const phoneRevealRequiresLogin = (professionalName: string) => {
    if (!user) {
      setShowLoginDialog(true);
      return false;
    }
    return true;
  };

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
                    {specialtiesList.map(category => (
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
                    onClick={applyFilters}
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
                          {specialtiesList.map(category => (
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
                        onClick={applyFilters}
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
                  <Select value={filters.sortBy} onValueChange={handleSortChange}>
                    <SelectTrigger className="border-none px-1 font-medium focus:outline-none bg-transparent w-24 ml-2">
                      <SelectValue placeholder="דירוג" />
                    </SelectTrigger>
                    <SelectContent className="z-[100] bg-white">
                      <SelectItem value="rating">דירוג</SelectItem>
                      <SelectItem value="reviews">פופולריות</SelectItem>
                      <SelectItem value="name">שם א-ת</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              {professionals.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 stagger-animation">
                  {professionals.map(professional => (
                    <ProfessionalCard 
                      key={professional.id}
                      {...professional}
                      onPhoneReveal={phoneRevealRequiresLogin}
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
      
      {/* Login Requirement Dialog */}
      <Dialog open={showLoginDialog} onOpenChange={setShowLoginDialog}>
        <DialogContent className="sm:max-w-[425px]" dir="rtl">
          <DialogTitle className="text-center mb-4">התחברות נדרשת</DialogTitle>
          <div className="text-center mb-6">
            <p className="mb-4">עליך להתחבר כדי לצפות בפרטי ההתקשרות של בעלי המקצוע</p>
            <Button 
              className="bg-blue-600 hover:bg-blue-700"
              onClick={handleLoginRedirect}
            >
              התחבר עכשיו
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Search;
