
import React from 'react';
import { ReferralInterface } from '@/types/dashboard';
import ReferralCard from './ReferralCard';
import EmptyReferralsMessage from './EmptyReferralsMessage';

interface ReferralsGridProps {
  referrals: ReferralInterface[];
  onMarkContacted: (id: string) => void;
}

const ReferralsGrid: React.FC<ReferralsGridProps> = ({ referrals, onMarkContacted }) => {
  if (referrals.length === 0) {
    return <EmptyReferralsMessage />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {referrals.map((referral) => (
        <ReferralCard 
          key={referral.id} 
          referral={referral} 
          onMarkContacted={onMarkContacted} 
        />
      ))}
    </div>
  );
};

export default ReferralsGrid;
