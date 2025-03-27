
import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

const FAQHeader = () => {
  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-blue-700 mb-2">
          <span className="text-[#00D09E]">שאלות</span> נפוצות
        </h1>
        <p className="text-gray-600 max-w-2xl">
          מצאת את עצמך עם שאלה? ייתכן שמישהו כבר שאל אותה לפניך. כאן תמצא תשובות לשאלות הנפוצות ביותר.
        </p>
      </div>
      
      <div className="mb-10">
        <div className="relative max-w-xl">
          <Input 
            className="pr-10" 
            placeholder="חפש שאלה..." 
            aria-label="חיפוש שאלות נפוצות"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        </div>
      </div>
    </>
  );
};

export default FAQHeader;
