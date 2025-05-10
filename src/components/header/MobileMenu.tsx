
import React from 'react';
import { Link } from 'react-router-dom';
import { Send, User, Search, Book, Info, LogOut, Phone, Bell, Settings, Inbox, UserCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/providers/AuthProvider';
import { fetchUserNotifications } from '@/services/notifications';
import { useIsMobile } from '@/hooks/use-mobile';
import { Card } from '@/components/ui/card';

interface MobileMenuProps {
  isLoggedIn: boolean;
  isOpen: boolean;
  onSendRequest: () => void;
  onLogout: () => void;
  onClose: () => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({
  isLoggedIn,
  isOpen,
  onSendRequest,
  onLogout,
  onClose
}) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [notificationCount, setNotificationCount] = React.useState<number>(0);
  
  React.useEffect(() => {
    const getNotifications = async () => {
      if (isLoggedIn) {
        const notifications = await fetchUserNotifications();
        const unreadCount = notifications.filter(n => !n.isRead).length;
        setNotificationCount(unreadCount);
      }
    };
    
    getNotifications();
  }, [isLoggedIn]);
  
  if (!isOpen) {
    return null;
  }

  const handleItemClick = () => {
    onClose();
  };

  const handleNotificationsClick = () => {
    navigate('/dashboard?tab=notifications');
    onClose();
  };

  return (
    <div className="fixed top-[46px] sm:top-[53px] inset-x-0 bg-white shadow-lg z-50 overflow-y-auto max-h-[85vh] border-t border-gray-100">
      <div className="px-4 py-3">
        <div className="flex flex-col space-y-3">
          <button
            onClick={() => { onSendRequest(); onClose(); }}
            className="flex items-center justify-between py-2.5 border-b border-gray-100"
          >
            <span className="text-[#00d09e] font-medium">שליחת בקשה</span>
            <Send size={16} className="text-[#00d09e]" />
          </button>
          
          <Link 
            to="/search" 
            className="flex items-center justify-between py-2.5 border-b border-gray-100"
            onClick={handleItemClick}
          >
            <span className="text-sm">חיפוש בעלי מקצוע</span>
            <Search size={16} className="text-gray-500" />
          </Link>
          
          <Link 
            to="/articles" 
            className="flex items-center justify-between py-2.5 border-b border-gray-100"
            onClick={handleItemClick}
          >
            <span className="text-sm">טיפים ומאמרים</span>
            <Book size={16} className="text-gray-500" />
          </Link>
          
          <Link 
            to="/contact" 
            className="flex items-center justify-between py-2.5 border-b border-gray-100"
            onClick={handleItemClick}
          >
            <span className="text-sm">צור קשר</span>
            <Phone size={16} className="text-gray-500" />
          </Link>
          
          <Link 
            to="/about" 
            className="flex items-center justify-between py-2.5 border-b border-gray-100"
            onClick={handleItemClick}
          >
            <span className="text-sm">אודות</span>
            <Info size={16} className="text-gray-500" />
          </Link>
          
          {isLoggedIn ? (
            <div className="mt-1 mb-1">
              <div className="text-teal-600 text-center mb-2 text-xs">בעל מקצוע? הצטרף עכשיו</div>
              
              <Card 
                className="flex items-center justify-between px-3 py-2 rounded-md mb-2 shadow-sm border-gray-200"
                onClick={() => { navigate('/dashboard'); onClose(); }}
              >
                <span className="text-xs">אזור אישי</span>
                <UserCircle size={16} className="text-gray-500" />
              </Card>
              
              <Card 
                className="flex items-center justify-between px-3 py-2 rounded-md mb-2 shadow-sm border-gray-200"
                onClick={() => { navigate('/referrals'); onClose(); }}
              >
                <span className="text-xs">הפניות שלי</span>
                <Inbox size={16} className="text-gray-500" />
              </Card>
              
              <Card 
                className="flex items-center justify-between px-3 py-2 rounded-md mb-2 shadow-sm border-gray-200 relative"
                onClick={handleNotificationsClick}
              >
                <span className="text-xs">התראות</span>
                <div className="flex items-center">
                  {notificationCount > 0 && (
                    <span className="absolute left-2 top-0 transform -translate-y-1/2 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-[10px]">
                      {notificationCount}
                    </span>
                  )}
                  <Bell size={16} className="text-gray-500" />
                </div>
              </Card>
              
              <Card 
                className="flex items-center justify-between px-3 py-2 rounded-md mb-3 shadow-sm border-gray-200"
                onClick={() => { navigate('/dashboard/settings'); onClose(); }}
              >
                <span className="text-xs">הגדרות</span>
                <Settings size={16} className="text-gray-500" />
              </Card>
              
              <Card 
                className="flex items-center justify-between px-3 py-2 rounded-md shadow-sm border-gray-200 mb-2 text-red-600"
                onClick={() => { onLogout(); onClose(); }}
              >
                <span className="text-red-600 text-xs">יציאה</span>
                <LogOut size={16} className="text-red-600" />
              </Card>
            </div>
          ) : (
            <Link 
              to="/login" 
              className="flex items-center justify-between py-2.5"
              onClick={handleItemClick}
            >
              <span className="text-sm">כניסה / הרשמה</span>
              <User size={16} className="text-gray-500" />
            </Link>
          )}
          
          <a 
            href="https://biz.ofair.co.il" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="mt-2 block text-center text-xs text-teal-600 px-4 py-2 border border-teal-200 rounded-md bg-teal-50"
            onClick={handleItemClick}
          >
            בעל מקצוע? הצטרף לפלטפורמה
          </a>
        </div>
      </div>
    </div>
  );
};

export default MobileMenu;
