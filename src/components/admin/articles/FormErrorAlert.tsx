
import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

interface FormErrorAlertProps {
  error: string | null;
  className?: string;
}

const FormErrorAlert: React.FC<FormErrorAlertProps> = ({ error, className = '' }) => {
  if (!error) return null;
  
  return (
    <Alert variant="destructive" className={className}>
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>שגיאה</AlertTitle>
      <AlertDescription>{error}</AlertDescription>
    </Alert>
  );
};

export default FormErrorAlert;
