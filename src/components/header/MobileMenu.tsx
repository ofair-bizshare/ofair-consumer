
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import UserDropdown from './UserDropdown';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose
} from '@/components/ui/sheet';

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
  
  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent side="right" className="w-[85%] max-w-sm p-0 bg-white border-l shadow-lg">
        <SheetHeader className="p-4 border-b">
          <SheetTitle className="text-right">תפריט</SheetTitle>
          <SheetClose className="absolute right-4 top-4">
            <X size={24} />
            <span className="sr-only">סגירה</span>
          </SheetClose>
        </SheetHeader>
        
        <div className="px-4 py-6">
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
                <Link to="/about" className="block py-2 text-lg font-medium" onClick={onClose}>אודות</Link>
              </li>
              <li>
                <Link to="/faq" className="block py-2 text-lg font-medium" onClick={onClose}>שאלות נפוצות</Link>
              </li>
              <li>
                <Link to="/contact" className="block py-2 text-lg font-medium" onClick={onClose}>צור קשר</Link>
              </li>
              <div className="border-t border-gray-200 my-4"></div>
              
              <Button 
                variant="ghost"
                className="w-full justify-start text-lg font-medium" 
                onClick={() => {
                  onSendRequest();
                  onClose();
                }}
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
      </SheetContent>
    </Sheet>
  );
};
