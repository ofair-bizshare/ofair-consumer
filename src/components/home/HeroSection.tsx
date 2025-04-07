
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { FileText, Search, Gift, ThumbsUp, ChevronDown } from 'lucide-react';
import RequestForm from '@/components/RequestForm';

interface HeroSectionProps {
  scrollToRequestForm: () => void;
  scrollToSearchSection: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({
  scrollToRequestForm,
  scrollToSearchSection,
}) => {
  return (
    <section className="relative pt-28 pb-16 md:pt-32 md:pb-24 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-teal-50 z-[-1]"></div>
      <div className="absolute inset-0 z-[-1] opacity-50 bg-[url('https://images.unsplash.com/photo-1612968953208-56c5052b9ec4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80')] bg-cover bg-center"></div>
      <div className="absolute inset-0 bg-white/60 backdrop-blur-sm z-[-1]"></div>
      
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-start lg:items-start gap-8">
          {/* Left side - Text content */}
          <div className="w-full lg:w-1/2 animate-fade-in-up relative z-10">
            <div className="text-base font-semibold text-[#00D09E] mb-3 flex items-center">
              <ThumbsUp className="w-5 h-5 inline-block ml-2" />
              oFair - הפתרון המושלם לבעלי בתים
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-blue-800 mb-4 leading-tight">
              מצאו את 
              <span className="text-[#00D09E] mx-2">בעל המקצוע</span>
              המושלם לכל עבודה
            </h1>
            <p className="text-lg text-gray-700 mb-6">פלטפורמה חינמית המחברת בין בעלי בתים לבעלי מקצוע מובילים בתחומם. קבלו הצעות מחיר וזמינות ללא התחייבות ובחרו את המקצוען הנכון עבורכם בקלות וביעילות.</p>
            <div className="flex flex-wrap gap-4 mb-8 lg:mb-0">
              <Button size="lg" className="bg-[#00D09E] hover:bg-[#00C090] text-white button-transition flex items-center gap-2 shadow-md" onClick={scrollToRequestForm}>
                <FileText size={20} />
                שליחת פנייה לבעלי מקצוע
              </Button>
              <Link to="/search">
                <Button size="lg" variant="outline" className="border-blue-500 text-blue-700 hover:bg-blue-50 button-transition flex items-center gap-2">
                  <Search size={20} />
                  חיפוש בעלי מקצוע
                </Button>
              </Link>
            </div>
            {/* Add new cashback benefit info */}
            <div className="mt-6 p-4 bg-blue-50 border-2 border-blue-200 rounded-lg shadow-sm">
              <div className="flex items-start">
                <Gift className="h-6 w-6 text-[#00D09E] mt-1 ml-2 flex-shrink-0" />
                <div>
                  <h3 className="font-bold text-blue-800 text-lg">5% חזרה לעבודה הבאה!</h3>
                  <p className="text-gray-700">קבלו 5% חזרה על העבודה הראשונה דרך oFair, לשימוש בעבודה הבאה שלכם.</p>
                  <Link to="/dashboard" className="text-[#00D09E] hover:underline mt-2 inline-block font-medium">
                    הצג את הקרדיט שלי ←
                  </Link>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right side - Form with decorative elements */}
          <div className="w-full lg:w-1/2 animate-fade-in pt-0 relative z-10">
            {/* Decorative elements */}
            <div className="absolute -top-12 -right-12 w-24 h-24 bg-gradient-to-br from-blue-400 to-teal-300 rounded-full blur-xl opacity-30 hidden lg:block"></div>
            <div className="absolute -bottom-8 -left-8 w-20 h-20 bg-gradient-to-br from-yellow-400 to-amber-300 rounded-full blur-lg opacity-30 hidden lg:block"></div>
            
            <div id="request-form" className="relative">
              <div className="absolute -top-4 -left-4 w-8 h-8 bg-[#00D09E] rounded-full opacity-80 animate-pulse hidden md:block"></div>
              <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-blue-500 rounded-full opacity-70 animate-pulse hidden md:block"></div>
              <RequestForm />
            </div>
          </div>
        </div>
        
        {/* Scroll indicator */}
        <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 text-center hidden md:block animate-bounce">
          <div className="flex flex-col items-center cursor-pointer" onClick={scrollToSearchSection}>
            <p className="text-blue-700 mb-2 font-medium">חפש בעלי מקצוע מובילים</p>
            <div className="bg-[#00D09E] rounded-full p-2 text-white">
              <ChevronDown size={24} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
