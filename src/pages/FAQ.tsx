
import React from 'react';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FAQHeader from '@/components/faq/FAQHeader';
import FAQTabs from '@/components/faq/FAQTabs';
import FAQContactSection from '@/components/faq/FAQContactSection';
import FAQArticlesSection from '@/components/faq/FAQArticlesSection';

const FAQ = () => {
  return (
    <div className="flex flex-col min-h-screen" dir="rtl">
      <Helmet>
        <title>שאלות נפוצות | oFair - מידע, עזרה והדרכה</title>
        <meta name="description" content="תשובות לשאלות נפוצות על השימוש ב-oFair, מציאת בעלי מקצוע, תשלומים, הפניות ועוד." />
        <meta name="keywords" content="שאלות נפוצות, עזרה, הדרכה, FAQ, מידע, בעלי מקצוע, תשלומים, oFair" />
      </Helmet>
      
      <Header />
      
      <main className="flex-grow pt-28 pb-16">
        <div className="container mx-auto px-6">
          <FAQHeader />
          <FAQTabs />
          <FAQContactSection />
          <FAQArticlesSection />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default FAQ;
