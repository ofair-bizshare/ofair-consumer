
import React from 'react';
import { Button } from '@/components/ui/button';

interface FormActionsProps {
  onCancel: () => void;
  isProcessing: boolean;
}

const FormActions: React.FC<FormActionsProps> = ({ onCancel, isProcessing }) => {
  return (
    <div className="flex justify-end mt-4">
      <Button 
        type="button" 
        variant="outline" 
        onClick={onCancel}
        className="mr-2"
        disabled={isProcessing}
      >
        ביטול
      </Button>
      <Button type="submit" disabled={isProcessing}>
        {isProcessing ? 'מעלה...' : 'הוסף מאמר'}
      </Button>
    </div>
  );
};

export default FormActions;
