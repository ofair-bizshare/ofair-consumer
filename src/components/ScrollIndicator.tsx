
import React, { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

interface ScrollIndicatorProps {
  targetId: string;
  text?: string;
}

const ScrollIndicator: React.FC<ScrollIndicatorProps> = ({ 
  targetId, 
  text = "גלול למטה לגילוי עוד" 
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      // Hide the indicator when scrolled down a bit
      if (window.scrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTarget = () => {
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  if (!isVisible) return null;

  return (
    <div 
      className="flex flex-col items-center justify-center absolute bottom-8 left-0 right-0 animate-bounce cursor-pointer transition-opacity duration-300"
      onClick={scrollToTarget}
    >
      <p className="text-white text-sm font-medium mb-2 bg-black/30 px-3 py-1 rounded-full backdrop-blur-sm">
        {text}
      </p>
      <ChevronDown className="h-8 w-8 text-white bg-black/30 rounded-full p-1 backdrop-blur-sm" />
    </div>
  );
};

export default ScrollIndicator;
