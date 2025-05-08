
import { QuoteInterface } from '@/types/dashboard';

// Format price as a string with default value
export const formatPrice = (price: string | number | undefined): string => {
  if (typeof price === 'string' && price.length > 0) {
    return price;
  } else if (typeof price === 'number') {
    return String(price);
  } else {
    return "0"; // Default price if empty
  }
};

// Handle credit card payment redirection
export const redirectToPayment = (quoteId: string, price: string): void => {
  window.location.href = `/payment/${quoteId}?price=${encodeURIComponent(price)}`;
};
