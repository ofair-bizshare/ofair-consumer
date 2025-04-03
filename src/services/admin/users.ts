
import { supabase } from '@/integrations/supabase/client';
import { UserMessageInterface } from '@/types/dashboard';

/**
 * Fetches all users from the system
 * @returns Promise<any[]> List of all users
 */
export const fetchAllUsers = async (): Promise<any[]> => {
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching users:', error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('Error fetching users:', error);
    return [];
  }
};

/**
 * Sends a message to a user
 * @param messageData Message data including recipient, subject, and content
 * @returns Promise<boolean> True if successful, false otherwise
 */
export const sendUserMessage = async (messageData: {
  recipient_id?: string;
  recipient_email?: string;
  subject: string;
  content: string;
}): Promise<boolean> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      console.error('No authenticated user found');
      return false;
    }
    
    const { data, error } = await supabase.from('user_messages').insert({
      sender_id: user.id,
      recipient_id: messageData.recipient_id,
      recipient_email: messageData.recipient_email,
      subject: messageData.subject,
      content: messageData.content,
      read: false
    });
    
    if (error) {
      console.error('Error sending message:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error sending message:', error);
    return false;
  }
};
