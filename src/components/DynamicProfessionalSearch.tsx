
import React from 'react';
import DynamicSearchComponent from '@/components/DynamicSearchComponent';

interface DynamicProfessionalSearchProps {
  onSearch?: (profession: string, location: string) => void;
  initialProfession?: string;
  initialLocation?: string;
}

const DynamicProfessionalSearch: React.FC<DynamicProfessionalSearchProps> = ({ 
  onSearch,
  initialProfession = "",
  initialLocation = ""
}) => {
  const handleSearch = (profession: string, location: string) => {
    if (onSearch) {
      onSearch(profession, location);
    }
  };

  return (
    <div>
      <DynamicSearchComponent 
        onSearch={handleSearch} 
        initialProfession={initialProfession}
        initialLocation={initialLocation}
      />
    </div>
  );
};

export default DynamicProfessionalSearch;
