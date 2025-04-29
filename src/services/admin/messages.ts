
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

/**
 * Send a new message
 * @param messageData Message data (recipient_id/email, subject, content)
 * @returns Promise<boolean> True if successful, false otherwise
 */
export const sendMessage = async (messageData: {
  recipient_id?: string;
  recipient_email?: string;
  subject: string;
  content: string;
}): Promise<boolean> => {
  try {
    // Get current user's ID
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('User not authenticated');
    }

    // Prepare message data
    const message = {
      sender_id: user.id,
      recipient_id: messageData.recipient_id,
      recipient_email: messageData.recipient_email,
      subject: messageData.subject,
      content: messageData.content,
      read: false
    };
    
    // Insert message
    const { error } = await supabase
      .from('user_messages')
      .insert(message);
    
    if (error) {
      console.error('Error sending message:', error);
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error('Error in sendMessage:', error);
    return false;
  }
};
