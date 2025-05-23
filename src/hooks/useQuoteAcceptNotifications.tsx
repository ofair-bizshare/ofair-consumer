
import React from 'react';
import { ToastAction } from '@/components/ui/toast';
import { useToast } from '@/hooks/use-toast';

export const useQuoteAcceptNotifications = () => {
  const { toast } = useToast();

  const notifyAlreadyAccepted = () => {
    toast({
      title: 'הצעה התקבלה',
      description: 'הצעת המחיר כבר אושרה במערכת',
      variant: 'default',
    });
  };

  const notifyAcceptError = () => {
    toast({
      title: 'שגיאה בקבלת ההצעה',
      description: 'אירעה שגיאה בקבלת ההצעה. אנא נסה שוב.',
      variant: 'destructive',
    });
  };

  const notifyPaymentRedirect = () => {
    toast({
      title: 'הועברת לעמוד תשלום',
      description: 'עמוד התשלום ייפתח בקרוב...',
      variant: 'default',
    });
  };

  const notifyAccepted = () => {
    toast({
      title: 'הצעה התקבלה',
      description: 'הודעה נשלחה לבעל המקצוע. הוא יצור איתך קשר בהקדם.',
      variant: 'default',
    });
  };

  const notifyAcceptWithRating = (onRateNowClick: () => void) => {
    toast({
      title: 'הצעה התקבלה',
      description: 'הצעת המחיר אושרה! נשמח אם תדרג את בעל המקצוע.',
      action: (
        <ToastAction
          altText="Rate now"
          onClick={() => {
            onRateNowClick();
          }}
          className="bg-amber-500 hover:bg-amber-600 text-white px-3 py-1 rounded ml-2 font-semibold"
          style={{ fontSize: 14 }}
        >
          דרג עכשיו
        </ToastAction>
      ),
      variant: 'success',
    });
  };

  const notifyGeneralError = () => {
    toast({
      title: 'שגיאה בתהליך קבלת ההצעה',
      description: 'אירעה שגיאה בתהליך. אנא נסה שוב מאוחר יותר.',
      variant: 'destructive',
    });
  };

  return {
    notifyAlreadyAccepted,
    notifyAcceptError,
    notifyPaymentRedirect,
    notifyAccepted,
    notifyAcceptWithRating,
    notifyGeneralError,
  };
};
