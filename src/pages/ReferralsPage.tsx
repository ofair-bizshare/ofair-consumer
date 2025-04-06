
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/providers/AuthProvider';
import { useReferrals } from '@/hooks/useReferrals';
import ReferralsGrid from '@/components/referrals/ReferralsGrid';
import { AlertCircle, Clock } from 'lucide-react';

const ReferralsPage: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const { referrals, loading, markAsContacted } = useReferrals(user?.id);
  const [activeTab, setActiveTab] = useState("all");
  
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

  // Filter referrals based on active tab
  const filteredReferrals = React.useMemo(() => {
    if (activeTab === "all") return referrals;
    if (activeTab === "new") return referrals.filter(ref => ref.status === 'new');
    if (activeTab === "contacted") return referrals.filter(ref => ref.status === 'contacted');
    return referrals;
  }, [referrals, activeTab]);

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
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-blue-700 mb-2">
              <span className="text-[#00D09E]">ההפניות</span> שלי
            </h1>
            <p className="text-gray-600 mb-2">
              פה תוכל לצפות ברשימת בעלי המקצוע שקיבלת את פרטי ההתקשרות שלהם
            </p>
            
            {/* Help text explaining what referrals are */}
            <Card className="bg-blue-50 p-3 mb-6">
              <div className="flex items-start">
                <AlertCircle className="h-5 w-5 text-blue-600 ml-2 mt-0.5" />
                <div>
                  <p className="text-sm text-blue-700">
                    <strong>מה הן הפניות?</strong> הפניות הן רשימת בעלי המקצוע שקיבלת את פרטי ההתקשרות שלהם לאחר לחיצה על "הצג מספר טלפון" בפרופיל של בעל מקצוע.
                    אתה יכול לסמן הפניות כ"נוצר קשר" לאחר שיצרת קשר עם בעל המקצוע.
                  </p>
                </div>
              </div>
            </Card>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="all">כל ההפניות ({referrals.length})</TabsTrigger>
              <TabsTrigger value="new">חדשות ({referrals.filter(r => r.status === 'new').length})</TabsTrigger>
              <TabsTrigger value="contacted">נוצר קשר ({referrals.filter(r => r.status === 'contacted').length})</TabsTrigger>
            </TabsList>
            
            <TabsContent value={activeTab} className="glass-card p-6">
              {filteredReferrals.length === 0 && (
                <div className="text-center py-12">
                  <Clock className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">אין הפניות בקטגוריה זו</h3>
                  <p className="text-gray-500 mb-4">
                    עדיין לא קיימות הפניות בקטגוריה שבחרת
                  </p>
                </div>
              )}
              
              <ReferralsGrid 
                referrals={filteredReferrals} 
                onMarkContacted={markAsContacted} 
              />
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ReferralsPage;
