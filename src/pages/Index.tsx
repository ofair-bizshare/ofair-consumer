
import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ScrollIndicator from '@/components/ScrollIndicator';
import { Helmet } from 'react-helmet-async';

// Import the refactored components
import HeroSection from '@/components/home/HeroSection';
import PopularServicesSection from '@/components/home/PopularServicesSection';
import SearchSection from '@/components/home/SearchSection';
import HowItWorksSection from '@/components/home/HowItWorksSection';
import TestimonialsSection from '@/components/home/TestimonialsSection';
import WhyChooseUsSection from '@/components/home/WhyChooseUsSection';
import ArticlesSection from '@/components/home/ArticlesSection';
import CtaSection from '@/components/home/CtaSection';

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
  
  return <div className="flex flex-col min-h-screen" dir="rtl">
      <Helmet>
        {/* Preload critical assets for performance */}
        <link rel="preload" href="/lovable-uploads/52b937d1-acd7-4831-b19e-79a55a774829.png" as="image" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
        
        <title>oFair - מציאת בעלי מקצוע מובילים בכל תחום | פלטפורמת חיבור בין לקוחות למקצוענים</title>
        <meta name="description" content="פלטפורמה חינמית המחברת בין בעלי בתים לבעלי מקצוע אמינים ומקצועיים. קבלו הצעות מחיר ללא התחייבות ובחרו את המקצוען הנכון עבורכם." />
        <meta name="keywords" content="בעלי מקצוע, שיפוצים, חשמלאי, אינסטלציה, נגרות, גינון, ניקיון, צביעה, הובלות, מיזוג אוויר, תיקונים, שירותי בית" />
        <meta property="og:title" content="oFair - מצא בעלי מקצוע מובילים לכל עבודה" />
        <meta property="og:description" content="פלטפורמה חינמית המחברת בין צרכנים לבעלי מקצוע מובילים בתחומם. קבלו הצעות מחיר ללא התחייבות." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://ofair.co.il" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="oFair - מצא בעלי מקצוע מובילים לכל עבודה" />
        <meta name="twitter:description" content="פלטפורמה חינמית המחברת בין צרכנים לבעלי מקצוע מובילים בתחומם. קבלו הצעות מחיר ללא התחייבות." />
        <link rel="canonical" href="https://ofair.co.il" />
      </Helmet>
      
      <Header />
      
      {/* Hero Section */}
      <div ref={requestFormRef}>
        <HeroSection 
          scrollToRequestForm={scrollToRequestForm}
          scrollToSearchSection={scrollToSearchSection}
        />
      </div>
      
      {/* Popular Services Section */}
      <PopularServicesSection />
      
      {/* Search Section */}
      <div ref={searchSectionRef}>
        <SearchSection onSearchSubmit={handleSearchSubmit} />
      </div>
      
      {/* How it Works Section */}
      <HowItWorksSection />
      
      {/* Testimonials Section */}
      <TestimonialsSection />
      
      {/* Why Choose Us Section */}
      <WhyChooseUsSection />
      
      {/* Articles Section */}
      <ArticlesSection />
      
      {/* CTA Section */}
      <CtaSection scrollToRequestForm={scrollToRequestForm} />
      
      <Footer />
    </div>;
};

export default Index;
