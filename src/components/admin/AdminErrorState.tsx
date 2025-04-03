
import React from 'react';
import { useNavigate } from 'react-router-dom';

interface AdminErrorStateProps {
  errorMessage: string;
}

const AdminErrorState: React.FC<AdminErrorStateProps> = ({ errorMessage }) => {
  const navigate = useNavigate();
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6 max-w-md w-full text-center">
        <h1 className="text-2xl font-bold text-red-700 mb-4">שגיאת בדיקת הרשאות</h1>
        <p className="text-gray-800 mb-4">{errorMessage}</p>
        
        <div className="flex justify-center space-x-3">
          <button
            onClick={() => navigate('/admin-login')}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            לדף התחברות מנהל
          </button>
          
          <button
            onClick={() => navigate('/dashboard')}
            className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
          >
            חזרה לדשבורד
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminErrorState;
