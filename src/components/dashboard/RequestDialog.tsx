import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import RequestForm from '@/components/RequestForm';
import { ScrollArea } from "@/components/ui/scroll-area";
import { useIsMobile } from '@/hooks/use-mobile';
interface RequestDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onRequestCreated?: () => Promise<void>;
}
const RequestDialog: React.FC<RequestDialogProps> = ({
  isOpen,
  onOpenChange,
  onRequestCreated
}) => {
  const isMobile = useIsMobile();
  const handleSuccess = async () => {
    onOpenChange(false);
    if (onRequestCreated) {
      await onRequestCreated();
    }
  };
  return <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent dir="rtl" className="sm:max-w-[600px] max-h-[90vh] p-0 overflow-hidden w-[95%] mx-auto bg-slate-50">
        <DialogHeader className="p-4 pb-0">
          <DialogTitle className="text-xl">יצירת בקשה חדשה</DialogTitle>
        </DialogHeader>
        <ScrollArea className={`${isMobile ? 'h-[50vh]' : 'h-[65vh]'} w-full`}>
          <div className="p-4 bg-gray-50">
            <RequestForm onSuccess={handleSuccess} />
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>;
};
export default RequestDialog;
