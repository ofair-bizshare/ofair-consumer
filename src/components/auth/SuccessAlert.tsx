
import React from 'react';

interface SuccessAlertProps {
  message: string;
  submessage: string;
}

const SuccessAlert: React.FC<SuccessAlertProps> = ({ message, submessage }) => {
  return (
    <div className="bg-teal-50 border border-teal-200 rounded-lg p-4 mb-6 text-teal-700 text-sm animate-fade-in-down">
      <p className="font-medium">{message}</p>
      <p>{submessage}</p>
    </div>
  );
};

export default SuccessAlert;
