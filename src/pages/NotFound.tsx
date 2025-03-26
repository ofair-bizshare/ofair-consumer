
import React, { useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex flex-col min-h-screen" dir="rtl">
      <Header />
      
      <main className="flex-grow flex items-center justify-center p-6">
        <div className="text-center max-w-md animate-fade-in-up">
          <div className="flex justify-center mb-6">
            <div className="h-24 w-24 rounded-full bg-blue-50 flex items-center justify-center">
              <AlertTriangle className="h-12 w-12 text-blue-700" />
            </div>
          </div>
          
          <h1 className="text-4xl font-bold text-blue-700 mb-2">404</h1>
          <h2 className="text-2xl font-semibold text-teal-500 mb-4">הדף לא נמצא</h2>
          
          <p className="text-gray-600 mb-8">
            העמוד שחיפשת אינו קיים או שהועבר למיקום אחר.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild className="bg-teal-500 hover:bg-teal-600 text-white">
              <Link to="/">חזרה לדף הבית</Link>
            </Button>
            
            <Button asChild variant="outline" className="border-blue-700 text-blue-700 hover:bg-blue-50">
              <Link to="/search">חפש בעלי מקצוע</Link>
            </Button>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default NotFound;
