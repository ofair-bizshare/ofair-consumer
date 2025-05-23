
import React, { useEffect } from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import DashboardTabs from '@/components/dashboard/DashboardTabs';
import { useAuth } from '@/providers/AuthProvider';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useAdminStatus } from '@/hooks/useAdminStatus';
import ProfileCard from '@/components/dashboard/ProfileCard';
import DashboardLoading from '@/components/dashboard/DashboardLoading';

const Dashboard = () => {
  const { user, loading } = useAuth();
  const { loading: profileLoading } = useUserProfile();
  const { isAdmin, isChecking } = useAdminStatus();
  const location = useLocation();
  
  useEffect(() => {
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

  if (loading || profileLoading || isChecking) {
    return <DashboardLoading />;
  }

  if (!user && !loading) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="flex flex-col min-h-screen" dir="rtl">
      <Helmet>
        <title>האזור האישי שלי | oFair - ניהול הבקשות, ההצעות וההפניות שלך</title>
        <meta name="description" content="צפה בבקשות הקודמות שלך, הצעות המחיר שקיבלת, ההפניות שלך וסטטוס התקדמות הפרויקטים שלך באזור האישי." />
        <meta name="keywords" content="אזור אישי, בקשות, הצעות מחיר, הפניות, ניהול פרויקטים, בעלי מקצוע, סטטוס פרויקט" />
      </Helmet>
      
      <Header />
      
      <main className="flex-grow pt-20 sm:pt-28 pb-10 sm:pb-16">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="mb-6 sm:mb-10">
            <h1 className="text-2xl sm:text-3xl font-bold text-blue-700 mb-2">
              <span className="text-[#00D09E]">האזור</span> האישי שלי
            </h1>
            <p className="text-gray-600">
              צפה בבקשות הקודמות שלך, הצעות המחיר שקיבלת והסטטוס שלהן
            </p>
          </div>
          
          {user && <ProfileCard isAdmin={isAdmin} />}
          
          <div id="requests-section" className="mt-6">
            <DashboardTabs isLoggedIn={!!user} />
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Dashboard;
