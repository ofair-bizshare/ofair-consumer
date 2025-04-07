
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { ProfessionalInterface } from '@/types/dashboard';
import { getProfessionals } from '@/services/professionals';
import { specialtiesByCategory } from '@/utils/professionData';

const useSearchProfessionals = () => {
  const [allProfessionals, setAllProfessionals] = useState<ProfessionalInterface[]>([]);
  const [professionals, setProfessionals] = useState<ProfessionalInterface[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [displayProfessionName, setDisplayProfessionName] = useState('');
  const [availableSpecialties, setAvailableSpecialties] = useState(specialtiesByCategory.all);
  const [sortOption, setSortOption] = useState('rating');
  const [filters, setFilters] = useState({
    verified: false,
    minRating: [4],
    categories: [] as string[],
  });

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const professionParam = queryParams.get('profession');
  const locationParam = queryParams.get('location');
  const displayNameParam = queryParams.get('displayName');

  // Fetch professionals data
  useEffect(() => {
    const fetchProfessionalsData = async () => {
      try {
        setLoading(true);
        const data = await getProfessionals();
        setAllProfessionals(data);
        setProfessionals(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching professionals:', err);
        setError('שגיאה בטעינת בעלי המקצוע. אנא נסה שוב מאוחר יותר.');
        setLoading(false);
      }
    };

    fetchProfessionalsData();
  }, []);

  // Handle URL query params
  useEffect(() => {
    if (!loading && allProfessionals.length > 0) {
      if (professionParam || locationParam) {
        const profession = professionParam || 'all';
        const location = locationParam || 'all';
        
        setSelectedCategory(profession);
        setSelectedLocation(location);
        
        if (displayNameParam) {
          setDisplayProfessionName(decodeURIComponent(displayNameParam));
        }
        
        handleSearch(profession, location);
      }
    }
  }, [loading, allProfessionals, professionParam, locationParam, displayNameParam]);

  // Update available specialties when category changes
  useEffect(() => {
    if (selectedCategory in specialtiesByCategory) {
      setAvailableSpecialties(specialtiesByCategory[selectedCategory as keyof typeof specialtiesByCategory]);
      
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

  // Apply filters when filters or sort option changes
  useEffect(() => {
    if (allProfessionals.length > 0) {
      applyFilters();
    }
  }, [filters, sortOption, allProfessionals]);

  const handleSearch = (profession: string, location: string) => {
    setSelectedCategory(profession);
    setSelectedLocation(location);
    
    let filtered = [...allProfessionals];
    
    if (profession !== 'all') {
      filtered = filtered.filter(p => p.category === profession);
    }
    
    if (location !== 'all') {
      filtered = filtered.filter(p => p.area === location);
    }
    
    applyFilters(filtered);
  };
  
  const applyFilters = (baseList = [...allProfessionals]) => {
    let filtered = [...baseList];
    
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }
    
    if (selectedLocation !== 'all') {
      filtered = filtered.filter(p => p.area === selectedLocation);
    }
    
    if (filters.verified) {
      filtered = filtered.filter(p => p.verified);
    }
    
    if (filters.minRating[0] > 0) {
      filtered = filtered.filter(p => p.rating >= filters.minRating[0]);
    }
    
    if (filters.categories.length > 0) {
      filtered = filtered.filter(p => 
        filters.categories.some(cat => p.specialties && p.specialties.includes(cat))
      );
    }
    
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
  
  const handlePhoneReveal = (professionalName: string) => {
    console.log(`Phone revealed for: ${professionalName}`);
    return true;
  };

  return {
    professionals,
    loading,
    error,
    mobileFiltersOpen,
    setMobileFiltersOpen,
    selectedCategory,
    selectedLocation,
    displayProfessionName,
    availableSpecialties,
    sortOption,
    filters,
    setFilters,
    handleSearch,
    toggleCategory,
    handleFilterApply,
    resetFilters,
    handleSortChange,
    handlePhoneReveal
  };
};

export default useSearchProfessionals;
