
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { ReferralInterface } from '@/types/dashboard';
import { getFromLocalDB, saveToLocalDB } from '@/utils/localStorageDB';
import { v4 as uuidv4 } from 'uuid';

// Helper function to check if a string is a valid UUID
const isValidUUID = (id: string): boolean => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(id);
};

// Helper function to ensure ID is in UUID format
const ensureUUID = (id: string | number): string => {
  // If it's already a valid UUID, return it
  if (typeof id === 'string' && isValidUUID(id)) {
    return id;
  }
  
  // For demo data, generate stable UUIDs from simple IDs
  // This ensures the same ID always maps to the same UUID
  const seed = `professional-${id}`;
  // Create a namespace UUID (using a fixed namespace)
  const namespace = '1b671a64-40d5-491e-99b0-da01ff1f3341';
  
  // Using uuid-v4 as a fallback
  try {
    return uuidv4();
  } catch (e) {
    // Fallback to a simple UUID generation based on the seed
    const hash = String(id).split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    
    // Format as a UUID-like string
    return `00000000-0000-4000-8000-${hash.toString(16).padStart(12, '0')}`;
  }
};

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
    // Create a map of existing remote referrals by professional_id
    const remoteMap = new Map(remoteReferrals.map(r => [r.professional_id, r]));
    
    // Add local-only referrals to the result
    const mergedReferrals = [...remoteReferrals];
    
    for (const localRef of localReferrals) {
      // If this professional isn't in the remote data, add the local entry
      if (!remoteMap.has(localRef.professional_id)) {
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
            throw error;
          }
          
          console.log("Referrals data received:", data);
          
          if (data) {
            // Convert Supabase data to our interface format
            const formattedReferrals: ReferralInterface[] = data.map(item => ({
              id: item.id,
              user_id: item.user_id,
              professional_id: item.professional_id,
              professional_name: item.professional_name,
              phone_number: item.phone_number,
              date: item.date ? new Date(item.date).toLocaleDateString('he-IL') : 'תאריך לא ידוע',
              status: item.status || 'new',
              profession: item.profession || 'בעל מקצוע',
              completed_work: item.completed_work || false
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
      
      // Try to update in Supabase only if the ID is a valid UUID
      if (isValidUUID(id)) {
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
      } else {
        console.log("Skipping database update for local-only referral ID:", id);
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
    
    // Check if the professional ID is in UUID format, if not, convert it
    const professional_id = isValidUUID(referral.professional_id!) 
      ? referral.professional_id 
      : ensureUUID(referral.professional_id!);
    
    const newReferral: ReferralInterface = {
      id: `local-${Date.now()}`,
      date: new Date().toLocaleDateString('he-IL'),
      ...referral,
      professional_id
    };
    
    // Update local state
    setReferrals(prevReferrals => [newReferral, ...prevReferrals]);
    
    // Save to localStorage
    saveLocalReferral(newReferral);
    
    // Try to save to Supabase only if professional_id is a valid UUID
    if (isValidUUID(professional_id!)) {
      try {
        const dbReferral = {
          user_id: userId,
          professional_id: professional_id,
          professional_name: referral.professional_name,
          phone_number: referral.phone_number,
          date: new Date().toISOString(),
          status: referral.status || "new",
          profession: referral.profession || "בעל מקצוע",
          completed_work: referral.completed_work || false
        };
        
        console.log("Attempting to save referral to database:", dbReferral);
        
        supabase
          .from('referrals')
          .insert(dbReferral)
          .then(({ data, error }) => {
            if (error) {
              console.error('Error saving referral to database:', error);
              console.log('Error details:', error);
              console.log('Attempting to save referral:', dbReferral);
            } else {
              console.log('Referral saved to database successfully:', data);
            }
          });
      } catch (error) {
        console.error('Error preparing referral for database:', error);
      }
    } else {
      console.log("Skipping database insert for non-UUID professional ID:", referral.professional_id);
    }
    
    return newReferral;
  };

  const checkExistingReferral = async (professional_id: string): Promise<boolean> => {
    if (!userId) return false;
    
    console.log("Checking existing referral for user:", userId, "and professional:", professional_id);
    
    try {
      // First check locally
      const localReferrals = loadLocalReferrals();
      const existingLocalReferral = localReferrals.find(r => r.professional_id === professional_id);
      
      if (existingLocalReferral) {
        console.log("Found existing local referral:", existingLocalReferral);
        return true;
      }
      
      // Convert to UUID format if needed
      const formattedProfessionalId = isValidUUID(professional_id) 
        ? professional_id 
        : ensureUUID(professional_id);
      
      // Then check in database
      try {
        // Only attempt database check if it's a valid UUID
        if (isValidUUID(formattedProfessionalId)) {
          const { data, error } = await supabase
            .from('referrals')
            .select('id')
            .eq('user_id', userId)
            .eq('professional_id', formattedProfessionalId);
            
          if (error) {
            console.error("Error checking existing referral:", error);
            return false;
          }
          
          return data && data.length > 0;
        } else {
          console.log("Skipping database check for non-UUID professional ID");
          return false;
        }
      } catch (dbError) {
        console.error("Error checking referrals:", dbError);
        return false;
      }
    } catch (error) {
      console.error("Error in checkExistingReferral:", error);
      return false;
    }
  };

  return {
    referrals,
    loading,
    markAsContacted,
    addLocalReferral,
    checkExistingReferral
  };
};
