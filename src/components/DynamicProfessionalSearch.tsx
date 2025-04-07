
import React, { useState } from 'react';
import SearchBar from '@/components/SearchBar';

interface DynamicProfessionalSearchProps {
  onSearch?: (profession: string, location: string) => void;
}

const DynamicProfessionalSearch: React.FC<DynamicProfessionalSearchProps> = ({ onSearch }) => {
  const handleSearch = (profession: string, location: string) => {
    if (onSearch) {
      onSearch(profession, location);
    }
  };

  return (
    <div>
      <SearchBar onSearch={handleSearch} useCities={true} />
    </div>
  );
};

export default DynamicProfessionalSearch;
