
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import UserDropdown from './UserDropdown';

interface MobileMenuProps {
  isOpen: boolean;
  isLoggedIn: boolean;
  onSendRequest: () => void;
  onLogout: () => void;
  onClose: () => void;
}

export const MobileMenu: React.FC<MobileMenuProps> = ({
  isOpen,
  isLoggedIn,
  onSendRequest,
  onLogout,
  onClose,
}) => {
  const navigate = useNavigate();
  
  const handleLogin = () => {
    onClose();
    navigate('/login');
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-white z-40 md:hidden">
      <div className="container mx-auto px-5 py-6">
        <div className="flex justify-end mb-4">
          <button onClick={onClose} className="p-2" aria-label="Close menu">
            <X size={24} />
          </button>
        </div>
        
        <nav>
          <ul className="space-y-4">
            <li>
              <Link to="/" className="block py-2 text-lg font-medium" onClick={onClose}>ראשי</Link>
            </li>
            <li>
              <Link to="/search" className="block py-2 text-lg font-medium" onClick={onClose}>בעלי מקצוע</Link>
            </li>
            <li>
              <Link to="/articles" className="block py-2 text-lg font-medium" onClick={onClose}>מאמרים</Link>
            </li>
            <li>
              <Link to="/referrals" className="block py-2 text-lg font-medium" onClick={onClose}>הפניות</Link>
            </li>
            <li>
              <Link to="/contact" className="block py-2 text-lg font-medium" onClick={onClose}>צור קשר</Link>
            </li>
            <li>
              <Link to="/about" className="block py-2 text-lg font-medium" onClick={onClose}>אודות</Link>
            </li>
            <li>
              <Link to="/faq" className="block py-2 text-lg font-medium" onClick={onClose}>שאלות נפוצות</Link>
            </li>
            <div className="border-t border-gray-200 my-4"></div>
            
            <Button 
              variant="ghost"
              className="w-full justify-start text-lg font-medium" 
              onClick={onSendRequest}
            >
              שליחת בקשה למקצוען
            </Button>
            
            {!isLoggedIn && (
              <Button 
                variant="outline" 
                className="w-full mt-4" 
                onClick={handleLogin}
              >
                כניסה / הרשמה
              </Button>
            )}
          </ul>
        </nav>
        
        {isLoggedIn && (
          <div className="mt-10">
            <UserDropdown onLogout={onLogout} isMobile={true} />
          </div>
        )}
        
      </div>
    </div>
  );
};
