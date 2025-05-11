import React from 'react';
import DynamicProfessionalSearch from '@/components/DynamicProfessionalSearch';
import { useIsMobile } from '@/hooks/use-mobile';
interface SearchSectionProps {
  onSearchSubmit: (profession: string, location: string) => void;
}
const SearchSection: React.FC<SearchSectionProps> = ({
  onSearchSubmit
}) => {
  const isMobile = useIsMobile();
  return <section className="py-12 md:py-16 bg-gradient-to-br from-gray-50 to-blue-50 relative overflow-hidden w-full">
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-white to-transparent"></div>
      <div className="absolute -bottom-16 -left-16 w-32 h-32 bg-blue-400 rounded-full opacity-10"></div>
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-teal-400 rounded-full opacity-10"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-6 md:mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-blue-700 mb-2 md:mb-3">חיפוש <span className="text-custom-green">מתקדם</span></h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-sm md:text-base">מצא בעלי מקצוע מובילים בתחומם באזור שלך בקלות ובמהירות</p>
        </div>
        <div className="animate-fade-in w-full max-w-full">
          <DynamicProfessionalSearch onSearch={onSearchSubmit} initialProfession="" initialLocation="" />
        </div>
        {/* Visual element - professionals illustration */}
        <div className="flex justify-center mt-8 md:mt-12">
          
        </div>
      </div>
    </section>;
};
export default SearchSection;