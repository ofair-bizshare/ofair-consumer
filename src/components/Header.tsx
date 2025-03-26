
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, User } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/90 backdrop-blur-md shadow-md py-3' : 'bg-transparent py-5'
      }`}
    >
      <div className="container mx-auto px-6 flex items-center justify-between">
        <Link to="/" className="flex items-center">
          <img 
            src="/lovable-uploads/1a2c3d92-c7dd-41ef-bc39-b244797da4b2.png" 
            alt="Ofair Logo" 
            className="h-14 animate-fade-in"
          />
        </Link>

        <nav className={`hidden md:flex items-center space-x-8 animate-fade-in-down`}>
          <Link to="/" className="text-gray-800 hover:text-teal-500 transition-colors">
            דף הבית
          </Link>
          <Link to="/search" className="text-gray-800 hover:text-teal-500 transition-colors">
            חיפוש בעלי מקצוע
          </Link>
          <Link to="/articles" className="text-gray-800 hover:text-teal-500 transition-colors">
            טיפים ומאמרים
          </Link>
          <Link to="/about" className="text-gray-800 hover:text-teal-500 transition-colors">
            אודות
          </Link>
        </nav>

        <div className="flex items-center space-x-4 animate-fade-in">
          <Button variant="ghost" className="hidden md:flex items-center space-x-2 text-blue-700 hover:text-blue-800 hover:bg-blue-50">
            <User size={18} />
            <span>כניסה / הרשמה</span>
          </Button>

          <button
            className="md:hidden text-gray-800"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white shadow-lg border-t border-gray-100 animate-fade-in-down">
          <div className="container mx-auto px-6 py-4 flex flex-col space-y-4">
            <Link 
              to="/" 
              className="text-gray-800 py-2 border-b border-gray-100"
              onClick={() => setIsMenuOpen(false)}
            >
              דף הבית
            </Link>
            <Link 
              to="/search" 
              className="text-gray-800 py-2 border-b border-gray-100"
              onClick={() => setIsMenuOpen(false)}
            >
              חיפוש בעלי מקצוע
            </Link>
            <Link 
              to="/articles" 
              className="text-gray-800 py-2 border-b border-gray-100"
              onClick={() => setIsMenuOpen(false)}
            >
              טיפים ומאמרים
            </Link>
            <Link 
              to="/about" 
              className="text-gray-800 py-2 border-b border-gray-100"
              onClick={() => setIsMenuOpen(false)}
            >
              אודות
            </Link>
            <div className="py-2">
              <Button variant="outline" className="w-full justify-center">
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
