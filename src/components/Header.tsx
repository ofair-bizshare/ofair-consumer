
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, User } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLoginClick = () => {
    navigate('/login');
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/90 backdrop-blur-md shadow-md py-3' : 'bg-transparent py-5'}`}>
      <div className="container mx-auto flex items-center justify-between px-[32px]">
        <Link to="/" className="flex items-center">
          <img alt="Ofair Logo" src="/lovable-uploads/52b937d1-acd7-4831-b19e-79a55a774829.png" className="h-7 animate-fade-in object-contain" />
        </Link>

        <nav className="hidden md:flex mx-0 px-0">
          <Link to="/search" className="text-gray-800 hover:text-teal-500 transition-colors mx-[29px]">
            חיפוש בעלי מקצוע
          </Link>
          <Link to="/articles" className="text-gray-800 hover:text-teal-500 transition-colors mx-[25px]">
            טיפים ומאמרים
          </Link>
          <Link to="/about" className="text-gray-800 hover:text-teal-500 transition-colors mx-[23px] px-[8px]">
            אודות
          </Link>
        </nav>

        <div className="flex items-center gap-4 animate-fade-in">
          <a 
            href="https://biz.ofair.co.il" 
            target="_blank" 
            rel="noopener noreferrer"
            className="hidden md:inline-block text-xs text-teal-600 hover:text-teal-700 font-medium py-1 px-2 border border-teal-500 rounded transition-colors"
          >
            בעל מקצוע? הצטרף
          </a>

          <Button 
            variant="ghost" 
            className="hidden md:flex items-center space-x-2 text-blue-700 hover:text-blue-800 hover:bg-blue-50"
            onClick={handleLoginClick}
          >
            <User size={18} />
            <span>כניסה / הרשמה</span>
          </Button>

          <button className="md:hidden text-gray-800" onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Toggle menu">
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white shadow-lg border-t border-gray-100 animate-fade-in-down">
          <div className="container mx-auto px-6 py-4 flex flex-col space-y-4">
            <Link to="/search" className="text-gray-800 py-2 border-b border-gray-100" onClick={() => setIsMenuOpen(false)}>
              חיפוש בעלי מקצוע
            </Link>
            <Link to="/articles" className="text-gray-800 py-2 border-b border-gray-100" onClick={() => setIsMenuOpen(false)}>
              טיפים ומאמרים
            </Link>
            <Link to="/about" className="text-gray-800 py-2 border-b border-gray-100" onClick={() => setIsMenuOpen(false)}>
              אודות
            </Link>
            <a 
              href="https://biz.ofair.co.il" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-800 py-2 border-b border-gray-100 text-teal-500 font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              בעל מקצוע? הצטרף עכשיו
            </a>
            <div className="py-2">
              <Button variant="outline" className="w-full justify-center" onClick={() => {
                setIsMenuOpen(false);
                navigate('/login');
              }}>
                כניסה / הרשמה
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
