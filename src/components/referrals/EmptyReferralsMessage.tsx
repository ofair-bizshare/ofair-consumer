
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';

const EmptyReferralsMessage: React.FC = () => {
  return (
    <div className="text-center py-12">
      <AlertCircle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
      <h3 className="text-xl font-semibold text-gray-700 mb-2">אין הפניות עדיין</h3>
      <p className="text-gray-500 mb-4">
        כאשר תיצור הפניות לבעלי מקצוע, הן יופיעו כאן כדי שתוכל לעקוב אחריהן
      </p>
      <Link to="/search">
        <Button className="bg-[#00D09E] hover:bg-[#00C090]">
          חפש בעלי מקצוע
        </Button>
      </Link>
    </div>
  );
};

export default EmptyReferralsMessage;
