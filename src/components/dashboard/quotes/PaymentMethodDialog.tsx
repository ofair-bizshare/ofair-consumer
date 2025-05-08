
import React from 'react';
import { Dialog, DialogContent, DialogTitle, DialogHeader, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CreditCard, Banknote, Loader2 } from 'lucide-react';

interface PaymentMethodDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectPaymentMethod: (method: 'cash' | 'credit') => void;
  quotePrice?: string;
  isProcessing?: boolean;
}

const PaymentMethodDialog: React.FC<PaymentMethodDialogProps> = ({
  open,
  onOpenChange,
  onSelectPaymentMethod,
  quotePrice = "0",
  isProcessing = false
}) => {
  // Ensure the price is properly formatted as a string with a default value
  const formattedPrice = typeof quotePrice === 'string' && quotePrice.length > 0
    ? quotePrice
    : typeof quotePrice === 'number'
      ? String(quotePrice)
      : "0";
  
  return (
    <Dialog open={open} onOpenChange={isProcessing ? () => {} : onOpenChange}>
      <DialogContent className="sm:max-w-[425px] overflow-hidden" dir="rtl">
        <DialogHeader>
          <DialogTitle>בחר אמצעי תשלום</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <p className="text-gray-700">יש לבחור אמצעי תשלום להזמנה בסך {formattedPrice} ₪</p>
          
          <div className="grid grid-cols-1 gap-3 pt-2">
            <Button 
              variant="outline"
              className="flex justify-right items-center gap-2 h-20 border-2 hover:bg-gray-50"
              onClick={() => onSelectPaymentMethod('credit')}
              disabled={isProcessing}
            >
              <CreditCard className="w-6 h-6" />
              <div>
                <p className="font-semibold">תשלום בכרטיס אשראי</p>
                <p className="text-xs text-gray-500">תשלום מאובטח באתר</p>
              </div>
              {isProcessing && <Loader2 className="ml-auto w-5 h-5 animate-spin" />}
            </Button>
            
            <Button 
              variant="outline"
              className="flex justify-right items-center gap-2 h-20 border-2 hover:bg-gray-50"  
              onClick={() => onSelectPaymentMethod('cash')}
              disabled={isProcessing}
            >
              <Banknote className="w-6 h-6" />
              <div>
                <p className="font-semibold">תשלום במזומן</p>
                <p className="text-xs text-gray-500">תשלום לבעל המקצוע בסיום העבודה</p>
              </div>
              {isProcessing && <Loader2 className="ml-auto w-5 h-5 animate-spin" />}
            </Button>
          </div>
        </div>
        
        <DialogFooter>
          <Button 
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="w-full"
            disabled={isProcessing}
          >
            ביטול
            {isProcessing && <Loader2 className="ml-2 w-4 h-4 animate-spin" />}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentMethodDialog;
