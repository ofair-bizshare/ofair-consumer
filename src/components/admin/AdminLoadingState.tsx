
import React from 'react';

const AdminLoadingState: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
      <p className="mr-2 text-gray-600">בודק הרשאות מנהל...</p>
    </div>
  );
};

export default AdminLoadingState;
