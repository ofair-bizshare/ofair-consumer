
import React from 'react';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import UserSettings from '@/components/UserSettings';
import { useAuth } from '@/providers/AuthProvider';
import { Navigate } from 'react-router-dom';

const Settings = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#00d09e]"></div>
      </div>
    );
  }

  if (!user && !loading) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="flex flex-col min-h-screen" dir="rtl">
      <Helmet>
        <title>הגדרות משתמש | oFair - ניהול החשבון שלך</title>
        <meta name="description" content="עדכן את פרטי החשבון שלך, הגדרות ההתראות והעדפות נוספות." />
      </Helmet>
      
      <Header />
      
      <main className="flex-grow pt-28 pb-16">
        <div className="container mx-auto px-6">
          <UserSettings />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Settings;
