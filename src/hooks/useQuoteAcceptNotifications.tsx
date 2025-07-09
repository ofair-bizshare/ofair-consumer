
import React, { useState } from 'react';
import PopupNotification from '@/components/PopupNotification';

export const useQuoteAcceptNotifications = () => {
  const [popup, setPopup] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    type: 'success' | 'error' | 'warning' | 'info';
    actionButton?: { label: string; onClick: () => void };
  }>({
    isOpen: false,
    title: '',
    description: '',
    type: 'info'
  });

  const showPopup = (
    title: string, 
    description: string, 
    type: 'success' | 'error' | 'warning' | 'info',
    actionButton?: { label: string; onClick: () => void }
  ) => {
    setPopup({
      isOpen: true,
      title,
      description,
      type,
      actionButton
    });
  };

  const closePopup = () => {
    setPopup(prev => ({ ...prev, isOpen: false }));
  };

  const notifyAlreadyAccepted = () => {
    showPopup(
      'הצעה התקבלה',
      'הצעת המחיר כבר אושרה במערכת',
      'info'
    );
  };

  const notifyAcceptError = () => {
    showPopup(
      'שגיאה בקבלת ההצעה',
      'אירעה שגיאה בקבלת ההצעה. אנא נסה שוב.',
      'error'
    );
  };

  const notifyPaymentRedirect = () => {
    showPopup(
      'הועברת לעמוד תשלום',
      'עמוד התשלום ייפתח בקרוב...',
      'info'
    );
  };

  const notifyAccepted = () => {
    showPopup(
      'הצעה התקבלה',
      'הודעה נשלחה לבעל המקצוע. הוא יצור איתך קשר בהקדם.',
      'success'
    );
  };

  const notifyAcceptWithRating = (onRateNowClick: () => void) => {
    showPopup(
      'הצעה התקבלה',
      'הצעת המחיר אושרה! נשמח אם תדרג את בעל המקצוע.',
      'success',
      {
        label: 'דרג עכשיו',
        onClick: onRateNowClick
      }
    );
  };

  const notifyGeneralError = () => {
    showPopup(
      'שגיאה בתהליך קבלת ההצעה',
      'אירעה שגיאה בתהליך. אנא נסה שוב מאוחר יותר.',
      'error'
    );
  };

  const PopupComponent = () => (
    <PopupNotification
      isOpen={popup.isOpen}
      onClose={closePopup}
      title={popup.title}
      description={popup.description}
      type={popup.type}
      actionButton={popup.actionButton}
    />
  );

  return {
    notifyAlreadyAccepted,
    notifyAcceptError,
    notifyPaymentRedirect,
    notifyAccepted,
    notifyAcceptWithRating,
    notifyGeneralError,
    PopupComponent,
  };
};
