
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
    <div className="absolute top-full left-0 right-0 bg-white shadow-lg z-50 py-4 border-t border-gray-100">
      <div className="container mx-auto px-6">
        <div className="flex flex-col space-y-4">
          <button
            onClick={() => { onSendRequest(); onClose(); }}
            className="flex items-center justify-between py-3 border-b border-gray-100"
          >
            <span className="text-[#00d09e] font-medium">שליחת בקשה</span>
            <Send size={18} className="text-[#00d09e]" />
          </button>
          
          <Link 
            to="/search" 
            className="flex items-center justify-between py-3 border-b border-gray-100"
            onClick={handleItemClick}
          >
            <span>חיפוש בעלי מקצוע</span>
            <Search size={18} className="text-gray-500" />
          </Link>
          
          <Link 
            to="/articles" 
            className="flex items-center justify-between py-3 border-b border-gray-100"
            onClick={handleItemClick}
          >
            <span>טיפים ומאמרים</span>
            <Book size={18} className="text-gray-500" />
          </Link>
          
          <Link 
            to="/contact" 
            className="flex items-center justify-between py-3 border-b border-gray-100"
            onClick={handleItemClick}
          >
            <span>צור קשר</span>
            <Phone size={18} className="text-gray-500" />
          </Link>
          
          <Link 
            to="/about" 
            className="flex items-center justify-between py-3 border-b border-gray-100"
            onClick={handleItemClick}
          >
            <span>אודות</span>
            <Info size={18} className="text-gray-500" />
          </Link>
          
          {isLoggedIn ? (
            <div className="mt-2 mb-2">
              <div className="text-teal-600 text-center mb-3 text-sm">בעל מקצוע? הצטרף עכשיו</div>
              
              <Card 
                className="flex items-center justify-between px-4 py-3 rounded-md mb-2 shadow-sm border-gray-200"
                onClick={() => { navigate('/dashboard'); onClose(); }}
              >
                <span>אזור אישי</span>
                <UserCircle size={18} className="text-gray-500" />
              </Card>
              
              <Card 
                className="flex items-center justify-between px-4 py-3 rounded-md mb-2 shadow-sm border-gray-200"
                onClick={() => { navigate('/referrals'); onClose(); }}
              >
                <span>הפניות שלי</span>
                <Inbox size={18} className="text-gray-500" />
              </Card>
              
              <Card 
                className="flex items-center justify-between px-4 py-3 rounded-md mb-2 shadow-sm border-gray-200 relative"
                onClick={handleNotificationsClick}
              >
                <span>התראות</span>
                <div className="flex items-center">
                  {notificationCount > 0 && (
                    <span className="absolute left-2 top-0 transform -translate-y-1/2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                      {notificationCount}
                    </span>
                  )}
                  <Bell size={18} className="text-gray-500" />
                </div>
              </Card>
              
              <Card 
                className="flex items-center justify-between px-4 py-3 rounded-md mb-4 shadow-sm border-gray-200"
                onClick={() => { navigate('/settings'); onClose(); }}
              >
                <span>הגדרות</span>
                <Settings size={18} className="text-gray-500" />
              </Card>
              
              <Card 
                className="flex items-center justify-between px-4 py-3 rounded-md shadow-sm border-gray-200 mb-2 text-red-600"
                onClick={() => { onLogout(); onClose(); }}
              >
                <span className="text-red-600">יציאה</span>
                <LogOut size={18} className="text-red-600" />
              </Card>
            </div>
          ) : (
            <Link 
              to="/login" 
              className="flex items-center justify-between py-3"
              onClick={handleItemClick}
            >
              <span>כניסה / הרשמה</span>
              <User size={18} className="text-gray-500" />
            </Link>
          )}
          
          <a 
            href="https://biz.ofair.co.il" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="mt-4 block text-center text-xs text-teal-600 px-4 py-3 border border-teal-200 rounded-md bg-teal-50"
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
