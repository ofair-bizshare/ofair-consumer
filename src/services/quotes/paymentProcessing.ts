
// Format price for display and processing
export const formatPrice = (price: string): string => {
  if (!price) return '0';
  
  // Remove any non-numeric characters except decimals
  const numericPrice = price.replace(/[^\d.]/g, '');
  
  // If there's no valid price, return '0'
  if (!numericPrice || isNaN(parseFloat(numericPrice))) {
    return '0';
  }
  
  return numericPrice;
};

// Redirect to payment page
export const redirectToPayment = (quoteId: string, price: string): void => {
  try {
    console.log(`Redirecting to payment page for quote ID: ${quoteId}, price: ${price}`);
    
    // In a real implementation, this would redirect to a payment gateway
    // For now, we'll just simulate it with an alert
    alert(`המערכת תעביר אותך כעת לעמוד תשלום בסך ${price} ש"ח`);
    
    // Simulate payment completion
    setTimeout(() => {
      alert("התשלום הושלם בהצלחה!");
      window.location.reload();
    }, 1500);
  } catch (error) {
    console.error("Error redirecting to payment:", error);
    alert("אירעה שגיאה בהעברה לעמוד התשלום. אנא נסה שוב מאוחר יותר.");
  }
};
