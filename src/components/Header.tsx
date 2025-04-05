
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import UserDropdown from './header/UserDropdown';
import MobileMenu from './header/MobileMenu';
import DesktopNav from './header/DesktopNav';
import { useAuth } from '@/providers/AuthProvider';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

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

  const handleLogout = () => {
    signOut();
    navigate('/');
  };

  const handleSendRequest = () => {
    if (user) {
      if (location.pathname === '/dashboard') {
        // If we're already on the dashboard, scroll to the requests section
        const requestsSection = document.getElementById('requests-section');
        if (requestsSection) {
          requestsSection.scrollIntoView({ behavior: 'smooth' });
        }
      } else {
        navigate('/dashboard');
      }
    } else {
      if (location.pathname === '/') {
        const formSection = document.getElementById('request-form-section');
        if (formSection) {
          formSection.scrollIntoView({ behavior: 'smooth' });
        }
      } else {
        navigate('/#request-form-section');
      }
    }
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/90 backdrop-blur-md shadow-md py-3' : 'bg-transparent py-5'}`}>
      <div className="container mx-auto flex items-center justify-between px-[32px]">
        <Link to="/" className="flex items-center">
          <img alt="Ofair Logo" src="/lovable-uploads/52b937d1-acd7-4831-b19e-79a55a774829.png" className="h-7 animate-fade-in object-contain" />
        </Link>

        <DesktopNav onSendRequest={handleSendRequest} />

        <div className="flex items-center gap-4 animate-fade-in">
          <a 
            href="https://biz.ofair.co.il" 
            target="_blank" 
            rel="noopener noreferrer"
            className="hidden md:inline-block text-xs text-teal-600 hover:text-teal-700 py-1 px-2 transition-colors"
          >
            בעל מקצוע? הצטרף
          </a>

          {user ? (
            <UserDropdown onLogout={handleLogout} />
          ) : (
            <Button 
              variant="ghost" 
              className="hidden md:flex items-center space-x-2 text-blue-700 hover:text-blue-800 hover:bg-blue-50"
              onClick={handleLoginClick}
            >
              <User size={18} />
              <span>כניסה / הרשמה</span>
            </Button>
          )}

          <button className="md:hidden text-gray-800" onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Toggle menu">
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      <MobileMenu 
        isLoggedIn={!!user}
        isOpen={isMenuOpen}
        onSendRequest={handleSendRequest}
        onLogout={handleLogout}
        onClose={() => setIsMenuOpen(false)}
      />
    </header>
  );
};

export default Header;
