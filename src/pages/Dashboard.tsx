
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import DashboardTabs from '@/components/dashboard/DashboardTabs';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent } from '@/components/ui/card';
import { UserCircle, Gift } from 'lucide-react';

const Dashboard = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { toast } = useToast();
  const location = useLocation();
  
  useEffect(() => {
    const hasSession = localStorage.getItem('isLoggedIn') === 'true';
    setIsLoggedIn(hasSession);
    
    // Check if we need to scroll to a specific section
    if (location.hash) {
      const id = location.hash.substring(1);
      const element = document.getElementById(id);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 500);
      }
    }
  }, [location]);

  return (
    <div className="flex flex-col min-h-screen" dir="rtl">
      <Helmet>
        <title>האזור האישי שלי | oFair - ניהול הבקשות, ההצעות וההפניות שלך</title>
        <meta name="description" content="צפה בבקשות הקודמות שלך, הצעות המחיר שקיבלת, ההפניות שלך וסטטוס התקדמות הפרויקטים שלך באזור האישי." />
        <meta name="keywords" content="אזור אישי, בקשות, הצעות מחיר, הפניות, ניהול פרויקטים, בעלי מקצוע, סטטוס פרויקט" />
      </Helmet>
      
      <Header />
      
      <main className="flex-grow pt-28 pb-16">
        <div className="container mx-auto px-6">
          <div className="mb-10">
            <h1 className="text-3xl font-bold text-blue-700 mb-2">
              <span className="text-[#00D09E]">האזור</span> האישי שלי
            </h1>
            <p className="text-gray-600">
              צפה בבקשות הקודמות שלך, הצעות המחיר שקיבלת והסטטוס שלהן
            </p>
          </div>
          
          {isLoggedIn && (
            <div className="glass-card p-6 mb-8 flex items-center justify-between">
              <div className="flex items-center">
                <div className="bg-blue-100 rounded-full p-3 mr-4">
                  <UserCircle size={36} className="text-blue-700" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold">ברוך הבא!</h2>
                  <p className="text-gray-600">שמחים לראות אותך שוב</p>
                </div>
              </div>
              <div className="flex items-center bg-gradient-to-r from-teal-500 to-blue-600 text-white px-4 py-2 rounded-lg">
                <Gift className="ml-2 h-5 w-5" aria-hidden="true" />
                <div>
                  <div className="text-sm opacity-80">הקרדיט שלי</div>
                  <div className="font-bold">250 ₪</div>
                </div>
              </div>
            </div>
          )}
          
          <div id="requests-section">
            <DashboardTabs isLoggedIn={isLoggedIn} />
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Dashboard;
