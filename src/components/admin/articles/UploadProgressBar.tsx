
import React from 'react';

interface UploadProgressBarProps {
  progress: number;
  isVisible: boolean;
}

const UploadProgressBar: React.FC<UploadProgressBarProps> = ({ progress, isVisible }) => {
  if (!isVisible) return null;
  
  return (
    <div className="w-full bg-gray-200 rounded-full h-2.5">
      <div 
        className="bg-blue-600 h-2.5 rounded-full" 
        style={{ width: `${progress}%` }}
      ></div>
    </div>
  );
};

export default UploadProgressBar;
