
import React, { lazy, Suspense } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { FileText, Search, Gift, ThumbsUp, ChevronDown } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import OptimizedImage from '@/components/OptimizedImage';

// Lazy load RequestForm to reduce initial bundle size
const RequestForm = lazy(() => import('@/components/RequestForm'));

interface HeroSectionProps {
  scrollToRequestForm: () => void;
  scrollToSearchSection: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({
  scrollToRequestForm,
  scrollToSearchSection
}) => {
  const isMobile = useIsMobile();

  return (
    <section className="relative pt-20 pb-16 md:pt-32 md:pb-24 overflow-hidden w-full">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-teal-50 z-[-1]"></div>
      
      {/* Optimized background image with responsive loading */}
      <div className="absolute inset-0 z-[-1] opacity-50">
        <OptimizedImage
          src="https://images.unsplash.com/photo-1612968953208-56c5052b9ec4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80"
          alt="Background"
          className="w-full h-full object-cover"
          priority={true}
          sizes="100vw"
          width={1770}
          height={1000}
        />
      </div>
      
      <div className="absolute inset-0 bg-white/60 backdrop-blur-sm z-[-1]"></div>
      
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center lg:items-start gap-6 lg:gap-8 w-full">
          {/* Left side - Text content */}
          <div className="w-full lg:w-1/2 animate-fade-in-up relative z-10 text-right lg:text-right">
            {/* Moved the subtitle above the main heading */}
            <div className="text-base font-semibold text-[#00D09E] mb-3 flex items-center justify-end lg:justify-start">
              <ThumbsUp className="w-5 h-5 inline-block ml-2" />
              oFair - הפתרון המושלם לבעלי בתים
            </div>
            <h1 className="text-2xl md:text-3xl lg:text-5xl font-bold text-blue-800 mb-4 leading-tight">
              מצאו את 
              <span className="text-[#00D09E] mx-2">בעל המקצוע</span>
              המושלם לכל עבודה
            </h1>
            <p className="text-base lg:text-lg text-gray-700 mb-6">פלטפורמה חינמית המחברת בין בעלי בתים לבעלי מקצוע מובילים בתחומם. קבלו הצעות מחיר וזמינות ללא התחייבות ובחרו את המקצוען הנכון עבורכם בקלות וביעילות.</p>
            <div className="flex flex-wrap gap-3 mb-8 lg:mb-0 justify-center lg:justify-start">
              <Button size={isMobile ? "default" : "lg"} onClick={scrollToRequestForm} className="bg-[#00D09E] hover:bg-[#00C090] text-white button-transition flex items-center gap-1 shadow-md font-medium rounded-md">
                <FileText size={isMobile ? 16 : 20} />
                <span className="text-sm md:text-base">שליחת פנייה לבעלי מקצוע</span>
              </Button>
              <Link to="/search">
                <Button size={isMobile ? "default" : "lg"} variant="outline" className="border-blue-500 text-blue-700 hover:bg-blue-50 button-transition flex items-center gap-1 font-normal rounded-md">
                  <Search size={isMobile ? 16 : 20} />
                  <span className="text-sm md:text-base">חיפוש בעלי מקצוע</span>
                </Button>
              </Link>
            </div>
            {/* Add new cashback benefit info */}
            <div className="mt-6 p-3 md:p-4 bg-blue-50 border-2 border-blue-200 shadow-sm w-full rounded-xl">
              <div className="flex items-start">
                <Gift className="h-5 w-5 md:h-6 md:w-6 text-[#00D09E] mt-1 ml-2 flex-shrink-0" />
                <div>
                  <h3 className="font-bold text-blue-800 text-base md:text-lg">5% חזרה לעבודה הבאה!</h3>
                  <p className="text-gray-700 text-sm md:text-base">קבלו 5% חזרה על העבודה הראשונה דרך oFair, לשימוש בעבודה הבאה שלכם.</p>
                  <Link to="/dashboard" className="text-[#00D09E] hover:underline mt-1 inline-block font-medium text-sm">
                    הצג את הקרדיט שלי ←
                  </Link>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right side - Form with decorative elements */}
          <div className="w-full lg:w-1/2 animate-fade-in pt-4 lg:pt-0 relative z-10">
            {/* Decorative elements - hidden on mobile for better performance */}
            <div className="absolute -top-12 -right-12 w-24 h-24 bg-gradient-to-br from-blue-400 to-teal-300 rounded-full blur-xl opacity-30 hidden lg:block"></div>
            <div className="absolute -bottom-8 -left-8 w-20 h-20 bg-gradient-to-br from-yellow-400 to-amber-300 rounded-full blur-lg opacity-30 hidden lg:block"></div>
            
            <div id="request-form" className="relative w-full">
              <div className="absolute -top-4 -left-4 w-8 h-8 bg-[#00D09E] rounded-full opacity-80 animate-pulse hidden md:block"></div>
              <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-blue-500 rounded-full opacity-70 animate-pulse hidden md:block"></div>
              
              <Suspense fallback={
                <div className="bg-white rounded-xl shadow-lg p-6 animate-pulse">
                  <div className="h-8 bg-gray-200 rounded mb-4"></div>
                  <div className="space-y-3">
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-10 bg-gray-200 rounded"></div>
                  </div>
                </div>
              }>
                <RequestForm />
              </Suspense>
            </div>
          </div>
        </div>
        
        {/* Scroll indicator - optimized for mobile */}
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
