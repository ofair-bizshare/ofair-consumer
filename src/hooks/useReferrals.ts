
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { ReferralInterface } from '@/types/dashboard';

export const useReferrals = (userId: string | undefined) => {
  const [referrals, setReferrals] = useState<ReferralInterface[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const fetchReferrals = async () => {
      try {
        setLoading(true);
        console.log("Fetching referrals for user:", userId);
        
        const { data, error } = await supabase
          .from('referrals')
          .select('*')
          .eq('user_id', userId)
          .order('date', { ascending: false });
        
        if (error) {
          console.error("Error details:", error);
          // If we get a permissions error, it might be due to RLS policies not being applied yet
          if (error.code === '42501') {
            console.log("Permission error, likely RLS policy issue");
            // Return empty array instead of throwing
            setReferrals([]);
            return;
          }
          throw error;
        }
        
        console.log("Referrals data received:", data);
        
        if (data) {
          // Convert Supabase data to our interface format
          const formattedReferrals: ReferralInterface[] = data.map(item => ({
            id: item.id,
            user_id: item.user_id,
            professionalId: item.professional_id,
            professionalName: item.professional_name,
            phoneNumber: item.phone_number,
            date: item.date ? new Date(item.date).toLocaleDateString('he-IL') : 'תאריך לא ידוע',
            status: item.status || 'new',
            profession: item.profession || 'בעל מקצוע',
            completedWork: item.completed_work || false
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
        // Set empty array on error
        setReferrals([]);
      } finally {
        setLoading(false);
      }
    };

    fetchReferrals();
  }, [userId, toast]);

  const markAsContacted = async (id: string) => {
    if (!id) return;
    
    try {
      console.log("Marking referral as contacted:", id);
      
      // Update in Supabase
      const { error } = await supabase
        .from('referrals')
        .update({ status: 'contacted' })
        .eq('id', id);
      
      if (error) {
        console.error("Update error details:", error);
        throw error;
      }
      
      console.log("Referral marked as contacted successfully");
      
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
        variant: "default"
      });
    } catch (error) {
      console.error('Error updating referral status:', error);
      // Still update UI state even if backend failed
      setReferrals(prevReferrals => 
        prevReferrals.map(r => {
          if (r.id === id) {
            return { ...r, status: 'contacted' };
          }
          return r;
        })
      );
      
      toast({
        title: "שגיאה בעדכון סטטוס",
        description: "העדכון נכשל בשרת, אך השינוי הוחל מקומית",
        variant: "destructive",
      });
    }
  };

  // New function to manually add a referral to the local state
  // This is useful when RLS policies are preventing proper saving
  const addLocalReferral = (referral: Omit<ReferralInterface, 'id' | 'date'>) => {
    const newReferral: ReferralInterface = {
      id: `local-${Date.now()}`,
      date: new Date().toLocaleDateString('he-IL'),
      ...referral
    };
    
    setReferrals(prevReferrals => [newReferral, ...prevReferrals]);
    
    return newReferral;
  };

  return {
    referrals,
    loading,
    markAsContacted,
    addLocalReferral
  };
};
