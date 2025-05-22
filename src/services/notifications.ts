import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'quote' | 'message' | 'system' | 'reminder' | 'professional';
  timestamp: number;
  isRead: boolean;
  actionUrl?: string;
  actionLabel?: string;
  user_id?: string;
  sender_id?: string;
}

// Type guard for Notification.type
const allowedTypes = ['quote', 'message', 'system', 'reminder', 'professional'] as const;
type NotificationType = typeof allowedTypes[number];
function isNotificationType(type: any): type is NotificationType {
  return allowedTypes.includes(type);
}

/**
 * Get notifications from Supabase for the current user
 */
export const fetchUserNotifications = async (): Promise<Notification[]> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.error('User not authenticated');
      return [];
    }

    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('professional_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase error fetching notifications:', error);
      return [];
    }

    if (!data) return [];

    return data.map((n: any) => ({
      id: n.id,
      title: n.title,
      message: n.description, // In DB: description
      type: isNotificationType(n.type) ? n.type : 'system',
      timestamp: new Date(n.created_at).getTime(),
      isRead: n.is_read,
      actionUrl: n.related_id ? `/dashboard?request=${n.related_id}` : undefined,
      actionLabel: n.related_type,
      user_id: n.professional_id,
    }));
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return [];
  }
};

/**
 * Create a new notification for the user in Supabase
 */
export const createNotification = async (
  notification: Omit<Notification, 'id' | 'timestamp' | 'isRead'>
): Promise<Notification> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const toInsert = {
      title: notification.title,
      description: notification.message,
      type: notification.type,
      professional_id: notification.user_id || user.id, // תעדוף user_id שהוזן, אחרת משתמש מחובר
      is_read: false,
      created_at: new Date().toISOString(),
      related_id: undefined,
      related_type: undefined,
      ...(notification.actionUrl
        ? { related_id: notification.actionUrl.split('=').pop() }
        : {}),
      ...(notification.actionLabel ? { related_type: notification.actionLabel } : {}),
    };

    const { data, error } = await supabase
      .from('notifications')
      .insert([toInsert])
      .select()
      .single();

    if (error) {
      console.error('Supabase error creating notification:', error);
      throw error;
    }
    return {
      id: data.id,
      title: data.title,
      message: data.description,
      // FIX: ensure the type is valid or fallback to 'system'
      type: isNotificationType(data.type) ? data.type : 'system',
      timestamp: new Date(data.created_at).getTime(),
      isRead: data.is_read,
      actionUrl: data.related_id ? `/dashboard?request=${data.related_id}` : undefined,
      actionLabel: data.related_type,
      user_id: data.professional_id,
    };
  } catch (error) {
    console.error('Error creating notification:', error);
    throw error;
  }
};

/**
 * Mark a notification as read (DB)
 */
export const markNotificationAsRead = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', id);

    if (error) {
      console.error('Supabase error marking as read:', error);
      return false;
    }
    return true;
  } catch (error) {
    console.error('Error marking notification as read:', error);
    return false;
  }
};

/**
 * Mark all notifications as read (DB)
 */
export const markAllNotificationsAsRead = async (): Promise<boolean> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('professional_id', user.id)
      .eq('is_read', false);

    if (error) {
      console.error('Supabase error marking all as read:', error);
      return false;
    }
    return true;
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    return false;
  }
};

/**
 * Delete a notification (DB)
 */
export const deleteNotification = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('notifications')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Supabase error deleting notification:', error);
      return false;
    }
    return true;
  } catch (error) {
    console.error('Error deleting notification:', error);
    return false;
  }
};

/**
 * Dummy sample notifications (for new users)
 */
export const getSampleNotifications = (): Notification[] => {
  return [];
};

/**
 * Create a system notification (DB)
 */
export const createSystemNotification = async (
  title: string,
  message: string,
  actionUrl?: string,
  actionLabel?: string
): Promise<boolean> => {
  try {
    await createNotification({
      title,
      message,
      type: 'system',
      actionUrl,
      actionLabel
    });

    return true;
  } catch (error) {
    console.error('Error creating system notification:', error);
    return false;
  }
};

/**
 * Create a quote notification
 */
export const createQuoteNotification = async (
  requestTitle: string,
  professionalName: string,
  requestId: string
): Promise<boolean> => {
  try {
    await createNotification({
      title: 'הצעת מחיר חדשה',
      message: `התקבלה הצעת מחיר חדשה מ${professionalName} לבקשתך "${requestTitle}"`,
      type: 'quote',
      actionUrl: `/dashboard?request=${requestId}`,
      actionLabel: 'צפה בהצעה'
    });

    return true;
  } catch (error) {
    console.error('Error creating quote notification:', error);
    return false;
  }
};

/**
 * Create a rating reminder
 */
export const createRatingReminderNotification = async (
  professionalName: string,
  professionalId: string
): Promise<boolean> => {
  try {
    await createNotification({
      title: 'דרג את בעל המקצוע',
      message: `כיצד היית מדרג את העבודה של ${professionalName}?`,
      type: 'reminder',
      actionUrl: `/rate-professional/${professionalId}`,
      actionLabel: 'דרג עכשיו'
    });

    return true;
  } catch (error) {
    console.error('Error creating rating reminder notification:', error);
    return false;
  }
};

/**
 * Create a referral notification (DB)
 * לבעל מקצוע שמקבל הפניה
 */
export const createReferralNotification = async (
  professionalId: string,
  professionalName: string,
  phoneNumber: string,
  userName?: string // Optionally include the user who performed the referral
): Promise<boolean> => {
  try {
    await createNotification({
      title: 'הפניה חדשה',
      message: `קיבלת הפניית לקוח חדשה${userName ? ` מ${userName}` : ""}. מס' טלפון: ${phoneNumber}`,
      type: 'professional',
      actionUrl: `/dashboard`, // או מסך הפניות, אפשר לעדכן בהתאם
      actionLabel: 'צפה בפרטים',
      user_id: professionalId
    });

    return true;
  } catch (error) {
    console.error('Error creating referral notification:', error);
    return false;
  }
};
