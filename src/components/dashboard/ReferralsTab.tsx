import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Phone, AlertCircle, Eye } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
interface Referral {
  professionalId: string;
  professionalName: string;
  phoneNumber: string;
  date: string;
  status: string;
  profession?: string;
}
const ReferralsTab: React.FC = () => {
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const {
    toast
  } = useToast();
  useEffect(() => {
    // Get referrals from localStorage
    const storedReferrals = localStorage.getItem('myReferrals');
    if (storedReferrals) {
      try {
        const parsedReferrals = JSON.parse(storedReferrals);
        setReferrals(parsedReferrals);
      } catch (error) {
        console.error('Error parsing referrals:', error);
        setReferrals([]);
      }
    }
  }, []);
  const markAsContacted = (id: string) => {
    const updatedReferrals = referrals.map(referral => {
      if (referral.professionalId === id) {
        return {
          ...referral,
          status: 'contacted'
        };
      }
      return referral;
    });
    setReferrals(updatedReferrals);
    localStorage.setItem('myReferrals', JSON.stringify(updatedReferrals));
    toast({
      title: "סטטוס עודכן",
      description: "ההפניה סומנה כ'נוצר קשר'",
      variant: "default"
    });
  };
  return <div className="space-y-6" dir="rtl">
      <div className="glass-card p-6">
        <h2 className="text-2xl font-semibold text-blue-700 mb-4">הפניות שלי</h2>
        <p className="text-gray-600 mb-6">
          כאן תוכל לראות את ההפניות שיצרת לבעלי מקצוע, את הסטטוס שלהן ואת הפרטים שנשלחו
        </p>
        
        {referrals.length > 0 ? <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {referrals.map((referral, index) => <Card key={index} className="overflow-hidden hover:shadow-md transition-shadow">
                <CardContent className="p-0">
                  <div className="p-5">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="text-lg font-semibold">{referral.professionalName}</h3>
                        <p className="text-gray-500 text-sm">{referral.profession || "בעל מקצוע"}</p>
                      </div>
                      <div className="flex items-center text-sm">
                        {referral.status === 'new' ? <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full">חדש</span> : <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">נוצר קשר</span>}
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
                      <Button variant="outline" size="sm" className="text-blue-700 border-blue-200 hover:bg-blue-50" onClick={() => window.open(`/professional/${referral.professionalId}`, '_blank')}>
                        <Eye size={16} className="ml-1" />
                        צפה בפרופיל
                      </Button>
                      
                      {referral.status === 'new' && <Button size="sm" className="bg-[#00D09E] hover:bg-[#00C090]" onClick={() => markAsContacted(referral.professionalId)}>
                          סמן כנוצר קשר
                        </Button>}
                    </div>
                  </div>
                </CardContent>
              </Card>)}
          </div> : <div className="text-center py-12">
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
          </div>}
      </div>
    </div>;
};
export default ReferralsTab;