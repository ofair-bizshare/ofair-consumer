
import React from 'react';
import DynamicProfessionalSearch from '@/components/DynamicProfessionalSearch';

interface SearchSectionProps {
  onSearchSubmit: (profession: string, location: string) => void;
}

const SearchSection: React.FC<SearchSectionProps> = ({ onSearchSubmit }) => {
  return (
    <section className="py-16 bg-gradient-to-br from-gray-50 to-blue-50 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-white to-transparent"></div>
      <div className="absolute -bottom-16 -left-16 w-32 h-32 bg-blue-400 rounded-full opacity-10"></div>
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-teal-400 rounded-full opacity-10"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-blue-700 mb-3">חיפוש <span className="text-custom-green">מתקדם</span></h2>
          <p className="text-gray-600 max-w-2xl mx-auto">מצא בעלי מקצוע מובילים בתחומם באזור שלך בקלות ובמהירות</p>
        </div>
        <div className="animate-fade-in">
          <DynamicProfessionalSearch onSearch={onSearchSubmit} />
        </div>
        {/* Visual element - professionals illustration */}
        <div className="flex justify-center mt-12">
          <img 
            src="https://images.unsplash.com/photo-1556912172-45518114e8a5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80" 
            alt="בעלי מקצוע מובילים" 
            className="rounded-lg shadow-lg max-w-full h-auto max-h-96 object-cover"
          />
        </div>
      </div>
    </section>
  );
};

export default SearchSection;
