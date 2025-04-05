
import React from 'react';
import { Link } from 'react-router-dom';
import { Send, User, Search, Book, Info, LogOut, Phone } from 'lucide-react';

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
  if (!isOpen) {
    return null;
  }

  const handleItemClick = () => {
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
            <button
              onClick={() => { onLogout(); onClose(); }}
              className="flex items-center justify-between py-3"
            >
              <span className="text-red-600">התנתק</span>
              <LogOut size={18} className="text-red-600" />
            </button>
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
