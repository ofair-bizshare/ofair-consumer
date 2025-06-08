
/**
 * Format phone number for display
 */
export const formatPhoneNumber = (phone: string): string => {
  if (!phone || phone === "000-0000000") return "מספר לא זמין";
  
  // Basic formatting: If it's just digits, format as XXX-XXXXXXX
  if (/^\d+$/.test(phone) && phone.length >= 9) {
    const prefix = phone.slice(0, 3);
    const number = phone.slice(3);
    return `${prefix}-${number}`;
  }
  
  return phone;
};
