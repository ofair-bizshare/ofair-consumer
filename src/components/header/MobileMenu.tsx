
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import UserDropdown from './UserDropdown';

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

  if (!isOpen) return null;

  return (
    <div className="md:hidden absolute top-full left-0 right-0 bg-white shadow-lg border-t border-gray-100 animate-fade-in-down">
      <div className="container mx-auto px-6 py-4 flex flex-col space-y-4">
        <button
          onClick={() => {
            onSendRequest();
            onClose();
          }}
          className="text-teal-600 font-medium py-2 border-b border-gray-100 flex items-center bg-transparent border-none text-right w-full"
        >
          <Send size={18} className="ml-2" />
          שליחת פנייה
        </button>
        <Link to="/search" className="text-gray-800 py-2 border-b border-gray-100" onClick={onClose}>
          חיפוש בעלי מקצוע
        </Link>
        <Link to="/articles" className="text-gray-800 py-2 border-b border-gray-100" onClick={onClose}>
          טיפים ומאמרים
        </Link>
        <Link to="/about" className="text-gray-800 py-2 border-b border-gray-100" onClick={onClose}>
          אודות
        </Link>
        <a 
          href="https://biz.ofair.co.il" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-gray-800 py-2 border-b border-gray-100 text-teal-500 font-medium"
          onClick={onClose}
        >
          בעל מקצוע? הצטרף עכשיו
        </a>
        <div className="py-2">
          {isLoggedIn ? (
            <UserDropdown onLogout={onLogout} isMobile={true} />
          ) : (
            <Button variant="outline" className="w-full justify-center" onClick={() => {
              onClose();
              navigate('/login');
            }}>
              כניסה / הרשמה
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MobileMenu;
