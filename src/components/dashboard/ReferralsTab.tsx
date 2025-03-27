
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const ReferralsTab: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="glass-card p-6">
        <h2 className="text-2xl font-semibold text-blue-700 mb-4">ההפניות שלי</h2>
        <p className="text-gray-600 mb-6">
          כאן תוכל לראות את ההפניות שיצרת לבעלי מקצוע, את הסטטוס שלהן ואת הפרטים שנשלחו
        </p>
        
        <div className="text-center p-6">
          <p className="text-lg mb-4">לצפייה בהפניות שלך, עבור לעמוד ההפניות המלא</p>
          <Link to="/referrals">
            <Button className="bg-[#00D09E] hover:bg-[#00C090]">
              עבור להפניות שלי
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ReferralsTab;
