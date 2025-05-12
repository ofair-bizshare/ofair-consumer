
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import DynamicProfessionalSearch from '@/components/DynamicProfessionalSearch';
import SearchHeader from '@/components/search/SearchHeader';
import SearchFilterSidebar from '@/components/search/SearchFilterSidebar';
import SearchMobileFilters from '@/components/search/SearchMobileFilters';
import SearchResults from '@/components/search/SearchResults';
import useSearchProfessionals from '@/hooks/useSearchProfessionals';
import { useIsMobile } from '@/hooks/use-mobile';

const Search = () => {
  const isMobile = useIsMobile();
  
  const {
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
  } = useSearchProfessionals();

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

  if (error) {
    return (
      <div className="flex flex-col min-h-screen" dir="rtl">
        <Header />
        <main className="flex-grow flex items-center justify-center pt-28">
          <div className="text-center">
            <div className="text-red-500 text-5xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">שגיאה בטעינת בעלי המקצוע</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button 
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded"
              onClick={() => window.location.reload()}
            >
              נסה שוב
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen" dir="rtl">
      <Header />
      
      <main className="flex-grow pt-28 pb-16">
        <div className="container mx-auto px-4 sm:px-6">
          <SearchHeader displayProfessionName={displayProfessionName} />
          
          {/* Modified search container with better mobile positioning */}
          <div className={`mb-8 ${isMobile ? 'relative z-20 bg-gray-50 pt-4 pb-6 px-4 -mx-4 shadow-sm rounded-b-lg' : 'sticky top-28 z-30 bg-gray-50 pt-4 pb-6 px-4 -mx-4 shadow-sm rounded-b-lg'}`}>
            <DynamicProfessionalSearch 
              onSearch={handleSearch} 
              initialProfession={selectedCategory === 'all' ? '' : selectedCategory}
              initialLocation={selectedLocation === 'all' ? '' : selectedLocation}
            />
          </div>
          
          <div className="flex flex-col md:flex-row gap-8">
            <SearchFilterSidebar 
              filters={filters}
              setFilters={setFilters}
              availableSpecialties={availableSpecialties}
              handleFilterApply={handleFilterApply}
              resetFilters={resetFilters}
              toggleCategory={toggleCategory}
            />
            
            <div className="flex-grow">
              <SearchMobileFilters 
                mobileFiltersOpen={mobileFiltersOpen}
                setMobileFiltersOpen={setMobileFiltersOpen}
                filters={filters}
                setFilters={setFilters}
                availableSpecialties={availableSpecialties}
                handleFilterApply={handleFilterApply}
                resetFilters={resetFilters}
                toggleCategory={toggleCategory}
              />
              
              <SearchResults 
                professionals={professionals}
                sortOption={sortOption}
                handleSortChange={handleSortChange}
                handlePhoneReveal={handlePhoneReveal}
                resetFilters={resetFilters}
              />
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Search;
