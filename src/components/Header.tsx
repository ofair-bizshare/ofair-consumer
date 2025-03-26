
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
          <div className="text-2xl font-bold text-blue-700 animate-fade-in">
            <span className="text-teal-500">o</span>Fair
          </div>
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
          <a 
            href="https://biz.ofair.co.il" 
            target="_blank" 
            rel="noopener noreferrer"
            className="hidden md:block text-blue-700 hover:text-blue-800 font-medium transition-colors"
          >
            כניסת בעלי מקצוע
          </a>

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
            <div className="py-2">
              <a 
                href="https://biz.ofair.co.il" 
                target="_blank" 
                rel="noopener noreferrer"
                className="block w-full text-center text-blue-700 font-medium py-2"
              >
                כניסת בעלי מקצוע
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
