
import React from 'react';
import { Dialog, DialogContent, DialogTitle, DialogHeader, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CreditCard, Banknote } from 'lucide-react';

interface PaymentMethodDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectPaymentMethod: (method: 'cash' | 'credit') => void;
  quotePrice?: string;
}

const PaymentMethodDialog: React.FC<PaymentMethodDialogProps> = ({
  open,
  onOpenChange,
  onSelectPaymentMethod,
  quotePrice = "0"
}) => {
  // Ensure the price is properly formatted as a string with a default value
  const formattedPrice = typeof quotePrice === 'string' && quotePrice.length > 0
    ? quotePrice
    : typeof quotePrice === 'number'
      ? String(quotePrice)
      : "0";
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-right">בחר אמצעי תשלום</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4 text-right" dir="rtl">
          <p className="text-gray-700">יש לבחור אמצעי תשלום להזמנה בסך {formattedPrice} ₪</p>
          
          <div className="grid grid-cols-1 gap-3 pt-2">
            <Button 
              variant="outline"
              className="flex justify-center items-center gap-2 h-20 border-2 hover:bg-gray-50"
              onClick={() => onSelectPaymentMethod('credit')}
            >
              <CreditCard className="w-6 h-6" />
              <div className="text-right">
                <p className="font-semibold">תשלום בכרטיס אשראי</p>
                <p className="text-xs text-gray-500">תשלום מאובטח באתר</p>
              </div>
            </Button>
            
            <Button 
              variant="outline"
              className="flex justify-center items-center gap-2 h-20 border-2 hover:bg-gray-50"  
              onClick={() => onSelectPaymentMethod('cash')}
            >
              <Banknote className="w-6 h-6" />
              <div className="text-right">
                <p className="font-semibold">תשלום במזומן</p>
                <p className="text-xs text-gray-500">תשלום לבעל המקצוע בסיום העבודה</p>
              </div>
            </Button>
          </div>
        </div>
        
        <DialogFooter>
          <Button 
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="w-full"
          >
            ביטול
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentMethodDialog;
