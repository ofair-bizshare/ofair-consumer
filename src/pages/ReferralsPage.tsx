
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useToast } from '@/hooks/use-toast';
import ReferralsTab from '@/components/dashboard/ReferralsTab';

const ReferralsPage = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  useEffect(() => {
    // Check if user is logged in
    const hasSession = localStorage.getItem('isLoggedIn') === 'true';
    setIsLoggedIn(hasSession);
    
    if (!hasSession) {
      toast({
        title: "התחברות נדרשת",
        description: "עליך להתחבר כדי לצפות בהפניות שלך",
        variant: "destructive",
      });
      navigate('/login', { state: { returnUrl: '/referrals' } });
    }
  }, [navigate, toast]);

  return (
    <div className="flex flex-col min-h-screen" dir="rtl">
      <Header />
      
      <main className="flex-grow pt-28 pb-16">
        <div className="container mx-auto px-6">
          <div className="mb-10">
            <h1 className="text-3xl font-bold text-blue-700 mb-2">
              <span className="text-[#00D09E]">ההפניות</span> שלי
            </h1>
            <p className="text-gray-600">
              צפה ברשימת בעלי המקצוע שקיבלת את פרטי ההתקשרות שלהם
            </p>
          </div>
          
          <ReferralsTab />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ReferralsPage;
