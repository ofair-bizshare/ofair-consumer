
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Phone, AlertCircle, Eye, CheckCircle, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ReferralInterface } from '@/types/dashboard';

const ReferralsTab: React.FC = () => {
  const [referrals, setReferrals] = useState<ReferralInterface[]>([]);
  const { toast } = useToast();
  
  useEffect(() => {
    // Get referrals from localStorage
    const storedReferrals = localStorage.getItem('myReferrals');
    if (storedReferrals) {
      try {
        const parsedReferrals = JSON.parse(storedReferrals);
        // Sort referrals by date (newest first)
        const sortedReferrals = [...parsedReferrals].sort((a, b) => {
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        });
        setReferrals(sortedReferrals);
      } catch (error) {
        console.error('Error parsing referrals:', error);
        setReferrals([]);
      }
    }
  }, []);

  // Save referrals to localStorage whenever they change
  useEffect(() => {
    if (referrals.length > 0) {
      localStorage.setItem('myReferrals', JSON.stringify(referrals));
    }
  }, [referrals]);

  const toggleContactStatus = (id: string) => {
    const updatedReferrals = referrals.map(referral => {
      if (referral.professionalId === id) {
        const newStatus = referral.status === 'contacted' ? 'new' : 'contacted';
        return {
          ...referral,
          status: newStatus
        };
      }
      return referral;
    });
    
    setReferrals(updatedReferrals);
    
    const referral = referrals.find(r => r.professionalId === id);
    const isNowContacted = referral?.status === 'new'; // It will be toggled, so check the opposite
    
    toast({
      title: isNowContacted ? "סומן כ'נוצר קשר'" : "סומן כ'טרם נוצר קשר'",
      description: isNowContacted ? "הפניה עודכנה לסטטוס 'נוצר קשר'" : "הפניה עודכנה לסטטוס 'טרם נוצר קשר'", 
      variant: "default"
    });
  };

  const markAsCompleted = (id: string) => {
    const updatedReferrals = referrals.map(referral => {
      if (referral.professionalId === id) {
        return {
          ...referral,
          completedWork: true
        };
      }
      return referral;
    });
    
    setReferrals(updatedReferrals);
    
    toast({
      title: "סומן כ'עבודה הושלמה'",
      description: "הפניה עודכנה לסטטוס 'עבודה הושלמה'",
      variant: "default"
    });
  };

  const deleteReferral = (id: string) => {
    const updatedReferrals = referrals.filter(referral => referral.professionalId !== id);
    setReferrals(updatedReferrals);
    localStorage.setItem('myReferrals', JSON.stringify(updatedReferrals));
    
    toast({
      title: "הפניה נמחקה",
      description: "ההפניה נמחקה בהצלחה",
      variant: "default"
    });
  };

  return (
    <div className="space-y-6" dir="rtl">
      <div className="glass-card p-6">
        <h2 className="text-2xl font-semibold text-blue-700 mb-4">הפניות שלי</h2>
        <p className="text-gray-600 mb-6">
          כאן תוכל לראות את ההפניות שיצרת לבעלי מקצוע, את הסטטוס שלהן ואת הפרטים שנשלחו
        </p>
        
        {referrals.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {referrals.map((referral, index) => (
              <Card key={index} className="overflow-hidden hover:shadow-md transition-shadow">
                <CardContent className="p-0">
                  <div className="p-5">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="text-lg font-semibold">{referral.professionalName}</h3>
                        <p className="text-gray-500 text-sm">{referral.profession || "בעל מקצוע"}</p>
                      </div>
                      <div className="flex items-center text-sm">
                        {referral.completedWork ? (
                          <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full flex items-center">
                            <CheckCircle size={12} className="ml-1" />
                            הושלם
                          </span>
                        ) : referral.status === 'new' ? (
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
                    
                    <div className="flex flex-wrap justify-between gap-2 pt-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-blue-700 border-blue-200 hover:bg-blue-50" 
                        onClick={() => window.open(`/professional/${referral.professionalId}`, '_blank')}
                      >
                        <Eye size={16} className="ml-1" />
                        צפה בפרופיל
                      </Button>
                      
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-red-500 border-red-200 hover:bg-red-50"
                        onClick={() => deleteReferral(referral.professionalId)}
                      >
                        <X size={16} className="ml-1" />
                        הסר
                      </Button>
                      
                      {!referral.completedWork && (
                        referral.status === 'new' ? (
                          <Button 
                            size="sm" 
                            className="bg-[#00D09E] hover:bg-[#00C090]" 
                            onClick={() => toggleContactStatus(referral.professionalId)}
                          >
                            סמן כנוצר קשר
                          </Button>
                        ) : (
                          <div className="flex gap-2">
                            <Button 
                              size="sm" 
                              variant="outline"
                              className="text-gray-500 border-gray-200 hover:bg-gray-50" 
                              onClick={() => toggleContactStatus(referral.professionalId)}
                            >
                              <X size={16} className="ml-1" />
                              בטל סימון
                            </Button>
                            <Button 
                              size="sm" 
                              className="bg-blue-500 hover:bg-blue-600" 
                              onClick={() => markAsCompleted(referral.professionalId)}
                            >
                              עבודה הושלמה
                            </Button>
                          </div>
                        )
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
  );
};

export default ReferralsTab;
