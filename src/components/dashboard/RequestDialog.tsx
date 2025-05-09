
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import RequestForm from '@/components/RequestForm';
import { ScrollArea } from "@/components/ui/scroll-area";
import { useIsMobile } from '@/hooks/use-mobile';

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
  const isMobile = useIsMobile();

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
      <DialogContent className="sm:max-w-[600px] max-h-[90vh]" dir="rtl">
        <DialogHeader>
          <DialogTitle className="text-xl">יצירת בקשה חדשה</DialogTitle>
        </DialogHeader>
        <ScrollArea className={`${isMobile ? 'h-[60vh]' : 'h-[70vh]'} pr-2`}>
          <div className="py-4">
            <RequestForm onSuccess={handleSuccess} />
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default RequestDialog;
