import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Send, User, Search, Book, Info, LogOut, Phone, Bell, Settings, Inbox, UserCircle, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/providers/AuthProvider';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { fetchUserNotifications } from '@/services/notifications';
import { useIsMobile } from '@/hooks/use-mobile';

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
  const isMobile = useIsMobile();
  const [notificationCount, setNotificationCount] = useState(0);
  
  // Load notification count when component mounts
  React.useEffect(() => {
    if (isLoggedIn) {
      const loadNotifications = async () => {
        const notifications = await fetchUserNotifications();
        const unreadCount = notifications.filter(n => !n.isRead).length;
        setNotificationCount(unreadCount);
      };
      
      loadNotifications();
    }
  }, [isLoggedIn]);
  
  if (!isOpen) {
    return null;
  }

  const handleItemClick = () => {
    onClose();
  };

  const handleNavigate = (path: string) => {
    navigate(path);
    onClose();
  };

  // Use Sheet component for a styled drawer on mobile devices
  if (isMobile) {
    return (
      <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <SheetContent className="p-0 shadow-none border-none bg-gray-50">
          <div className="flex items-center justify-between p-4 bg-gray-100 border-b border-gray-200">
            <button onClick={onClose}>
              <X size={24} className="text-gray-700" />
            </button>
            <div className="ml-auto">
              <img alt="Ofair Logo" src="/lovable-uploads/52b937d1-acd7-4831-b19e-79a55a774829.png" className="h-7 object-contain" />
            </div>
          </div>

          <div className="flex flex-col px-0 pt-4">
            {/* Main menu items section */}
            <div className="px-4 mb-6">
              <button
                onClick={() => { onSendRequest(); onClose(); }}
                className="flex items-center justify-between py-4 w-full border-b border-gray-200"
              >
                <span className="text-[#00d09e] font-medium text-lg">שליחת פנייה</span>
                <Send size={20} className="text-[#00d09e]" />
              </button>
              
              <Link 
                to="/search" 
                className="flex items-center justify-between py-4 w-full border-b border-gray-200"
                onClick={handleItemClick}
              >
                <span className="text-gray-800 text-lg">חיפוש בעלי מקצוע</span>
                <Search size={20} className="text-gray-500" />
              </Link>
              
              <Link 
                to="/articles" 
                className="flex items-center justify-between py-4 w-full border-b border-gray-200"
                onClick={handleItemClick}
              >
                <span className="text-gray-800 text-lg">טיפים ומאמרים</span>
                <Book size={20} className="text-gray-500" />
              </Link>
              
              <Link 
                to="/about" 
                className="flex items-center justify-between py-4 w-full border-b border-gray-200"
                onClick={handleItemClick}
              >
                <span className="text-gray-800 text-lg">אודות</span>
                <Info size={20} className="text-gray-500" />
              </Link>
            </div>
            
            <div className="px-4 mb-5">
              <Link
                to="https://biz.ofair.co.il"
                target="_blank"
                rel="noopener noreferrer"
                className="text-teal-500 text-center py-2 block"
                onClick={handleItemClick}
              >
                בעל מקצוע? הצטרף עכשיו
              </Link>
            </div>

            {/* User profile related buttons */}
            {isLoggedIn ? (
              <div className="px-4 space-y-3">
                <button
                  onClick={() => handleNavigate('/dashboard')}
                  className="flex items-center justify-between w-full p-4 bg-white rounded-md border border-gray-200"
                >
                  <span className="text-gray-800">אזור אישי</span>
                  <UserCircle size={20} className="text-gray-500" />
                </button>
                
                <button
                  onClick={() => handleNavigate('/referrals')}
                  className="flex items-center justify-between w-full p-4 bg-white rounded-md border border-gray-200"
                >
                  <span className="text-gray-800">הפניות שלי</span>
                  <Inbox size={20} className="text-gray-500" />
                </button>
                
                <button
                  onClick={() => handleNavigate('/dashboard?tab=notifications')}
                  className="flex items-center justify-between w-full p-4 bg-white rounded-md border border-gray-200 relative"
                >
                  <span className="text-gray-800">התראות</span>
                  <div className="relative">
                    <Bell size={20} className="text-gray-500" />
                    {notificationCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {notificationCount}
                      </span>
                    )}
                  </div>
                </button>
                
                <button
                  onClick={() => handleNavigate('/dashboard/settings')}
                  className="flex items-center justify-between w-full p-4 bg-white rounded-md border border-gray-200"
                >
                  <span className="text-gray-800">הגדרות</span>
                  <Settings size={20} className="text-gray-500" />
                </button>
                
                <button
                  onClick={() => { onLogout(); onClose(); }}
                  className="flex items-center justify-between w-full p-4 bg-white rounded-md border border-gray-200"
                >
                  <span className="text-red-600">יציאה</span>
                  <LogOut size={20} className="text-red-600" />
                </button>
              </div>
            ) : (
              <div className="px-4">
                <Link 
                  to="/login" 
                  className="flex items-center justify-between w-full p-4 bg-white rounded-md border border-gray-200"
                  onClick={handleItemClick}
                >
                  <span className="text-gray-800">כניסה / הרשמה</span>
                  <User size={20} className="text-gray-500" />
                </Link>
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  // Fallback to the original dropdown menu for non-mobile devices
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
            <>
              <Link 
                to="/dashboard" 
                className="flex items-center justify-between py-3 border-b border-gray-100"
                onClick={handleItemClick}
              >
                <span>אזור אישי</span>
                <UserCircle size={18} className="text-gray-500" />
              </Link>
              
              <Link 
                to="/referrals" 
                className="flex items-center justify-between py-3 border-b border-gray-100"
                onClick={handleItemClick}
              >
                <span>הפניות שלי</span>
                <Inbox size={18} className="text-gray-500" />
              </Link>
              
              <button
                onClick={() => { handleNavigate('/dashboard?tab=notifications'); }}
                className="flex items-center justify-between py-3 border-b border-gray-100"
              >
                <span>התראות</span>
                <Bell size={18} className="text-gray-500" />
              </button>
              
              <Link 
                to="/dashboard/settings" 
                className="flex items-center justify-between py-3 border-b border-gray-100"
                onClick={handleItemClick}
              >
                <span>הגדרות</span>
                <Settings size={18} className="text-gray-500" />
              </Link>
              
              <button
                onClick={() => { onLogout(); onClose(); }}
                className="flex items-center justify-between py-3"
              >
                <span className="text-red-600">התנתק</span>
                <LogOut size={18} className="text-red-600" />
              </button>
            </>
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
