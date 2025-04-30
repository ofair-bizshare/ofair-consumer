
/**
 * Format error messages from different sources into consistent strings
 * @param {any} error - The error object
 * @param {string} defaultMessage - Default message if no specific error is found
 * @returns {string} Formatted error message
 */
export const formatError = (error: any, defaultMessage: string = 'An error occurred'): string => {
  if (!error) return defaultMessage;
  
  // Handle Supabase errors
  if (error.code && error.message) {
    return `Error ${error.code}: ${error.message}`;
  }
  
  // Handle Error objects
  if (error instanceof Error) {
    return error.message;
  }
  
  // Handle string errors
  if (typeof error === 'string') {
    return error;
  }
  
  // Handle objects with message property
  if (error.message) {
    return error.message;
  }
  
  // Handle objects that can be stringified
  try {
    return JSON.stringify(error);
  } catch {
    return defaultMessage;
  }
};
