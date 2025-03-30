
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Phone } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/providers/AuthProvider';
import { supabase } from '@/integrations/supabase/client';

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

  // Check if this referral already exists in the database
  useEffect(() => {
    const checkExistingReferral = async () => {
      if (!user) return;
      
      try {
        const { data } = await supabase
          .from('referrals')
          .select('*')
          .eq('user_id', user.id)
          .eq('professional_id', professionalId)
          .maybeSingle();
        
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
      // Optionally redirect to login page here
      return;
    }
    
    setIsLoading(true);
    
    // Create a referral in the database
    try {
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
      
      // Insert into Supabase
      const { error } = await supabase
        .from('referrals')
        .upsert(referral, {
          onConflict: 'user_id,professional_id',
          ignoreDuplicates: false
        });
      
      if (error) throw error;
      
      setIsRevealed(true);
      
      // Show success toast
      toast({
        title: "פרטי התקשרות נשמרו",
        description: `פרטי ההפניה ל${professionalName} נשמרו באזור האישי שלך`,
        variant: "default",
      });
      
      console.log("Referral saved to Supabase");
    } catch (error) {
      console.error('Error saving referral:', error);
      toast({
        title: "שגיאה בשמירת ההפניה",
        description: "אירעה שגיאה בשמירת פרטי ההפניה",
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
