
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { FileText, Search } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface CtaSectionProps {
  scrollToRequestForm: () => void;
}

const CtaSection: React.FC<CtaSectionProps> = ({ scrollToRequestForm }) => {
  const isMobile = useIsMobile();
  
  return (
    <section className="py-16 md:py-24 bg-blue-700 text-white relative w-full">
      <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1590479773265-7464e5d48118?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80')] bg-cover bg-center"></div>
      <div className="container mx-auto px-4 text-center relative z-10">
        <h2 className="text-2xl md:text-4xl font-bold mb-4 md:mb-6 mx-auto">
          מוכנים למצוא את
          <span className="text-[#00D09E] mx-1 md:mx-2">בעל המקצוע</span>
          המושלם?
        </h2>
        <p className="text-blue-100 max-w-2xl mx-auto mb-6 md:mb-10 text-sm md:text-lg">
          אלפי בעלי מקצוע מחכים לעזור לכם. שלחו בקשה עכשיו וקבלו הצעות מחיר בחינם.
        </p>
        <div className="flex flex-wrap justify-center gap-3 md:gap-4 w-full">
          <Button 
            size={isMobile ? "default" : "lg"} 
            className="bg-[#00D09E] hover:bg-[#00C090] text-white button-transition flex items-center gap-1 md:gap-2" 
            onClick={scrollToRequestForm}
          >
            <FileText size={isMobile ? 16 : 20} />
            <span className="text-sm md:text-base">שלח בקשה עכשיו</span>
          </Button>
          <Link to="/search">
            <Button 
              size={isMobile ? "default" : "lg"} 
              variant="outline" 
              className="border-white button-transition flex items-center gap-1 md:gap-2 text-green-50 bg-blue-900 hover:bg-blue-800"
            >
              <Search size={isMobile ? 16 : 20} />
              <span className="text-sm md:text-base">חפש בעלי מקצוע</span>
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CtaSection;
