
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/providers/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Phone, AlertCircle, Calendar, MapPin, Phone as PhoneIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Referral {
  id: string;
  date: string;
  professional_name: string;
  phone_number: string;
  profession: string;
  status: string;
  completed_work: boolean;
}

const ReferralsTab: React.FC = () => {
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const fetchReferrals = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('referrals')
          .select('*')
          .eq('user_id', user.id)
          .order('date', { ascending: false });

        if (error) throw error;

        console.log('Referrals data:', data);
        setReferrals(data || []);
      } catch (error) {
        console.error('Error fetching referrals:', error);
        toast({
          title: "שגיאה בטעינת ההפניות",
          description: "אירעה שגיאה בטעינת ההפניות שלך",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchReferrals();
  }, [user]);

  const handleMarkComplete = async (id: string, completed: boolean) => {
    try {
      const { error } = await supabase
        .from('referrals')
        .update({ completed_work: completed })
        .eq('id', id);

      if (error) throw error;

      setReferrals(referrals.map(ref => 
        ref.id === id ? { ...ref, completed_work: completed } : ref
      ));

      toast({
        title: completed ? "העבודה הושלמה" : "סטטוס העבודה עודכן",
        description: completed ? "סימנת שהעבודה הושלמה בהצלחה" : "סטטוס העבודה עודכן בהצלחה",
        variant: "default",
      });
    } catch (error) {
      console.error('Error updating referral:', error);
      toast({
        title: "שגיאה בעדכון הסטטוס",
        description: "אירעה שגיאה בעדכון סטטוס העבודה",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="w-full h-40 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="glass-card p-10 text-center">
        <AlertCircle className="h-14 w-14 text-red-300 mx-auto mb-4" />
        <h2 className="text-2xl font-semibold text-gray-800 mb-3">התחברות נדרשת</h2>
        <p className="text-gray-600 mb-6 max-w-lg mx-auto">
          על מנת לצפות בהפניות שלך, יש להתחבר למערכת תחילה.
        </p>
      </div>
    );
  }

  if (referrals.length === 0) {
    return (
      <div className="glass-card p-10 text-center">
        <Phone className="h-14 w-14 text-blue-300 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-800 mb-3">אין לך הפניות עדיין</h2>
        <p className="text-gray-600 mb-6 max-w-lg mx-auto">
          כאן תוכל לראות את בעלי המקצוע שקיבלת את פרטי ההתקשרות שלהם.
          אתה יכול לקבל פרטי התקשרות על ידי לחיצה על "הצג מספר טלפון" בעמוד הפרופיל של בעל מקצוע.
        </p>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('he-IL', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'accepted_quote':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-200">התקבלה הצעת מחיר</Badge>;
      case 'new':
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">חדש</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-200">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-blue-700">הפניות שהעברתי</h2>
        <p className="text-gray-600">
          כאן תוכל לנהל את ההפניות שלך לבעלי מקצוע
        </p>
      </div>

      <div className="space-y-4">
        {referrals.map((referral) => (
          <Card key={referral.id} className="p-4 hover:shadow-md transition-shadow">
            <div className="flex flex-col md:flex-row justify-between items-start gap-4">
              <div className="space-y-2 flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">{referral.professional_name}</h3>
                  {getStatusBadge(referral.status)}
                </div>
                <p className="text-gray-600">{referral.profession}</p>
                <div className="flex items-center text-gray-500 text-sm">
                  <Calendar className="h-4 w-4 ml-1" />
                  <span>{formatDate(referral.date)}</span>
                </div>
                <div className="flex items-center">
                  <PhoneIcon className="h-4 w-4 ml-1 text-gray-500" />
                  <a 
                    href={`tel:${referral.phone_number}`} 
                    className="text-blue-600 hover:underline"
                  >
                    {referral.phone_number}
                  </a>
                </div>
              </div>
              
              <div className="flex flex-col space-y-2 w-full md:w-auto">
                <Button 
                  variant={referral.completed_work ? "outline" : "default"}
                  size="sm"
                  onClick={() => handleMarkComplete(referral.id, !referral.completed_work)}
                  className={referral.completed_work ? "border-green-500 text-green-700" : ""}
                >
                  {referral.completed_work ? "✓ העבודה הושלמה" : "סמן כהושלם"}
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ReferralsTab;
