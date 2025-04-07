
import React from 'react';

interface SearchHeaderProps {
  displayProfessionName?: string;
}

const SearchHeader: React.FC<SearchHeaderProps> = ({ displayProfessionName }) => {
  return (
    <div className="text-center mb-10">
      <h1 className="text-3xl md:text-4xl font-bold text-blue-700 mb-3">
        חיפוש <span className="text-teal-500">בעלי מקצוע</span>
        {displayProfessionName && <span className="text-blue-700"> - {displayProfessionName}</span>}
      </h1>
      <p className="text-gray-600 max-w-2xl mx-auto">
        חפשו בין בעלי המקצוע המובילים בתחומם, קראו ביקורות ומצאו את המתאים ביותר לצרכים שלכם
      </p>
    </div>
  );
};

export default SearchHeader;
