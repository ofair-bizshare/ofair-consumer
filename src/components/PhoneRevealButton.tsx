
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Phone } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/providers/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

interface PhoneRevealButtonProps {
  phoneNumber: string;
  professionalName: string;
  professionalId: string;
  profession?: string;
  autoReveal?: boolean; // New prop for automatically revealing the number
}

const PhoneRevealButton: React.FC<PhoneRevealButtonProps> = ({ 
  phoneNumber, 
  professionalName,
  professionalId,
  profession,
  autoReveal = false // Default is false
}) => {
  const [isRevealed, setIsRevealed] = useState(autoReveal);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Check if this referral already exists in the database or localStorage
  useEffect(() => {
    const checkExistingReferral = async () => {
      if (!user) return;
      
      // First, check localStorage for offline fallback
      const localReferralsStr = localStorage.getItem(`referrals-${user.id}`);
      if (localReferralsStr) {
        try {
          const localReferrals = JSON.parse(localReferralsStr);
          const exists = localReferrals.some((ref: any) => ref.professionalId === professionalId);
          if (exists) {
            setIsRevealed(true);
            return;
          }
        } catch (e) {
          console.error("Error parsing local referrals:", e);
        }
      }
      
      // Then check the database
      try {
        console.log("Checking existing referral for user:", user.id, "and professional:", professionalId);
        
        const { data, error } = await supabase
          .from('referrals')
          .select('*')
          .eq('user_id', user.id)
          .eq('professional_id', professionalId)
          .maybeSingle();
        
        if (error) {
          console.error("Error checking referrals:", error);
          return;
        }
        
        console.log("Existing referral data:", data);
        
        if (data) {
          setIsRevealed(true);
        }
      } catch (error) {
        console.error('Error checking referral:', error);
      }
    };

    if (autoReveal) {
      setIsRevealed(true);
    } else {
      checkExistingReferral();
    }
  }, [user, professionalId, autoReveal]);

  const handleReveal = async () => {
    if (!user) {
      toast({
        title: "התחברות נדרשת",
        description: "עליך להתחבר כדי לראות את פרטי ההתקשרות",
        variant: "destructive",
      });
      navigate('/login', { state: { returnUrl: window.location.pathname } });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Validate data before proceeding
      if (!professionalId || !professionalName || !phoneNumber) {
        throw new Error("Missing required referral data");
      }
      
      // Important: Let Supabase generate the UUID, don't generate it client-side
      const referral = {
        user_id: user.id,
        professional_id: professionalId,
        professional_name: professionalName,
        phone_number: phoneNumber,
        date: new Date().toISOString(),
        status: "new",
        profession: profession || "בעל מקצוע",
        completed_work: false
      };
      
      console.log("Attempting to save referral:", referral);
      
      // First check if there's an existing record
      const { data: existingData, error: checkError } = await supabase
        .from('referrals')
        .select('id')
        .eq('user_id', user.id)
        .eq('professional_id', professionalId)
        .maybeSingle();
      
      if (checkError) {
        console.error('Error checking existing referral:', checkError);
        // Continue with local storage fallback
      }
      
      let result;
      
      if (existingData) {
        // If record exists, update it
        console.log("Updating existing referral:", existingData.id);
        result = await supabase
          .from('referrals')
          .update({
            phone_number: phoneNumber,
            professional_name: professionalName,
            profession: profession || "בעל מקצוע",
            updated_at: new Date().toISOString()
          })
          .eq('id', existingData.id);
      } else {
        // If no record exists, insert new one
        console.log("Inserting new referral");
        result = await supabase
          .from('referrals')
          .insert(referral);
      }
      
      if (result.error) {
        console.error('Error details:', result.error);
        throw result.error;
      }
      
      console.log("Referral operation result:", result);
      
      // Regardless of the result, save to localStorage as a fallback
      const localReferralsStr = localStorage.getItem(`referrals-${user.id}`);
      let localReferrals = [];
      
      if (localReferralsStr) {
        try {
          localReferrals = JSON.parse(localReferralsStr);
        } catch (e) {
          console.error("Error parsing local referrals:", e);
        }
      }
      
      // Check if this professional is already in the local storage
      const existingIndex = localReferrals.findIndex((ref: any) => ref.professionalId === professionalId);
      
      if (existingIndex >= 0) {
        // Update existing entry
        localReferrals[existingIndex] = {
          ...localReferrals[existingIndex],
          phoneNumber,
          professionalName,
          profession: profession || "בעל מקצוע",
          updatedAt: new Date().toISOString()
        };
      } else {
        // Add new entry
        localReferrals.push({
          id: `local-${Date.now()}`,
          user_id: user.id,
          professionalId,
          professionalName,
          phoneNumber,
          date: new Date().toLocaleDateString('he-IL'),
          status: "new",
          profession: profession || "בעל מקצוע",
          completedWork: false
        });
      }
      
      localStorage.setItem(`referrals-${user.id}`, JSON.stringify(localReferrals));
      
      setIsRevealed(true);
      
      // Show success toast
      toast({
        title: "פרטי התקשרות נשמרו",
        description: `פרטי ההפניה ל${professionalName} נשמרו באזור האישי שלך`,
        variant: "default",
      });
    } catch (error) {
      console.error('Error saving referral:', error);
      // Still reveal the phone number
      setIsRevealed(true);
      
      toast({
        title: "שגיאה בשמירת ההפניה",
        description: "אירעה שגיאה בשמירת פרטי ההפניה, אך המספר זמין עבורך",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant={isRevealed ? "outline" : "default"}
      className={`w-full ${isRevealed ? "border-blue-500 text-blue-700" : "bg-[#00D09E] hover:bg-[#00C090]"}`}
      onClick={isRevealed ? undefined : handleReveal}
      disabled={isLoading}
    >
      <Phone className="ml-2 h-4 w-4" />
      {isLoading ? "טוען..." : isRevealed ? phoneNumber : "הצג מספר טלפון"}
    </Button>
  );
};

export default PhoneRevealButton;
