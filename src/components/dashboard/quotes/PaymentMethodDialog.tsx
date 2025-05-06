
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
      <DialogContent className="sm:max-w-[450px] p-6" dir="rtl">
        <DialogHeader className="pb-2">
          <DialogTitle className="text-xl font-semibold text-center">בחר אמצעי תשלום</DialogTitle>
          <DialogDescription className="text-center text-base mt-2">
            הצעה התקבלה! בחר כיצד תרצה לשלם סך {quotePrice} ₪
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-2 gap-6 py-8">
          <Button
            variant="outline"
            className="flex flex-col items-center gap-3 py-8 hover:bg-blue-50 border-blue-200"
            onClick={() => onSelectPaymentMethod('cash')}
          >
            <Banknote className="h-12 w-12 text-green-600" />
            <span className="font-medium text-lg">במזומן</span>
            <span className="text-sm text-gray-500">תשלום ישיר לבעל המקצוע</span>
          </Button>
          
          <Button
            variant="outline"
            className="flex flex-col items-center gap-3 py-8 hover:bg-blue-50 border-blue-200"
            onClick={() => onSelectPaymentMethod('credit')}
          >
            <CreditCard className="h-12 w-12 text-blue-600" />
            <span className="font-medium text-lg">אשראי</span>
            <span className="text-sm text-gray-500">תשלום מאובטח דרך האתר</span>
          </Button>
        </div>
        
        <DialogFooter className="sm:justify-center pt-2">
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
