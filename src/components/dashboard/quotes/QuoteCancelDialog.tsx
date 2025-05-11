
import React from 'react';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction
} from '@/components/ui/alert-dialog';

interface QuoteCancelDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

const QuoteCancelDialog: React.FC<QuoteCancelDialogProps> = ({
  open,
  onOpenChange,
  onConfirm
}) => {
  console.log("QuoteCancelDialog rendered, open:", open);
  
  const handleConfirm = () => {
    console.log("Cancel confirmation clicked");
    onConfirm();
    onOpenChange(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent dir="rtl">
        <AlertDialogTitle>האם אתה בטוח שברצונך לבטל את קבלת ההצעה?</AlertDialogTitle>
        <AlertDialogDescription>
          ביטול קבלת ההצעה יודיע לבעל המקצוע שההצעה נדחתה. ניתן לבחור הצעה אחרת לאחר מכן.
        </AlertDialogDescription>
        <div className="flex justify-end gap-3 mt-4">
          <AlertDialogCancel>ביטול</AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirm} className="bg-red-500 hover:bg-red-600">
            כן, בטל את קבלת ההצעה
          </AlertDialogAction>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default QuoteCancelDialog;
