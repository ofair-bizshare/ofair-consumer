
import React from 'react';
import { Link } from 'react-router-dom';
import { Send } from 'lucide-react';

interface DesktopNavProps {
  onSendRequest: () => void;
}

const DesktopNav: React.FC<DesktopNavProps> = ({
  onSendRequest
}) => {
  return (
    <nav className="hidden md:flex mx-0 px-0">
      <button 
        onClick={onSendRequest} 
        className="text-gray-800 hover:text-[#00d09e] transition-colors mx-[20px] bg-transparent border-none cursor-pointer"
      >
        <span className="flex flex-row-reverse items-center">
          <span className="font-semibold text-[#00d09e]">שליחת בקשה</span>
          <Send size={18} className="mr-1" />
        </span>
      </button>
      <Link to="/search" className="text-gray-800 hover:text-[#00d09e] transition-colors mx-[23px]">
        חיפוש בעלי מקצוע
      </Link>
      <Link to="/articles" className="text-gray-800 hover:text-[#00d09e] transition-colors mx-[23px]">
        טיפים ומאמרים
      </Link>
      <Link to="/contact" className="text-gray-800 hover:text-[#00d09e] transition-colors mx-[23px]">
        צור קשר
      </Link>
      <Link to="/about" className="text-gray-800 hover:text-[#00d09e] transition-colors mx-[23px] px-[8px]">
        אודות
      </Link>
    </nav>
  );
};

export default DesktopNav;
