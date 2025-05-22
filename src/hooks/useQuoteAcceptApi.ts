import {
  updateQuoteStatus,
  updateRequestStatus,
  checkIfAcceptedQuoteExists,
  saveAcceptedQuote,
  saveReferral,
  formatPrice,
  redirectToPayment,
  createQuoteNotification,
  createRatingReminderNotification,
  createNotification, // ensure notification helper is imported
} from '@/services/quotes';
import { QuoteInterface } from '@/types/dashboard';

interface AcceptQuoteApiParams {
  quotes: QuoteInterface[];
  user: any;
  quoteId: string;
  paymentMethod: 'cash' | 'credit';
  setQuotes: React.Dispatch<React.SetStateAction<QuoteInterface[]>>;
  setLastAcceptedQuoteId: React.Dispatch<React.SetStateAction<string | null>>;
  refreshQuotes: (requestId: string) => Promise<void>;
  selectedRequestId: string | null;
}

export const acceptQuoteApi = async (
  params: AcceptQuoteApiParams
): Promise<{
  acceptedQuote: QuoteInterface | undefined;
  quotePrice: string;
  isAlreadyAccepted: boolean;
  success: boolean;
  rejectedQuotesIds: string[];
}> => {
  const {
    quotes,
    user,
    quoteId,
    paymentMethod,
    setQuotes,
    setLastAcceptedQuoteId,
    refreshQuotes,
    selectedRequestId,
  } = params;

  const acceptedQuote = quotes.find(q => q.id === quoteId);
  if (!acceptedQuote || !user) {
    console.error("No acceptedQuote or user. acceptedQuote:", acceptedQuote, "user:", user);
    return {
      acceptedQuote: undefined,
      quotePrice: "0",
      isAlreadyAccepted: false,
      success: false,
      rejectedQuotesIds: []
    };
  }
  const quotePrice = formatPrice(acceptedQuote.price);

  // בדיקה - האם כבר אושרה הצעה כלשהי
  const isAlreadyAccepted = await checkIfAcceptedQuoteExists(
    acceptedQuote.requestId,
    quoteId
  );
  if (isAlreadyAccepted) {
    // לוג מצב - נמצאה הצעה שכבר התקבלה
    console.log("[acceptQuoteApi] Quote already accepted in system:", quoteId);

    setQuotes(prevQuotes =>
      prevQuotes.map(quote =>
        quote.id === quoteId ? { ...quote, status: 'accepted' } : quote
      )
    );
    setLastAcceptedQuoteId(quoteId);

    // Send notification for waiting for rating
    await createNotification({
      title: 'יש לך בעל מקצוע שממתין לדירוג',
      message: `נדרש דירוג לבעל המקצוע: ${acceptedQuote.professional?.name || 'בעל מקצוע'} לבקשה "${acceptedQuote.description}"`,
      type: 'reminder',
      actionUrl: `/dashboard#rating-section`,
      actionLabel: 'דרג כעת'
    });

    await createQuoteNotification(
      acceptedQuote.description,
      acceptedQuote.professional?.name || 'בעל מקצוע',
      acceptedQuote.requestId
    );
    return {
      acceptedQuote,
      quotePrice,
      isAlreadyAccepted: true,
      success: true,
      rejectedQuotesIds: []
    };
  }

  // ===========================
  // עדכון סטטוס לכל ההצעות לבקשה זו
  // ===========================
  // שלב 1: עדכון quote הראשי ל-accepted
  const acceptOk = await updateQuoteStatus(quoteId, 'accepted');
  if (!acceptOk) {
    console.error("[acceptQuoteApi] Failed to set quote status to accepted:", quoteId);
    return {
      acceptedQuote,
      quotePrice,
      isAlreadyAccepted: false,
      success: false,
      rejectedQuotesIds: []
    };
  }
  setLastAcceptedQuoteId(quoteId);

  // שלב 2: reject לכל האחרים, עבור אותה בקשה בלבד
  const rejectedQuotesIds = quotes
    .filter(q => q.id !== quoteId && q.requestId === acceptedQuote.requestId)
    .map(q => q.id);

  // לוג מצב כל הסטטוסים לפני שינוי
  console.log("[acceptQuoteApi] Quotes before status update:", quotes.map(q => ({ id: q.id, status: q.status })));

  await Promise.all(
    rejectedQuotesIds.map(id => updateQuoteStatus(id, 'rejected'))
  );

  setQuotes(prevQuotes =>
    prevQuotes.map(quote =>
      quote.id === quoteId
        ? { ...quote, status: 'accepted' }
        : (quote.requestId === acceptedQuote.requestId
            ? { ...quote, status: 'rejected' }
            : quote)
    )
  );

  // שאילתת בדיקה מיד אחרי
  console.log("[acceptQuoteApi] Quotes after status update:",
    quotes.map(q => ({
      id: q.id,
      requestId: q.requestId,
      status: q.id === quoteId
        ? 'accepted'
        : (q.requestId === acceptedQuote.requestId ? 'rejected' : q.status)
    }))
  );

  // שלב 3: שינוי סטטוס הבקשה לwaiting_for_rating
  await updateRequestStatus(
    acceptedQuote.requestId,
    'waiting_for_rating'
  );

  // Send notification for waiting for rating
  await createNotification({
    title: 'יש לך בעל מקצוע שממתין לדירוג',
    message: `נדרש דירוג לבעל המקצוע: ${acceptedQuote.professional?.name || 'בעל מקצוע'} לבקשה "${acceptedQuote.description}"`,
    type: 'reminder',
    actionUrl: `/dashboard#rating-section`,
    actionLabel: 'דרג כעת'
  });

  // Notify for quote and schedule reminder
  await createQuoteNotification(
    acceptedQuote.description,
    acceptedQuote.professional?.name || 'בעל מקצוע',
    acceptedQuote.requestId
  );
  setTimeout(async () => {
    await createRatingReminderNotification(
      acceptedQuote.professional?.name || 'בעל מקצוע',
      acceptedQuote.professional?.id || ''
    );
  }, 500);

  await saveAcceptedQuote({
    user_id: user.id,
    quote_id: quoteId,
    request_id: acceptedQuote.requestId,
    professional_id: acceptedQuote.professional.id,
    professional_name: acceptedQuote.professional.name,
    price: quotePrice,
    date: new Date().toISOString(),
    status: 'accepted',
    description: acceptedQuote.description,
    payment_method: paymentMethod,
    created_at: new Date().toISOString(),
  });
  await saveReferral(
    user.id,
    acceptedQuote.professional.id,
    acceptedQuote.professional.name,
    acceptedQuote.professional.phoneNumber ||
      acceptedQuote.professional.phone ||
      '050-1234567',
    acceptedQuote.professional.profession
  );

  // בסוף: רפרוש quotes ועדכון חוזר של כל מערך הסטטוסים
  if (selectedRequestId) {
    setTimeout(() => {
      refreshQuotes(selectedRequestId);
    }, 500);
  }

  // לוג סופי - מוודאים רק הצעה אחת קיבלה accepted והיתר rejected
  setTimeout(() => {
    console.log("[acceptQuoteApi] FINAL state of quotes for request %s:",
      acceptedQuote.requestId,
      quotes
        .filter(q => q.requestId === acceptedQuote.requestId)
        .map(q => ({ id: q.id, status: (q.id === quoteId ? "accepted" : "rejected") }))
    );
  }, 600);

  return {
    acceptedQuote,
    quotePrice,
    isAlreadyAccepted: false,
    success: true,
    rejectedQuotesIds
  };
};
