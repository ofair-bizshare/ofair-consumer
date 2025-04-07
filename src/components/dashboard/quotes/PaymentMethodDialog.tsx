
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CreditCard, Banknote } from 'lucide-react';

interface PaymentMethodDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectPaymentMethod: (method: 'cash' | 'credit') => void;
  quotePrice: string;
}

const PaymentMethodDialog: React.FC<PaymentMethodDialogProps> = ({
  open,
  onOpenChange,
  onSelectPaymentMethod,
  quotePrice
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md" dir="rtl">
        <DialogHeader>
          <DialogTitle className="text-center">בחר אמצעי תשלום</DialogTitle>
          <DialogDescription className="text-center">
            הצעה התקבלה! בחר כיצד תרצה לשלם סך {quotePrice}
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-2 gap-4 py-6">
          <Button
            variant="outline"
            className="flex flex-col items-center gap-2 py-6 hover:bg-blue-50 border-blue-200"
            onClick={() => onSelectPaymentMethod('cash')}
          >
            <Banknote className="h-10 w-10 text-green-600" />
            <span className="font-medium">במזומן</span>
            <span className="text-xs text-gray-500">תשלום ישיר לבעל המקצוע</span>
          </Button>
          
          <Button
            variant="outline"
            className="flex flex-col items-center gap-2 py-6 hover:bg-blue-50 border-blue-200"
            onClick={() => onSelectPaymentMethod('credit')}
          >
            <CreditCard className="h-10 w-10 text-blue-600" />
            <span className="font-medium">אשראי</span>
            <span className="text-xs text-gray-500">תשלום מאובטח דרך האתר</span>
          </Button>
        </div>
        
        <DialogFooter className="sm:justify-center">
          <Button
            variant="ghost"
            onClick={() => onOpenChange(false)}
          >
            ביטול
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentMethodDialog;
