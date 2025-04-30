
// Export all admin services from this index file
export * from './auth';
export * from './professionals';
export * from './articles';
export * from './messages';
export * from './users';

// Re-export functions with more descriptive names
import { getMessages, sendMessage } from './messages';
import { getAllUsers } from './users';

// Re-exports with the names expected by the components
export const fetchUserMessages = getMessages;
export const fetchAllUsers = getAllUsers;
export const sendUserMessage = sendMessage;

// Export storage-related functions for convenience
export { uploadArticleImage } from './articles';
export { uploadProfessionalImage } from './professionals';
