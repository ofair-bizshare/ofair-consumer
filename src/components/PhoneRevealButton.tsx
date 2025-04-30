
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Phone } from 'lucide-react';
import { useAuth } from '@/providers/AuthProvider';
import { useNavigate } from 'react-router-dom';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface PhoneRevealButtonProps {
  phoneNumber?: string;
  professionalName: string;
  professionalId: string;
  profession?: string;
  onBeforeReveal?: () => boolean;
  autoReveal?: boolean;
}

const PhoneRevealButton: React.FC<PhoneRevealButtonProps> = ({
  phoneNumber = "000-0000000",
  professionalName,
  professionalId,
  profession = "",
  onBeforeReveal,
  autoReveal = false
}) => {
  const [isRevealed, setIsRevealed] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [showPhoneRequiredDialog, setShowPhoneRequiredDialog] = useState(false);
  const { user, phoneVerified, checkPhoneVerification } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Auto-reveal the phone number if autoReveal is true and user is logged in with phone verified
  useEffect(() => {
    const checkPhoneStatus = async () => {
      if (autoReveal && user) {
        const hasPhoneVerified = await checkPhoneVerification();
        if (hasPhoneVerified) {
          setIsRevealed(true);
          saveReferral().catch(error => {
            console.error("Error auto-saving referral:", error);
          });
        }
      }
    };
    
    checkPhoneStatus();
  }, [autoReveal, user, checkPhoneVerification]);
  
  const handleReveal = async () => {
    if (onBeforeReveal && !onBeforeReveal()) {
      return;
    }
    
    if (!user) {
      setIsDialogOpen(true);
      return;
    }
    
    // Check if user has verified phone number
    const hasPhoneVerified = await checkPhoneVerification();
    
    if (!hasPhoneVerified) {
      setShowPhoneRequiredDialog(true);
      return;
    }
    
    setIsRevealed(true);
    
    // Save the referral to the database
    try {
      if (user) {
        await saveReferral();
      }
    } catch (error) {
      console.error("Error saving referral:", error);
    }
  };
  
  const saveReferral = async () => {
    try {
      // Check if referral already exists for this professional and user
      const { data: existingReferrals } = await supabase
        .from('referrals')
        .select('id')
        .eq('user_id', user?.id)
        .eq('professional_id', professionalId)
        .limit(1);
        
      // Only insert if no existing referral found
      if (!existingReferrals || existingReferrals.length === 0) {
        const { error } = await supabase
          .from('referrals')
          .insert({
            user_id: user?.id,
            professional_id: professionalId,
            professional_name: professionalName,
            phone_number: phoneNumber,
            profession: profession,
            status: 'new'
          });
        
        if (error) {
          console.error("Error saving referral:", error);
        }
      }
    } catch (error) {
      console.error("Error saving referral:", error);
    }
  };
  
  const handleGoToLogin = () => {
    setIsDialogOpen(false);
    navigate('/login', { 
      state: { returnUrl: window.location.pathname }
    });
  };

  const handleVerificationComplete = () => {
    setShowPhoneRequiredDialog(false);
    setIsRevealed(true);
    
    // After verification, save the referral
    if (user) {
      saveReferral().catch(error => {
        console.error("Error saving referral after verification:", error);
      });
    }
    
    toast({
      title: "אימות הושלם בהצלחה",
      description: "כעת באפשרותך לראות את מספרי הטלפון של בעלי המקצוע",
    });
  };

  // Format phone number for display if needed
  const formatPhoneNumber = (phone: string) => {
    if (!phone || phone === "000-0000000") return "מספר לא זמין";
    
    // Basic formatting: If it's just digits, format as XXX-XXXXXXX
    if (/^\d+$/.test(phone) && phone.length >= 9) {
      const prefix = phone.slice(0, 3);
      const number = phone.slice(3);
      return `${prefix}-${number}`;
    }
    
    return phone;
  };

  // Display formatted phone number or reveal button
  const buttonText = isRevealed ? formatPhoneNumber(phoneNumber) : "צפה במספר טלפון";
  const displayedPhone = formatPhoneNumber(phoneNumber);
  
  return (
    <>
      {autoReveal && user && isRevealed ? (
        <div className="flex items-center gap-2 text-green-600 font-medium">
          <Phone className="h-4 w-4" />
          {displayedPhone}
        </div>
      ) : (
        <Button 
          onClick={handleReveal}
          className="w-full bg-[#00D09E] hover:bg-[#00C090] text-white"
        >
          <Phone className="ml-2 h-4 w-4" />
          {buttonText}
        </Button>
      )}
      
      {/* Login Required Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md" dir="rtl">
          <DialogHeader>
            <DialogTitle>התחברות נדרשת</DialogTitle>
            <DialogDescription>
              עליך להתחבר כדי לראות את מספר הטלפון של בעל המקצוע
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-4">
            <p className="text-sm text-muted-foreground">
              ההתחברות מאפשרת לנו לעקוב אחרי ההפניות שלך ולשפר את חווית השימוש באפליקציה
            </p>
          </div>
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button 
              variant="outline" 
              onClick={() => setIsDialogOpen(false)} 
              className="w-full sm:w-auto"
            >
              בטל
            </Button>
            <Button 
              onClick={handleGoToLogin} 
              className="w-full sm:w-auto bg-[#00D09E] hover:bg-[#00C090]"
            >
              עבור לדף ההתחברות
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Phone Verification Dialog */}
      <Dialog open={showPhoneRequiredDialog} onOpenChange={setShowPhoneRequiredDialog}>
        <DialogContent className="sm:max-w-md" dir="rtl">
          <DialogHeader>
            <DialogTitle>אימות מספר טלפון נדרש</DialogTitle>
            <DialogDescription>
              כדי לצפות במספר הטלפון של בעל המקצוע, עליך לאמת את מספר הטלפון שלך
            </DialogDescription>
          </DialogHeader>
          {user && (
            <PhoneVerification 
              phone={user.user_metadata?.phone || ''} 
              onVerified={handleVerificationComplete}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PhoneRevealButton;
