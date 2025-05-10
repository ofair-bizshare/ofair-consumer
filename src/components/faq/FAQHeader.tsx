
import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useIsMobile } from '@/hooks/use-mobile';

const FAQHeader = () => {
  const isMobile = useIsMobile();
  
  return (
    <>
      <div className="mb-6">
        <h1 className={`${isMobile ? 'text-2xl' : 'text-3xl'} font-bold text-blue-700 mb-2`}>
          <span className="text-[#00D09E]">שאלות</span> נפוצות
        </h1>
        <p className="text-gray-600 max-w-2xl text-sm">
          מצאת את עצמך עם שאלה? ייתכן שמישהו כבר שאל אותה לפניך. כאן תמצא תשובות לשאלות הנפוצות ביותר.
        </p>
      </div>
      
      <div className="mb-8">
        <div className={`relative ${isMobile ? 'w-full' : 'max-w-xl'}`}>
          <Input 
            className="pr-10 text-sm" 
            placeholder="חפש שאלה..." 
            aria-label="חיפוש שאלות נפוצות"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
        </div>
      </div>
    </>
  );
};

export default FAQHeader;
