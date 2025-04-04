
import React from 'react';
import { Button } from '@/components/ui/button';

interface RequestFormActionsProps {
  onClose?: () => void;
  isSubmitting: boolean;
}

const RequestFormActions: React.FC<RequestFormActionsProps> = ({ 
  onClose, 
  isSubmitting 
}) => {
  return (
    <div className="flex justify-end gap-2 pt-4">
      {onClose && (
        <Button 
          type="button" 
          variant="outline" 
          onClick={onClose}
          disabled={isSubmitting}
        >
          ביטול
        </Button>
      )}
      <Button 
        type="submit"
        disabled={isSubmitting}
      >
        {isSubmitting ? 'שולח...' : 'שלח בקשה'}
      </Button>
    </div>
  );
};

export default RequestFormActions;
