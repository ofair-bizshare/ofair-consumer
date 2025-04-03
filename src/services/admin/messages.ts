
import { supabase } from '@/integrations/supabase/client';
import { UserMessageInterface } from '@/types/dashboard';

/**
 * Fetches all user messages
 * @returns Promise<UserMessageInterface[]> List of all user messages
 */
export const fetchUserMessages = async (): Promise<UserMessageInterface[]> => {
  try {
    const { data, error } = await supabase
      .from('user_messages')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching user messages:', error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('Error fetching user messages:', error);
    return [];
  }
};
