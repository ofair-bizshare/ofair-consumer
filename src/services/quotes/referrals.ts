
import { supabase } from '@/integrations/supabase/client';
import { createReferralNotification } from '@/services/notifications';

/**
 * Save referral to the database
 */
export const saveReferral = async (
  userId: string,
  professionalId: string,
  professionalName: string,
  phoneNumber: string,
  profession: string,
  userName?: string // נחוץ להתראה (ניתן להעביר מהקריאה)
): Promise<boolean> => {
  try {
    console.log("Saving referral:", {
      userId, professionalId, professionalName, phoneNumber, profession
    });

    const { error } = await supabase
      .from('referrals')
      .insert({
        user_id: userId,
        professional_id: professionalId,
        professional_name: professionalName,
        phone_number: phoneNumber,
        profession: profession,
        date: new Date().toISOString(),
        status: 'new'
      });

    if (error) {
      console.error("Error saving referral:", error);
      return false;
    }

    // יצירת התראה לבעל המקצוע שקיבל הפנייה
    await createReferralNotification(professionalId, professionalName, phoneNumber, userName);

    return true;
  } catch (error) {
    console.error("Error saving referral:", error);
    return false;
  }
};
