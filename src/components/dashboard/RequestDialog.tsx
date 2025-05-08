
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import RequestForm from '@/components/RequestForm';

interface RequestDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onRequestCreated?: () => void;
}

const RequestDialog: React.FC<RequestDialogProps> = ({ 
  isOpen, 
  onOpenChange,
  onRequestCreated
}) => {
  const handleSuccess = () => {
    // Close dialog when request is successfully created
    onOpenChange(false);
    
    // Refresh requests if callback provided
    if (onRequestCreated) {
      onRequestCreated();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]" dir="rtl">
        <DialogHeader>
          <DialogTitle className="text-xl">יצירת בקשה חדשה</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <RequestForm onSuccess={handleSuccess} />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RequestDialog;
