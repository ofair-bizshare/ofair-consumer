import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Phone } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/providers/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';

interface PhoneRevealButtonProps {
  phoneNumber: string;
  professionalName: string;
  professionalId: string;
  profession?: string;
  autoReveal?: boolean; // New prop for automatically revealing the number
  onPhoneReveal?: (professionalName: string) => boolean; // Callback for login checks
}

const PhoneRevealButton: React.FC<PhoneRevealButtonProps> = ({ 
  phoneNumber, 
  professionalName,
  professionalId,
  profession,
  autoReveal = false, // Default is false
  onPhoneReveal = () => true, // Default function that allows reveal
}) => {
  const [isRevealed, setIsRevealed] = useState(autoReveal);
  const [isLoading, setIsLoading] = useState(false);
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    const checkExistingReferral = async () => {
      if (!user) return;
      
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
      
      try {
        console.log("Checking existing referral for user:", user.id, "and professional:", professionalId);
        
        if (!isValidUUID(professionalId)) {
          console.log("Skipping database check for non-UUID professional ID:", professionalId);
          return;
        }
        
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

  const isValidUUID = (id: string): boolean => {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(id);
  };

  const handleReveal = async () => {
    const allowReveal = onPhoneReveal(professionalName);
    
    if (!allowReveal) {
      return;
    }
    
    if (!user) {
      setShowLoginDialog(true);
      return;
    }
    
    setIsLoading(true);
    
    try {
      if (!professionalId || !professionalName || !phoneNumber) {
        throw new Error("Missing required referral data");
      }
      
      const localReferralId = `local-${Date.now()}-${uuidv4().substring(0, 8)}`;
      
      if (!isValidUUID(professionalId)) {
        const localReferral = {
          id: localReferralId,
          user_id: user.id,
          professionalId: professionalId,
          professionalName: professionalName,
          phoneNumber: phoneNumber,
          date: new Date().toLocaleDateString('he-IL'),
          status: "new",
          profession: profession || "בעל מקצוע",
          completedWork: false
        };
        
        console.log("Saving non-UUID professional to localStorage only:", localReferral);
        
        const localReferralsStr = localStorage.getItem(`referrals-${user.id}`);
        let localReferrals = [];
        if (localReferralsStr) {
          try {
            localReferrals = JSON.parse(localReferralsStr);
          } catch (e) {
            console.error("Error parsing local referrals:", e);
          }
        }
        
        const existingIndex = localReferrals.findIndex((ref: any) => ref.professionalId === professionalId);
        
        if (existingIndex >= 0) {
          localReferrals[existingIndex] = {
            ...localReferrals[existingIndex],
            phoneNumber,
            professionalName,
            profession: profession || "בעל מקצוע",
            updatedAt: new Date().toISOString()
          };
        } else {
          localReferrals.push(localReferral);
        }
        
        localStorage.setItem(`referrals-${user.id}`, JSON.stringify(localReferrals));
        setIsRevealed(true);
        
        toast({
          title: "פרטי התקשרות נשמרו",
          description: `פרטי ההפניה ל${professionalName} נשמרו מקומית באזור האישי שלך`,
          variant: "default",
        });
        
        setIsLoading(false);
        return;
      }
      
      try {
        console.log("Checking existing referral before saving");
        const { data: existingData, error: checkError } = await supabase
          .from('referrals')
          .select('id')
          .eq('user_id', user.id)
          .eq('professional_id', professionalId)
          .maybeSingle();
        
        if (checkError) {
          console.error('Error checking existing referral:', checkError);
          throw checkError;
        }
        
        let result;
        
        if (existingData) {
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
          console.log("Inserting new referral");
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
          result = await supabase
            .from('referrals')
            .insert(referral);
        }
        
        if (result.error) {
          console.error('Error details:', result.error);
          throw result.error;
        }
        
        console.log("Referral operation result:", result);
      } catch (dbErr) {
        console.error('Database error:', dbErr);
        throw dbErr;
      }
      
      const localReferralsStr = localStorage.getItem(`referrals-${user.id}`);
      let localReferrals = [];
      
      if (localReferralsStr) {
        try {
          localReferrals = JSON.parse(localReferralsStr);
        } catch (e) {
          console.error("Error parsing local referrals:", e);
        }
      }
      
      const existingIndex = localReferrals.findIndex((ref: any) => ref.professionalId === professionalId);
      
      if (existingIndex >= 0) {
        localReferrals[existingIndex] = {
          ...localReferrals[existingIndex],
          phoneNumber,
          professionalName,
          profession: profession || "בעל מקצוע",
          updatedAt: new Date().toISOString()
        };
      } else {
        localReferrals.push({
          id: localReferralId,
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
      
      toast({
        title: "פרטי התקשרות נשמרו",
        description: `פרטי ההפניה ל${professionalName} נשמרו באזור האישי שלך`,
        variant: "default",
      });
    } catch (error) {
      console.error('Error saving referral:', error);
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

  const handleLoginRedirect = () => {
    setShowLoginDialog(false);
    window.location.href = '/login?returnUrl=' + encodeURIComponent(window.location.pathname);
  };

  return (
    <>
      <Button
        variant={isRevealed ? "outline" : "default"}
        className={`w-full ${isRevealed ? "border-blue-500 text-blue-700" : "bg-[#00D09E] hover:bg-[#00C090]"}`}
        onClick={isRevealed ? undefined : handleReveal}
        disabled={isLoading}
      >
        <Phone className="ml-2 h-4 w-4" />
        {isLoading ? "טוען..." : isRevealed ? phoneNumber : "הצג מספר טלפון"}
      </Button>
      
      <Dialog open={showLoginDialog} onOpenChange={setShowLoginDialog}>
        <DialogContent className="sm:max-w-[425px]" dir="rtl">
          <DialogTitle className="text-center mb-4">התחברות נדרשת</DialogTitle>
          <div className="text-center mb-6">
            <p className="mb-4">עליך להתחבר כדי לצפות בפרטי ההתקשרות של {professionalName}</p>
            <Button 
              className="bg-blue-600 hover:bg-blue-700"
              onClick={handleLoginRedirect}
            >
              התחבר עכשיו
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PhoneRevealButton;
