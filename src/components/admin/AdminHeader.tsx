
import React from 'react';

const AdminHeader: React.FC = () => {
  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm p-4 border-b dark:border-gray-700">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium">Admin Dashboard</h2>
        <div className="flex items-center space-x-4">
          {/* Add header content here if needed */}
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
