
import { supabase } from '@/integrations/supabase/client';
import { AdminUserInterface, UserMessageInterface, ProfessionalInterface, ArticleInterface } from '@/types/dashboard';

/**
 * Checks if the current user is a super admin
 * @returns Promise<boolean> True if the user is a super admin, false otherwise
 */
export const checkIsSuperAdmin = async (): Promise<boolean> => {
  try {
    console.log("Running checkIsSuperAdmin");
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      console.log("No authenticated user found");
      return false;
    }
    
    console.log("Checking admin status for user ID:", user.id);
    
    // Query to check if the user is a super admin
    const { data, error } = await supabase
      .from('admin_users')
      .select('is_super_admin')
      .eq('user_id', user.id)
      .maybeSingle();
    
    if (error) {
      console.error('Error checking super admin status:', error);
      return false;
    }
    
    console.log("Admin check result:", data);
    
    return data?.is_super_admin ?? false;
  } catch (error) {
    console.error('Error checking super admin status:', error);
    return false;
  }
};

/**
 * Creates a new super admin
 * @param email Email of the user to make super admin
 * @returns Promise<{ success: boolean, message?: string }> Result of the operation
 */
export const createSuperAdmin = async (email: string): Promise<{ success: boolean, message?: string }> => {
  try {
    const { data, error } = await supabase.rpc('create_first_super_admin', {
      admin_email: email
    });
    
    if (error) {
      return { success: false, message: error.message };
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error creating super admin:', error);
    return { success: false, message: 'An unexpected error occurred' };
  }
};

/**
 * Fetches all users from the system
 * @returns Promise<any[]> List of all users
 */
export const fetchAllUsers = async (): Promise<any[]> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
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

/**
 * Creates a new professional
 * @param professional Professional data
 * @returns Promise<boolean> True if successful, false otherwise
 */
export const createProfessional = async (professional: Omit<ProfessionalInterface, 'id' | 'reviewCount' | 'verified'>): Promise<boolean> => {
  try {
    const { data, error } = await supabase.from('professionals').insert({
      name: professional.name,
      profession: professional.profession,
      location: professional.location,
      specialties: professional.specialties,
      phone_number: professional.phoneNumber,
      about: professional.about,
      rating: professional.rating,
      image: professional.image
    });
    
    if (error) {
      console.error('Error creating professional:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error creating professional:', error);
    return false;
  }
};

/**
 * Uploads a professional's image to storage
 * @param file Image file to upload
 * @returns Promise<string | null> URL of the uploaded image or null if failed
 */
export const uploadProfessionalImage = async (file: File): Promise<string | null> => {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
    const filePath = `professionals/${fileName}`;
    
    const { data, error } = await supabase.storage
      .from('public')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });
    
    if (error) {
      console.error('Error uploading image:', error);
      return null;
    }
    
    const { data: { publicUrl } } = supabase.storage
      .from('public')
      .getPublicUrl(filePath);
    
    return publicUrl;
  } catch (error) {
    console.error('Error uploading image:', error);
    return null;
  }
};

/**
 * Creates a new article
 * @param article Article data
 * @returns Promise<boolean> True if successful, false otherwise
 */
export const createArticle = async (article: Omit<ArticleInterface, 'id' | 'created_at'>): Promise<boolean> => {
  try {
    const { data, error } = await supabase.from('articles').insert({
      title: article.title,
      content: article.content,
      summary: article.summary,
      image: article.image,
      author: article.author,
      published: article.published
    });
    
    if (error) {
      console.error('Error creating article:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error creating article:', error);
    return false;
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
