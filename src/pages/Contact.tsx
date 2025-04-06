
import React from 'react';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ContactInfo from '@/components/contact/ContactInfo';
import ContactForm from '@/components/contact/ContactForm';

const Contact = () => {
  return (
    <div className="flex flex-col min-h-screen" dir="rtl">
      <Helmet>
        <title>צור קשר | oFair - נשמח לענות לשאלות ולסייע לך</title>
        <meta name="description" content="צור קשר עם צוות oFair בכל שאלה, הצעה או בקשה. אנחנו כאן לשירותך." />
      </Helmet>
      
      <Header />
      
      <main className="flex-grow pt-28 pb-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="mb-10 text-center">
            <h1 className="text-4xl font-bold mb-2">
              <span className="text-[#00D09E]">צור</span> קשר
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              יש לך שאלה? רוצה לדעת עוד? נשמח לשמוע ממך ולעזור בכל עניין.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              <ContactInfo />
            </div>
            
            <div className="md:col-span-2">
              <ContactForm />
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Contact;
