
import { supabase } from '@/integrations/supabase/client';
import { UserMessageInterface } from '@/types/dashboard';

/**
 * Get all messages
 * @returns Promise<UserMessageInterface[]> List of messages
 */
export const getMessages = async (): Promise<UserMessageInterface[]> => {
  try {
    const { data, error } = await supabase
      .from('user_messages')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching messages:', error);
      throw error;
    }
    
    return data || [];
  } catch (error) {
    console.error('Error in getMessages:', error);
    throw error;
  }
};

/**
 * Mark a message as read
 * @param messageId The ID of the message to mark as read
 * @returns Promise<boolean> True if successful, false otherwise
 */
export const markMessageAsRead = async (messageId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('user_messages')
      .update({ read: true })
      .eq('id', messageId);
    
    if (error) {
      console.error('Error marking message as read:', error);
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error('Error in markMessageAsRead:', error);
    return false;
  }
};

/**
 * Delete a message
 * @param messageId The ID of the message to delete
 * @returns Promise<boolean> True if successful, false otherwise
 */
export const deleteMessage = async (messageId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('user_messages')
      .delete()
      .eq('id', messageId);
    
    if (error) {
      console.error('Error deleting message:', error);
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error('Error in deleteMessage:', error);
    return false;
  }
};
