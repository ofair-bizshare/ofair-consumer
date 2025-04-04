
import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface FormActionsProps {
  onCancel: () => void;
  isProcessing?: boolean;
  submitText?: string;
}

const FormActions: React.FC<FormActionsProps> = ({
  onCancel,
  isProcessing = false,
  submitText = 'צור מאמר'
}) => {
  return (
    <div className="flex justify-end gap-2 pt-2">
      <Button 
        type="button" 
        variant="outline" 
        onClick={onCancel}
        disabled={isProcessing}
      >
        ביטול
      </Button>
      <Button 
        type="submit"
        disabled={isProcessing}
      >
        {isProcessing && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
        {submitText}
      </Button>
    </div>
  );
};

export default FormActions;
