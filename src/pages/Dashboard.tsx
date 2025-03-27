
import React, { useState, useEffect, useRef } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import DashboardTabs from '@/components/dashboard/DashboardTabs';
import { useToast } from '@/hooks/use-toast';

const Dashboard = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { toast } = useToast();
  
  useEffect(() => {
    const hasSession = localStorage.getItem('isLoggedIn') === 'true';
    setIsLoggedIn(hasSession);
  }, []);

  return (
    <div className="flex flex-col min-h-screen" dir="rtl">
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
          
          <DashboardTabs isLoggedIn={isLoggedIn} />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Dashboard;
