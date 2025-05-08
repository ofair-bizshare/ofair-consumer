
import { supabase } from '@/integrations/supabase/client';

// Save a referral record for a professional
export const saveReferral = async (
  userId: string,
  professionalId: string,
  professionalName: string,
  phoneNumber: string,
  profession: string
): Promise<boolean> => {
  try {
    // Check if referral already exists
    const { data: existingReferral } = await supabase
      .from('referrals')
      .select('*')
      .eq('professional_id', professionalId)
      .eq('user_id', userId)
      .eq('status', 'accepted_quote')
      .single();
      
    if (existingReferral) {
      console.log("Referral already exists:", existingReferral);
      return true;
    }
    
    const referral = {
      id: crypto.randomUUID(),
      user_id: userId,
      professional_id: professionalId,
      professional_name: professionalName,
      phone_number: phoneNumber || "050-1234567",
      date: new Date().toISOString(),
      status: "accepted_quote",
      profession: profession,
      completed_work: false
    };
    
    const { error: referralError } = await supabase
      .from('referrals')
      .insert(referral);
    
    if (referralError) {
      console.error("Error saving referral:", referralError);
      return false;
    }
    
    return true;
  } catch (refError) {
    console.error("Error creating referral:", refError);
    return false;
  }
};
