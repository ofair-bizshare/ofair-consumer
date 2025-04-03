
import { supabase } from '@/integrations/supabase/client';
import { AdminUserInterface, UserMessageInterface, ProfessionalInterface, ArticleInterface, UserProfileInterface } from '@/types/dashboard';
import { toast } from '@/hooks/use-toast';

// Check if current user is a super admin
export const checkIsSuperAdmin = async (): Promise<boolean> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      console.log('No authenticated user found');
      return false;
    }
    
    // Check admin_users table for the current user
    const { data, error } = await supabase
      .from('admin_users')
      .select('is_super_admin')
      .eq('user_id', user.id)
      .maybeSingle();
      
    if (error) {
      console.error('Error checking admin status:', error);
      return false;
    }
    
    return data?.is_super_admin === true;
  } catch (error) {
    console.error('Error in checkIsSuperAdmin:', error);
    return false;
  }
};

// Fetch all admin users
export const fetchAdminUsers = async (): Promise<AdminUserInterface[]> => {
  try {
    const { data, error } = await supabase
      .from('admin_users')
      .select('*');
      
    if (error) {
      console.error('Error fetching admin users:', error);
      throw error;
    }
    
    return data || [];
  } catch (error) {
    console.error('Error in fetchAdminUsers:', error);
    return [];
  }
};

// Create a new professional
export const createProfessional = async (professional: Omit<ProfessionalInterface, 'id' | 'reviewCount'>): Promise<string | null> => {
  try {
    // Prepare the professional data for insertion
    const professionalData = {
      name: professional.name,
      profession: professional.profession,
      location: professional.location,
      image: professional.image,
      specialties: professional.specialties,
      phone_number: professional.phoneNumber,
      about: professional.about,
      rating: professional.rating || 0
    };
    
    // Insert into the professionals table
    const { data, error } = await supabase
      .from('professionals')
      .insert(professionalData)
      .select('id')
      .single();
      
    if (error) {
      console.error('Error creating professional:', error);
      toast({
        title: "שגיאה ביצירת בעל מקצוע",
        description: error.message,
        variant: "destructive"
      });
      return null;
    }
    
    toast({
      title: "בעל מקצוע נוצר בהצלחה",
      description: `נוצר בעל מקצוע חדש: ${professional.name}`,
    });
    
    return data.id;
  } catch (error) {
    console.error('Error in createProfessional:', error);
    toast({
      title: "שגיאה ביצירת בעל מקצוע",
      description: "אירעה שגיאה בלתי צפויה",
      variant: "destructive"
    });
    return null;
  }
};

// Upload a professional image
export const uploadProfessionalImage = async (file: File): Promise<string | null> => {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `professional-${Date.now()}.${fileExt}`;
    const filePath = `professional-images/${fileName}`;
    
    // Upload the file
    const { error: uploadError } = await supabase.storage
      .from('images')
      .upload(filePath, file);
      
    if (uploadError) {
      console.error('Error uploading image:', uploadError);
      toast({
        title: "שגיאה בהעלאת תמונה",
        description: uploadError.message,
        variant: "destructive"
      });
      return null;
    }
    
    // Get the public URL
    const { data: publicURL } = supabase.storage
      .from('images')
      .getPublicUrl(filePath);
    
    if (!publicURL) {
      console.error('Failed to get public URL');
      return null;
    }
    
    return publicURL.publicUrl;
  } catch (error) {
    console.error('Error in uploadProfessionalImage:', error);
    return null;
  }
};

// Create a new article
export const createArticle = async (article: Omit<ArticleInterface, 'id' | 'created_at'>): Promise<string | null> => {
  try {
    // Prepare the article data for insertion
    const articleData = {
      title: article.title,
      content: article.content,
      summary: article.summary,
      image: article.image,
      author: article.author,
      published: article.published
    };
    
    // Insert into the articles table
    const { data, error } = await supabase
      .from('articles')
      .insert(articleData)
      .select('id')
      .single();
      
    if (error) {
      console.error('Error creating article:', error);
      toast({
        title: "שגיאה ביצירת מאמר",
        description: error.message,
        variant: "destructive"
      });
      return null;
    }
    
    toast({
      title: "מאמר נוצר בהצלחה",
      description: `נוצר מאמר חדש: ${article.title}`,
    });
    
    return data.id;
  } catch (error) {
    console.error('Error in createArticle:', error);
    toast({
      title: "שגיאה ביצירת מאמר",
      description: "אירעה שגיאה בלתי צפויה",
      variant: "destructive"
    });
    return null;
  }
};

// Send a message to a user
export const sendUserMessage = async (message: {
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
    
    // Prepare the message data
    const messageData = {
      sender_id: user.id,
      recipient_id: message.recipient_id,
      recipient_email: message.recipient_email,
      subject: message.subject,
      content: message.content,
      read: false
    };
    
    // Insert into user_messages table
    const { error } = await supabase
      .from('user_messages')
      .insert(messageData);
      
    if (error) {
      console.error('Error sending message:', error);
      toast({
        title: "שגיאה בשליחת הודעה",
        description: error.message,
        variant: "destructive"
      });
      return false;
    }
    
    toast({
      title: "הודעה נשלחה בהצלחה",
      description: `ההודעה "${message.subject}" נשלחה בהצלחה`,
    });
    
    return true;
  } catch (error) {
    console.error('Error in sendUserMessage:', error);
    toast({
      title: "שגיאה בשליחת הודעה",
      description: "אירעה שגיאה בלתי צפויה",
      variant: "destructive"
    });
    return false;
  }
};

// Fetch all messages
export const fetchUserMessages = async (): Promise<UserMessageInterface[]> => {
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
    console.error('Error in fetchUserMessages:', error);
    return [];
  }
};

// Fetch all users
export const fetchAllUsers = async (): Promise<UserProfileInterface[]> => {
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*');
      
    if (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
    
    return data || [];
  } catch (error) {
    console.error('Error in fetchAllUsers:', error);
    return [];
  }
};
