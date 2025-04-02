import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { ReferralInterface } from '@/types/dashboard';
import { getFromLocalDB, saveToLocalDB } from '@/utils/localStorageDB';

export const useReferrals = (userId: string | undefined) => {
  const [referrals, setReferrals] = useState<ReferralInterface[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Function to load referrals from localStorage
  const loadLocalReferrals = useCallback(() => {
    if (!userId) return [];
    
    const localReferrals = getFromLocalDB<ReferralInterface>('referrals', userId);
    console.log('Local referrals loaded:', localReferrals);
    return localReferrals;
  }, [userId]);

  // Function to save a referral to localStorage
  const saveLocalReferral = useCallback((referral: ReferralInterface) => {
    if (!userId) return;
    
    saveToLocalDB<ReferralInterface>('referrals', userId, referral);
    console.log('Referral saved to local storage:', referral);
  }, [userId]);

  // Function to merge local and remote referrals
  const mergeReferrals = useCallback((remoteReferrals: ReferralInterface[], localReferrals: ReferralInterface[]) => {
    // Create a map of existing remote referrals by ID
    const remoteMap = new Map(remoteReferrals.map(r => [r.id, r]));
    
    // Add local-only referrals to the result
    const mergedReferrals = [...remoteReferrals];
    
    for (const localRef of localReferrals) {
      // Check if this local referral exists in remote data
      if (!remoteMap.has(localRef.id) && !localRef.id.startsWith('local-')) {
        // If it has a real ID but isn't in remote data, it might be due to RLS,
        // so include it
        mergedReferrals.push(localRef);
      } else if (localRef.id.startsWith('local-')) {
        // Always include local-generated IDs
        mergedReferrals.push(localRef);
      }
    }
    
    return mergedReferrals;
  }, []);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const fetchReferrals = async () => {
      try {
        setLoading(true);
        console.log("Fetching referrals for user:", userId);
        
        // Get local referrals first for fast initial rendering
        const localReferrals = loadLocalReferrals();
        if (localReferrals.length > 0) {
          setReferrals(localReferrals);
        }
        
        // Attempt to fetch from database
        try {
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
              
              // Use only local referrals if available
              if (localReferrals.length > 0) {
                console.log("Using only local referrals due to permission error");
                setReferrals(localReferrals);
              } else {
                setReferrals([]);
              }
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
            
            // Save all remote referrals to local storage as backup
            formattedReferrals.forEach(ref => saveLocalReferral(ref));
            
            // Merge with local referrals to ensure we don't lose any data
            const mergedReferrals = mergeReferrals(formattedReferrals, localReferrals);
            setReferrals(mergedReferrals);
          } else if (localReferrals.length > 0) {
            // If no remote data but we have local data, use local
            setReferrals(localReferrals);
          } else {
            setReferrals([]);
          }
        } catch (apiError) {
          console.error('Error fetching referrals from API:', apiError);
          
          // Fall back to local referrals
          if (localReferrals.length > 0) {
            console.log('Using local referrals due to API error');
            setReferrals(localReferrals);
          } else {
            setReferrals([]);
          }
          
          toast({
            title: "שגיאה בטעינת הפניות",
            description: "אירעה שגיאה בטעינת ההפניות שלך. משתמש בנתונים מקומיים.",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error('Error in referrals management:', error);
        
        // Last resort fallback to empty array
        setReferrals([]);
        
        toast({
          title: "שגיאה בטעינת הפניות",
          description: "אירעה שגיאה קריטית בטעינת ההפניות שלך",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchReferrals();
  }, [userId, toast, loadLocalReferrals, saveLocalReferral, mergeReferrals]);

  const markAsContacted = async (id: string) => {
    if (!id || !userId) return;
    
    try {
      console.log("Marking referral as contacted:", id);
      
      // First update local state for immediate feedback
      setReferrals(prevReferrals => 
        prevReferrals.map(r => {
          if (r.id === id) {
            return { ...r, status: 'contacted' };
          }
          return r;
        })
      );
      
      // Save changes to local storage
      const referralToUpdate = referrals.find(r => r.id === id);
      if (referralToUpdate) {
        saveLocalReferral({
          ...referralToUpdate,
          status: 'contacted'
        });
      }
      
      // Try to update in Supabase
      try {
        const { error } = await supabase
          .from('referrals')
          .update({ status: 'contacted' })
          .eq('id', id);
        
        if (error) {
          console.error("Update error details:", error);
          throw error;
        }
        
        console.log("Referral marked as contacted successfully in database");
      } catch (dbError) {
        console.error('Error updating referral in database:', dbError);
        // We already updated the local state, so we don't need to do anything else
      }
      
      toast({
        title: "סטטוס עודכן",
        description: "ההפניה סומנה כ'נוצר קשר'",
        variant: "default"
      });
    } catch (error) {
      console.error('Error in mark as contacted process:', error);
      // Still keep the local state update
      
      toast({
        title: "שגיאה בעדכון סטטוס",
        description: "העדכון נכשל בשרת, אך השינוי הוחל מקומית",
        variant: "destructive",
      });
    }
  };

  // Function to manually add a referral
  const addLocalReferral = (referral: Omit<ReferralInterface, 'id' | 'date'>) => {
    if (!userId) return null;
    
    const newReferral: ReferralInterface = {
      id: `local-${Date.now()}`,
      date: new Date().toLocaleDateString('he-IL'),
      ...referral
    };
    
    // Update local state
    setReferrals(prevReferrals => [newReferral, ...prevReferrals]);
    
    // Save to localStorage
    saveLocalReferral(newReferral);
    
    // Try to save to Supabase
    try {
      const dbReferral = {
        user_id: userId,
        professional_id: referral.professionalId,
        professional_name: referral.professionalName,
        phone_number: referral.phoneNumber,
        date: new Date().toISOString(),
        status: referral.status || "new",
        profession: referral.profession || "בעל מקצוע",
        completed_work: referral.completedWork || false
      };
      
      supabase
        .from('referrals')
        .insert(dbReferral)
        .then(({ error }) => {
          if (error) {
            console.error('Error saving referral to database:', error);
          } else {
            console.log('Referral saved to database successfully');
          }
        });
    } catch (error) {
      console.error('Error preparing referral for database:', error);
    }
    
    return newReferral;
  };

  return {
    referrals,
    loading,
    markAsContacted,
    addLocalReferral
  };
};
