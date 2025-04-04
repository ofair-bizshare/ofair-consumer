
import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Phone, AlertCircle, Eye } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/providers/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { ReferralInterface } from '@/types/dashboard';

const MyReferrals = () => {
  const [referrals, setReferrals] = useState<ReferralInterface[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    // Check if user is logged in
    if (!user) {
      toast({
        title: "התחברות נדרשת",
        description: "עליך להתחבר כדי לצפות בהפניות שלך",
        variant: "destructive",
      });
      navigate('/login', { state: { returnUrl: '/referrals' } });
      return;
    }
    
    // Fetch referrals from Supabase
    const fetchReferrals = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('referrals')
          .select('*')
          .eq('user_id', user.id)
          .order('date', { ascending: false });
        
        if (error) throw error;
        
        if (data) {
          // Convert Supabase data to our interface format
          const formattedReferrals: ReferralInterface[] = data.map(item => ({
            id: item.id,
            user_id: item.user_id,
            professionalId: item.professional_id,
            professionalName: item.professional_name,
            phoneNumber: item.phone_number,
            date: new Date(item.date).toLocaleDateString('he-IL'),
            status: item.status,
            profession: item.profession,
            completedWork: item.completed_work
          }));
          
          setReferrals(formattedReferrals);
        }
      } catch (error) {
        console.error('Error fetching referrals:', error);
        toast({
          title: "שגיאה בטעינת הפניות",
          description: "אירעה שגיאה בטעינת ההפניות שלך",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchReferrals();
  }, [navigate, toast, user]);

  const markAsContacted = async (id: string) => {
    if (!id) return;
    
    try {
      // Update in Supabase
      const { error } = await supabase
        .from('referrals')
        .update({ status: 'contacted' })
        .eq('id', id);
      
      if (error) throw error;
      
      // Update local state
      setReferrals(prevReferrals => 
        prevReferrals.map(r => {
          if (r.id === id) {
            return { ...r, status: 'contacted' };
          }
          return r;
        })
      );
      
      toast({
        title: "סטטוס עודכן",
        description: "ההפניה סומנה כ'נוצר קשר'",
        variant: "default",
      });
    } catch (error) {
      console.error('Error updating referral status:', error);
      toast({
        title: "שגיאה בעדכון סטטוס",
        description: "אירעה שגיאה בעדכון סטטוס ההפניה",
        variant: "destructive",
      });
    }
  };

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
              <span className="text-[#00D09E]">ההפניות</span> שלי
            </h1>
            <p className="text-gray-600">
              צפה ברשימת בעלי המקצוע שקיבלת את פרטי ההתקשרות שלהם
            </p>
          </div>
          
          <div className="glass-card p-6 mb-10">
            {referrals.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {referrals.map((referral) => (
                  <Card key={referral.id} className="overflow-hidden hover:shadow-md transition-shadow">
                    <CardContent className="p-0">
                      <div className="p-5">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h3 className="text-lg font-semibold">{referral.professionalName}</h3>
                            <p className="text-gray-500 text-sm">{referral.profession || "בעל מקצוע"}</p>
                          </div>
                          <div className="flex items-center text-sm">
                            {referral.status === 'new' ? (
                              <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full">חדש</span>
                            ) : (
                              <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">נוצר קשר</span>
                            )}
                          </div>
                        </div>
                        
                        <div className="text-gray-700 mb-3">
                          <div className="flex items-center mb-1">
                            <Phone className="h-4 w-4 text-[#00D09E] ml-2" />
                            <p className="font-medium">{referral.phoneNumber}</p>
                          </div>
                          <p className="text-sm text-gray-500">{referral.date}</p>
                        </div>
                        
                        <div className="flex justify-between pt-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="text-blue-700 border-blue-200 hover:bg-blue-50"
                            onClick={() => window.open(`/professionals/${referral.professionalId}`, '_blank')}
                          >
                            <Eye size={16} className="ml-1" />
                            צפה בפרופיל
                          </Button>
                          
                          {referral.status === 'new' && (
                            <Button 
                              size="sm"
                              className="bg-[#00D09E] hover:bg-[#00C090]"
                              onClick={() => markAsContacted(referral.id!)}
                            >
                              סמן כנוצר קשר
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <AlertCircle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">אין הפניות עדיין</h3>
                <p className="text-gray-500 mb-4">
                  כאשר תיצור הפניות לבעלי מקצוע, הן יופיעו כאן כדי שתוכל לעקוב אחריהן
                </p>
                <Link to="/search">
                  <Button className="bg-[#00D09E] hover:bg-[#00C090]">
                    חפש בעלי מקצוע
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default MyReferrals;
