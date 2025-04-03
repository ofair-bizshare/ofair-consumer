
import React from 'react';

const ArticlesLoading: React.FC = () => {
  return (
    <div className="flex justify-center py-8">
      <div className="w-12 h-12 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
    </div>
  );
};

export default ArticlesLoading;
