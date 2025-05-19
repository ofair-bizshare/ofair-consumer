
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
    return {
      acceptedQuote: undefined,
      quotePrice: "0",
      isAlreadyAccepted: false,
      success: false,
      rejectedQuotesIds: []
    };
  }
  const quotePrice = formatPrice(acceptedQuote.price);

  // Check if already accepted
  const isAlreadyAccepted = await checkIfAcceptedQuoteExists(
    acceptedQuote.requestId,
    quoteId
  );
  if (isAlreadyAccepted) {
    setQuotes(prevQuotes =>
      prevQuotes.map(quote =>
        quote.id === quoteId ? { ...quote, status: 'accepted' } : quote
      )
    );
    setLastAcceptedQuoteId(quoteId);

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

  // Mark only the selected quote as accepted, others rejected
  const success = await updateQuoteStatus(quoteId, 'accepted');
  if (!success) {
    return {
      acceptedQuote,
      quotePrice,
      isAlreadyAccepted: false,
      success: false,
      rejectedQuotesIds: []
    };
  }
  setLastAcceptedQuoteId(quoteId);

  const rejectedQuotesIds = quotes
    .filter(q => q.id !== quoteId && q.requestId === acceptedQuote.requestId)
    .map(q => q.id);

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

  await updateRequestStatus(
    acceptedQuote.requestId,
    'waiting_for_rating'
  );

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

  if (selectedRequestId) {
    setTimeout(() => {
      refreshQuotes(selectedRequestId);
    }, 500);
  }

  return {
    acceptedQuote,
    quotePrice,
    isAlreadyAccepted: false,
    success: true,
    rejectedQuotesIds
  };
};
