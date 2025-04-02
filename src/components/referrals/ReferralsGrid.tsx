
import React, { useEffect } from 'react';
import { ReferralInterface } from '@/types/dashboard';
import ReferralCard from './ReferralCard';
import EmptyReferralsMessage from './EmptyReferralsMessage';

interface ReferralsGridProps {
  referrals: ReferralInterface[];
  onMarkContacted: (id: string) => void;
}

const ReferralsGrid: React.FC<ReferralsGridProps> = ({ referrals, onMarkContacted }) => {
  console.log("Rendering ReferralsGrid with referrals:", referrals);
  
  // If user is logged in but we have no data, check localStorage for offline fallback
  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (userId && (!referrals || referrals.length === 0)) {
      const localReferralsStr = localStorage.getItem(`referrals-${userId}`);
      if (localReferralsStr) {
        try {
          // We don't use this directly, just logging to help debug
          const localReferrals = JSON.parse(localReferralsStr);
          console.log("Found local referrals:", localReferrals);
        } catch (e) {
          console.error("Error parsing local referrals:", e);
        }
      }
    }
  }, [referrals]);
  
  if (!referrals || referrals.length === 0) {
    return <EmptyReferralsMessage />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {referrals.map((referral) => {
        if (!referral.id) {
          console.warn("Referral missing ID:", referral);
          return null;
        }
        
        return (
          <ReferralCard 
            key={referral.id} 
            referral={referral} 
            onMarkContacted={onMarkContacted} 
          />
        );
      })}
    </div>
  );
};

export default ReferralsGrid;
