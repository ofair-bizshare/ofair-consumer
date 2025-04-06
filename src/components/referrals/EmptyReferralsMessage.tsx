
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { AlertCircle, Search } from 'lucide-react';

const EmptyReferralsMessage: React.FC = () => {
  return (
    <div className="text-center py-12">
      <AlertCircle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
      <h3 className="text-xl font-semibold text-gray-700 mb-2">אין הפניות עדיין</h3>
      <p className="text-gray-500 mb-4">
        כאשר תיצור הפניות לבעלי מקצוע, הן יופיעו כאן כדי שתוכל לעקוב אחריהן
      </p>
      <p className="text-sm text-gray-600 max-w-md mx-auto mb-6">
        כדי ליצור הפניה, חפש בעלי מקצוע דרך עמוד החיפוש, לחץ על פרופיל של מישהו שמעניין אותך, 
        ואז לחץ על "הצג מספר טלפון". כל בעל מקצוע שראית את מספר הטלפון שלו יתווסף לרשימת ההפניות שלך.
      </p>
      <Link to="/search">
        <Button className="bg-[#00D09E] hover:bg-[#00C090]">
          <Search size={18} className="ml-2" />
          חפש בעלי מקצוע
        </Button>
      </Link>
    </div>
  );
};

export default EmptyReferralsMessage;
