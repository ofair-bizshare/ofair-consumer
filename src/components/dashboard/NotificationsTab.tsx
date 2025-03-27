
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Bell, CheckCircle, X, MessageSquare, Clock, Calendar, Tool } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import { he } from 'date-fns/locale';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'quote' | 'message' | 'system' | 'reminder' | 'professional';
  timestamp: number; // Unix timestamp
  isRead: boolean;
  actionUrl?: string;
  actionLabel?: string;
}

const NotificationsTab: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showAll, setShowAll] = useState(true);
  
  useEffect(() => {
    // Get notifications from localStorage or initialize with samples
    const storedNotifications = localStorage.getItem('myNotifications');
    if (storedNotifications) {
      setNotifications(JSON.parse(storedNotifications));
    } else {
      // Sample notifications
      const sampleNotifications: Notification[] = [
        {
          id: '1',
          title: 'הצעת מחיר חדשה',
          message: 'התקבלה הצעת מחיר חדשה לבקשתך "שיפוץ אמבטיה"',
          type: 'quote',
          timestamp: Date.now() - 3600000, // 1 hour ago
          isRead: false,
          actionUrl: '/dashboard#requests-section',
          actionLabel: 'צפה בהצעה'
        },
        {
          id: '2',
          title: 'הודעה חדשה',
          message: 'קיבלת הודעה חדשה מבעל המקצוע משה לוי',
          type: 'message',
          timestamp: Date.now() - 86400000, // 1 day ago
          isRead: true,
          actionUrl: '/dashboard/messages',
          actionLabel: 'צפה בהודעה'
        },
        {
          id: '3',
          title: 'תזכורת: פגישה עם בעל מקצוע',
          message: 'יש לך פגישה מתוכננת בעוד שעתיים עם האינסטלטור',
          type: 'reminder',
          timestamp: Date.now() - 259200000, // 3 days ago
          isRead: false,
          actionUrl: '/dashboard/calendar',
          actionLabel: 'צפה בפגישות'
        },
        {
          id: '4',
          title: 'בעל מקצוע חדש באזור שלך',
          message: 'בעל מקצוע חדש בתחום האינסטלציה נרשם באזור תל אביב',
          type: 'professional',
          timestamp: Date.now() - 604800000, // 7 days ago
          isRead: true,
          actionUrl: '/search?category=plumbing',
          actionLabel: 'חפש אינסטלטורים'
        },
        {
          id: '5',
          title: 'עדכון מערכת',
          message: 'בוצעו שיפורים במערכת שיעזרו לך למצוא בעלי מקצוע בקלות רבה יותר',
          type: 'system',
          timestamp: Date.now() - 1209600000, // 14 days ago
          isRead: true
        }
      ];
      
      setNotifications(sampleNotifications);
      localStorage.setItem('myNotifications', JSON.stringify(sampleNotifications));
    }
  }, []);
  
  const markAsRead = (id: string) => {
    const updatedNotifications = notifications.map(notification => 
      notification.id === id ? { ...notification, isRead: true } : notification
    );
    
    setNotifications(updatedNotifications);
    localStorage.setItem('myNotifications', JSON.stringify(updatedNotifications));
  };
  
  const markAllAsRead = () => {
    const updatedNotifications = notifications.map(notification => ({ ...notification, isRead: true }));
    setNotifications(updatedNotifications);
    localStorage.setItem('myNotifications', JSON.stringify(updatedNotifications));
  };
  
  const deleteNotification = (id: string) => {
    const updatedNotifications = notifications.filter(notification => notification.id !== id);
    setNotifications(updatedNotifications);
    localStorage.setItem('myNotifications', JSON.stringify(updatedNotifications));
  };
  
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'quote':
        return <Badge className="p-2 bg-blue-100 text-blue-700">₪</Badge>;
      case 'message':
        return <MessageSquare className="text-green-500" />;
      case 'reminder':
        return <Clock className="text-orange-500" />;
      case 'professional':
        return <Tool className="text-purple-500" />;
      case 'system':
        return <Bell className="text-gray-500" />;
      default:
        return <Bell className="text-blue-500" />;
    }
  };
  
  const formatTime = (timestamp: number) => {
    return formatDistanceToNow(timestamp, { addSuffix: true, locale: he });
  };
  
  const unreadCount = notifications.filter(n => !n.isRead).length;
  const displayNotifications = showAll ? notifications : notifications.filter(n => !n.isRead);
  
  return (
    <div className="space-y-6" dir="rtl">
      <div className="glass-card p-6">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <h2 className="text-2xl font-semibold text-blue-700 flex items-center">
              התראות
              {unreadCount > 0 && (
                <Badge className="mr-2 bg-red-500">{unreadCount}</Badge>
              )}
            </h2>
          </div>
          <div className="flex space-x-3 space-x-reverse">
            <Button 
              variant="outline" 
              size="sm" 
              className={showAll ? "bg-blue-50 text-blue-700" : ""}
              onClick={() => setShowAll(true)}
            >
              הכל
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className={!showAll ? "bg-blue-50 text-blue-700" : ""}
              onClick={() => setShowAll(false)}
            >
              לא נקראו
            </Button>
            {unreadCount > 0 && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={markAllAsRead}
              >
                סמן הכל כנקרא
              </Button>
            )}
          </div>
        </div>
        
        {displayNotifications.length > 0 ? (
          <div className="space-y-3">
            {displayNotifications.map(notification => (
              <Card 
                key={notification.id} 
                className={`border-r-4 ${notification.isRead ? 'border-gray-200' : 'border-blue-500'} hover:shadow-md transition-shadow cursor-pointer`}
                onClick={() => markAsRead(notification.id)}
              >
                <CardContent className="p-4">
                  <div className="flex">
                    <div className="ml-4 pt-2">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-grow">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className={`text-lg ${notification.isRead ? 'font-medium' : 'font-semibold'}`}>
                            {notification.title}
                          </h3>
                          <p className="text-gray-600 mt-1">{notification.message}</p>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-gray-400 hover:text-gray-700"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteNotification(notification.id);
                          }}
                        >
                          <X size={16} />
                        </Button>
                      </div>
                      
                      <div className="flex justify-between items-center mt-3">
                        <span className="text-sm text-gray-500">
                          {formatTime(notification.timestamp)}
                        </span>
                        
                        {notification.actionUrl && (
                          <a href={notification.actionUrl}>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="text-blue-700 border-blue-200 hover:bg-blue-50"
                              onClick={(e) => e.stopPropagation()}
                            >
                              {notification.actionLabel || 'פרטים נוספים'}
                            </Button>
                          </a>
                        )}
                        
                        {!notification.isRead && (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-green-600 hover:text-green-700 hover:bg-green-50"
                            onClick={(e) => {
                              e.stopPropagation();
                              markAsRead(notification.id);
                            }}
                          >
                            <CheckCircle size={16} className="ml-1" />
                            סמן כנקרא
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Bell className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">אין התראות</h3>
            <p className="text-gray-500">
              כאשר תקבל התראות חדשות, הן יופיעו כאן
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsTab;
