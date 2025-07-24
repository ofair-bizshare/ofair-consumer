import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Search, Send, Inbox, Bell } from 'lucide-react';
import { useAuth } from '@/providers/AuthProvider';
import { fetchUserNotifications } from '@/services/notifications';

const BottomNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [notificationCount, setNotificationCount] = React.useState<number>(0);

  React.useEffect(() => {
    const getNotifications = async () => {
      if (user) {
        try {
          const notifications = await fetchUserNotifications();
          const unreadCount = notifications.filter(n => !n.isRead).length;
          setNotificationCount(unreadCount);
        } catch (error) {
          console.error("Failed to fetch notifications:", error);
        }
      }
    };

    if (user) {
      getNotifications();
    }
  }, [user]);

  const handleSendRequest = () => {
    if (user) {
      if (location.pathname === '/dashboard') {
        const requestsSection = document.getElementById('requests-section');
        if (requestsSection) {
          requestsSection.scrollIntoView({ behavior: 'smooth' });
        }
      } else {
        navigate('/dashboard');
      }
    } else {
      if (location.pathname === '/') {
        const formSection = document.getElementById('request-form-section');
        if (formSection) {
          formSection.scrollIntoView({ behavior: 'smooth' });
        }
      } else {
        navigate('/#request-form-section');
      }
    }
  };

  const navItems = [
    {
      icon: Home,
      label: 'דשבורד',
      action: () => navigate('/dashboard'),
      isActive: location.pathname === '/dashboard'
    },
    {
      icon: Search,
      label: 'חיפוש',
      action: () => navigate('/search'),
      isActive: location.pathname === '/search'
    },
    {
      icon: Send,
      label: 'בקשה',
      action: handleSendRequest,
      isActive: false,
      isSpecial: true
    },
    {
      icon: Inbox,
      label: 'הפניות',
      action: () => navigate('/referrals'),
      isActive: location.pathname === '/referrals'
    },
    {
      icon: Bell,
      label: 'התראות',
      action: () => navigate('/dashboard?tab=notifications'),
      isActive: location.pathname === '/dashboard' && location.search.includes('tab=notifications'),
      hasNotification: notificationCount > 0,
      notificationCount
    }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 md:hidden">
      <div className="flex justify-around items-center py-1">
        {navItems.map((item, index) => (
          <button
            key={index}
            onClick={item.action}
            className={`flex flex-col items-center justify-center px-3 py-2 relative ${
              item.isSpecial 
                ? 'text-teal-600' 
                : item.isActive 
                  ? 'text-blue-600' 
                  : 'text-gray-600'
            } transition-colors duration-200`}
          >
            <div className="relative">
              <item.icon 
                size={20} 
                className={item.isSpecial ? 'text-teal-600' : ''} 
              />
              {item.hasNotification && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
                  {item.notificationCount}
                </span>
              )}
            </div>
            <span className="text-xs mt-1">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default BottomNavigation;