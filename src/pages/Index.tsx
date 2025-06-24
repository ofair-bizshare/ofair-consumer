
import React, { useRef, lazy, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ScrollIndicator from '@/components/ScrollIndicator';
import PerformanceMonitor from '@/components/PerformanceMonitor';
import { Helmet } from 'react-helmet-async';

// Lazy load non-critical sections
const PopularServicesSection = lazy(() => import('@/components/home/PopularServicesSection'));
const HowItWorksSection = lazy(() => import('@/components/home/HowItWorksSection'));
const TestimonialsSection = lazy(() => import('@/components/home/TestimonialsSection'));
const WhyChooseUsSection = lazy(() => import('@/components/home/WhyChooseUsSection'));
const ArticlesSection = lazy(() => import('@/components/home/ArticlesSection'));
const CtaSection = lazy(() => import('@/components/home/CtaSection'));

// Import critical sections normally
import HeroSection from '@/components/home/HeroSection';
import SearchSection from '@/components/home/SearchSection';

const Index = () => {
  const requestFormRef = useRef<HTMLDivElement>(null);
  const searchSectionRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  
  const scrollToRequestForm = () => {
    requestFormRef.current?.scrollIntoView({
      behavior: 'smooth'
    });
  };
  
  const scrollToSearchSection = () => {
    searchSectionRef.current?.scrollIntoView({
      behavior: 'smooth'
    });
  };

  const handleSearchSubmit = (profession: string, location: string) => {
    navigate(`/search?profession=${profession}&location=${location}`);
  };

  // Loading fallback component
  const SectionLoader = () => (
    <div className="py-16 animate-pulse">
      <div className="container mx-auto px-6">
        <div className="h-8 bg-gray-200 rounded w-1/3 mx-auto mb-8"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
          ))}
        </div>
      </div>
    </div>
  );
  
  return (
    <div className="flex flex-col min-h-screen" dir="rtl">
      <PerformanceMonitor />
      
      <Helmet>
        {/* Enhanced SEO and performance meta tags */}
        <title>oFair - מציאת בעלי מקצוע מובילים בכל תחום | פלטפורמת חיבור בין לקוחות למקצוענים</title>
        <meta name="description" content="פלטפורמה חינמית המחברת בין בעלי בתים לבעלי מקצוע אמינים ומקצועיים. קבלו הצעות מחיר ללא התחייבות ובחרו את המקצוען הנכון עבורכם." />
        <meta name="keywords" content="בעלי מקצוע, שיפוצים, חשמלאי, אינסטלציה, נגרות, גינון, ניקיון, צביעה, הובלות, מיזוג אוויר, תיקונים, שירותי בית" />
        
        {/* Open Graph optimized */}
        <meta property="og:title" content="oFair - מצא בעלי מקצוע מובילים לכל עבודה" />
        <meta property="og:description" content="פלטפורמה חינמית המחברת בין צרכנים לבעלי מקצוע מובילים בתחומם. קבלו הצעות מחיר ללא התחייבות." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://ofair.co.il" />
        <meta property="og:image" content="/lovable-uploads/52b937d1-acd7-4831-b19e-79a55a774829.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="oFair - מצא בעלי מקצוע מובילים לכל עבודה" />
        <meta name="twitter:description" content="פלטפורמה חינמית המחברת בין צרכנים לבעלי מקצוע מובילים בתחומם. קבלו הצעות מחיר ללא התחייבות." />
        <meta name="twitter:image" content="/lovable-uploads/52b937d1-acd7-4831-b19e-79a55a774829.png" />
        
        {/* Structured Data for SEO */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "oFair",
            "url": "https://ofair.co.il",
            "logo": "/lovable-uploads/52b937d1-acd7-4831-b19e-79a55a774829.png",
            "description": "פלטפורמה למציאת בעלי מקצוע מובילים",
            "sameAs": []
          })}
        </script>
        
        <link rel="canonical" href="https://ofair.co.il" />
        
        {/* Performance hints */}
        <link rel="prefetch" href="/search" />
        <link rel="prefetch" href="/dashboard" />
      </Helmet>
      
      <Header />
      
      {/* Hero Section - Critical, load immediately */}
      <div ref={requestFormRef}>
        <HeroSection 
          scrollToRequestForm={scrollToRequestForm}
          scrollToSearchSection={scrollToSearchSection}
        />
      </div>
      
      {/* Popular Services Section - Lazy loaded */}
      <Suspense fallback={<SectionLoader />}>
        <PopularServicesSection />
      </Suspense>
      
      {/* Search Section - Critical for user interaction */}
      <div ref={searchSectionRef}>
        <SearchSection onSearchSubmit={handleSearchSubmit} />
      </div>
      
      {/* Below-the-fold sections - Lazy loaded */}
      <Suspense fallback={<SectionLoader />}>
        <HowItWorksSection />
      </Suspense>
      
      <Suspense fallback={<SectionLoader />}>
        <TestimonialsSection />
      </Suspense>
      
      <Suspense fallback={<SectionLoader />}>
        <WhyChooseUsSection />
      </Suspense>
      
      <Suspense fallback={<SectionLoader />}>
        <ArticlesSection />
      </Suspense>
      
      <Suspense fallback={<SectionLoader />}>
        <CtaSection scrollToRequestForm={scrollToRequestForm} />
      </Suspense>
      
      <Footer />
      
      <ScrollIndicator />
    </div>
  );
};

export default Index;
