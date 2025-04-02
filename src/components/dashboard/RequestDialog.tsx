
import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import RequestForm from '@/components/RequestForm';

interface RequestDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  triggerClassName?: string;
  triggerLabel?: string;
}

const RequestDialog: React.FC<RequestDialogProps> = ({ 
  isOpen, 
  onOpenChange,
  triggerClassName = "text-white bg-[#00D09E] hover:bg-[#00C090] text-sm font-medium",
  triggerLabel = "בקשה חדשה +"
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button className={triggerClassName}>
          {triggerLabel}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto" dir="rtl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">שליחת פנייה לבעלי מקצוע</DialogTitle>
          <DialogDescription>
            מלא את הפרטים כדי ליצור פנייה חדשה לבעלי מקצוע
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <RequestForm onSuccess={() => onOpenChange(false)} saveToRequests={true} />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RequestDialog;
