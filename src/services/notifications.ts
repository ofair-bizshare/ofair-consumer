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

/**
 * Fetch notifications for the current user
 */
export const fetchUserNotifications = async (): Promise<Notification[]> => {
  try {
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.error('User not authenticated');
      return [];
    }

    // Get notifications from localStorage for now (future: from database)
    const storedNotifications = localStorage.getItem('myNotifications');
    if (storedNotifications) {
      return JSON.parse(storedNotifications);
    }
    
    // Return empty array if no notifications exist
    return [];
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return [];
  }
};

/**
 * Create a new notification for the user
 */
export const createNotification = async (
  notification: Omit<Notification, 'id' | 'timestamp' | 'isRead'>
): Promise<Notification> => {
  try {
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    
    const newNotification: Notification = {
      ...notification,
      id: uuidv4(),
      timestamp: Date.now(),
      isRead: false,
      user_id: user?.id
    };
    
    // Get existing notifications
    let notifications: Notification[] = [];
    const storedNotifications = localStorage.getItem('myNotifications');
    
    if (storedNotifications) {
      notifications = JSON.parse(storedNotifications);
    }
    
    // Add new notification
    notifications.unshift(newNotification);
    
    // Save to localStorage (future: to database)
    localStorage.setItem('myNotifications', JSON.stringify(notifications));
    
    return newNotification;
  } catch (error) {
    console.error('Error creating notification:', error);
    throw error;
  }
};

/**
 * Mark a notification as read
 */
export const markNotificationAsRead = async (id: string): Promise<boolean> => {
  try {
    // Get existing notifications
    const storedNotifications = localStorage.getItem('myNotifications');
    if (!storedNotifications) {
      return false;
    }
    
    let notifications: Notification[] = JSON.parse(storedNotifications);
    
    // Update notification
    notifications = notifications.map(notification => 
      notification.id === id ? { ...notification, isRead: true } : notification
    );
    
    // Save to localStorage (future: to database)
    localStorage.setItem('myNotifications', JSON.stringify(notifications));
    
    return true;
  } catch (error) {
    console.error('Error marking notification as read:', error);
    return false;
  }
};

/**
 * Mark all notifications as read
 */
export const markAllNotificationsAsRead = async (): Promise<boolean> => {
  try {
    // Get existing notifications
    const storedNotifications = localStorage.getItem('myNotifications');
    if (!storedNotifications) {
      return false;
    }
    
    let notifications: Notification[] = JSON.parse(storedNotifications);
    
    // Update all notifications
    notifications = notifications.map(notification => ({ ...notification, isRead: true }));
    
    // Save to localStorage (future: to database)
    localStorage.setItem('myNotifications', JSON.stringify(notifications));
    
    return true;
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    return false;
  }
};

/**
 * Delete a notification
 */
export const deleteNotification = async (id: string): Promise<boolean> => {
  try {
    // Get existing notifications
    const storedNotifications = localStorage.getItem('myNotifications');
    if (!storedNotifications) {
      return false;
    }
    
    let notifications: Notification[] = JSON.parse(storedNotifications);
    
    // Filter out notification
    notifications = notifications.filter(notification => notification.id !== id);
    
    // Save to localStorage (future: to database)
    localStorage.setItem('myNotifications', JSON.stringify(notifications));
    
    return true;
  } catch (error) {
    console.error('Error deleting notification:', error);
    return false;
  }
};

/**
 * Get sample notifications for new users
 */
export const getSampleNotifications = (): Notification[] => {
  return [];
};

/**
 * Create a system notification for all users (admin only)
 */
export const createSystemNotification = async (
  title: string,
  message: string,
  actionUrl?: string,
  actionLabel?: string
): Promise<boolean> => {
  try {
    // In a real implementation, this would send to all users via a database
    // For now, we'll just add it to the current user's notifications
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
 * Create a quote notification when a professional sends a quote
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
 * Create a rating reminder notification after a quote is accepted
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
