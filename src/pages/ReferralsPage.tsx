
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/providers/AuthProvider';
import { useReferrals } from '@/hooks/useReferrals';
import ReferralsGrid from '@/components/referrals/ReferralsGrid';

const ReferralsPage: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const { referrals, loading, markAsContacted } = useReferrals(user?.id);
  
  React.useEffect(() => {
    // Check if user is logged in
    if (!user) {
      toast({
        title: "התחברות נדרשת",
        description: "עליך להתחבר כדי לצפות בהפניות שלך",
        variant: "destructive"
      });
      navigate('/login', {
        state: {
          returnUrl: '/referrals'
        }
      });
    }
  }, [navigate, toast, user]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen" dir="rtl">
      <Header />
      
      <main className="flex-grow pt-28 pb-16">
        <div className="container mx-auto px-6">
          <div className="mb-10">
            <h1 className="text-3xl font-bold text-blue-700 mb-2">
              <span className="text-[#00D09E]">הפניות</span> שלי
            </h1>
            <p className="text-gray-600">
              צפה ברשימת בעלי המקצוע שקיבלת את פרטי ההתקשרות שלהם
            </p>
          </div>
          
          <div className="glass-card p-6 mb-10">
            <ReferralsGrid 
              referrals={referrals} 
              onMarkContacted={markAsContacted} 
            />
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ReferralsPage;
