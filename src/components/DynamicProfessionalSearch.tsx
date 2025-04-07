
import React from 'react';
import SearchBar from '@/components/SearchBar';

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
      <SearchBar 
        onSearch={handleSearch} 
        useCities={true}
        initialProfession={initialProfession}
        initialLocation={initialLocation}
      />
    </div>
  );
};

export default DynamicProfessionalSearch;
