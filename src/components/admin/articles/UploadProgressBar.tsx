
import React from 'react';

interface UploadProgressBarProps {
  progress: number;
  isVisible: boolean;
}

const UploadProgressBar: React.FC<UploadProgressBarProps> = ({ progress, isVisible }) => {
  if (!isVisible) return null;
  
  return (
    <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
      <div 
        className="bg-blue-600 h-2.5 rounded-full transition-all duration-300 ease-in-out" 
        style={{ width: `${progress}%` }}
      >
        <span className="sr-only">{progress}% Complete</span>
      </div>
      <p className="text-xs text-gray-500 mt-1 text-right">{progress}% uploaded</p>
    </div>
  );
};

export default UploadProgressBar;
