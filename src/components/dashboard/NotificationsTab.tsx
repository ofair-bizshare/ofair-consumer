
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Bell, CheckCircle, X, MessageSquare, Clock, Calendar, Wrench } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import { he } from 'date-fns/locale';
import { 
  Notification,
  fetchUserNotifications, 
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification
} from '@/services/notifications';

const NotificationsTab: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showAll, setShowAll] = useState(true);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const loadNotifications = async () => {
      try {
        const userNotifications = await fetchUserNotifications();
        setNotifications(userNotifications);
      } catch (error) {
        console.error('Error loading notifications:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadNotifications();
  }, []);
  
  const handleMarkAsRead = async (id: string) => {
    const success = await markNotificationAsRead(id);
    
    if (success) {
      setNotifications(prev => prev.map(notification => 
        notification.id === id ? { ...notification, isRead: true } : notification
      ));
    }
  };
  
  const handleMarkAllAsRead = async () => {
    const success = await markAllNotificationsAsRead();
    
    if (success) {
      setNotifications(prev => prev.map(notification => ({ ...notification, isRead: true })));
    }
  };
  
  const handleDeleteNotification = async (id: string) => {
    const success = await deleteNotification(id);
    
    if (success) {
      setNotifications(prev => prev.filter(notification => notification.id !== id));
    }
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
        return <Wrench className="text-purple-500" />;
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
  
  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#00d09e]"></div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6" dir="rtl">
      <div className="glass-card p-4 md:p-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-3">
          <div className="flex items-center">
            <h2 className="text-xl md:text-2xl font-semibold text-blue-700 flex items-center">
              התראות
              {unreadCount > 0 && (
                <Badge className="mr-2 bg-red-500">{unreadCount}</Badge>
              )}
            </h2>
          </div>
          <div className="flex flex-wrap gap-2">
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
                onClick={handleMarkAllAsRead}
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
                onClick={() => handleMarkAsRead(notification.id)}
              >
                <CardContent className="p-3 md:p-4">
                  <div className="flex">
                    <div className="ml-3 md:ml-4 pt-2">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-grow">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className={`text-base md:text-lg ${notification.isRead ? 'font-medium' : 'font-semibold'}`}>
                            {notification.title}
                          </h3>
                          <p className="text-sm md:text-base text-gray-600 mt-1">{notification.message}</p>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-gray-400 hover:text-gray-700 p-1 h-auto"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteNotification(notification.id);
                          }}
                        >
                          <X size={16} />
                        </Button>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mt-3 gap-2">
                        <span className="text-xs md:text-sm text-gray-500">
                          {formatTime(notification.timestamp)}
                        </span>
                        
                        <div className="flex flex-wrap gap-2">
                          {notification.actionUrl && (
                            <a href={notification.actionUrl}
                               onClick={(e) => e.stopPropagation()}
                               className="block w-full sm:w-auto">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="text-blue-700 border-blue-200 hover:bg-blue-50 w-full sm:w-auto"
                              >
                                {notification.actionLabel || 'פרטים נוספים'}
                              </Button>
                            </a>
                          )}
                          
                          {!notification.isRead && (
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-green-600 hover:text-green-700 hover:bg-green-50 w-full sm:w-auto"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleMarkAsRead(notification.id);
                              }}
                            >
                              <CheckCircle size={16} className="mr-1 md:ml-1 md:mr-0" />
                              סמן כנקרא
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 md:py-12">
            <Bell className="h-10 w-10 md:h-12 md:w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg md:text-xl font-semibold text-gray-700 mb-2">אין התראות</h3>
            <p className="text-gray-500 text-sm md:text-base">
              כאשר תקבל התראות חדשות, הן יופיעו כאן
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsTab;
