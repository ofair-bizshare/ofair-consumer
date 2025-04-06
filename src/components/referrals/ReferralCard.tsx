
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Phone, Eye, Calendar, CheckCircle } from 'lucide-react';
import { ReferralInterface } from '@/types/dashboard';

interface ReferralCardProps {
  referral: ReferralInterface;
  onMarkContacted: (id: string) => void;
}

const ReferralCard: React.FC<ReferralCardProps> = ({ referral, onMarkContacted }) => {
  return (
    <Card key={referral.id} className="overflow-hidden hover:shadow-md transition-shadow">
      <CardContent className="p-0">
        <div className="p-5">
          <div className="flex justify-between items-start mb-3">
            <div>
              <h3 className="text-lg font-semibold">{referral.professionalName}</h3>
              <p className="text-gray-500 text-sm">{referral.profession || "בעל מקצוע"}</p>
            </div>
            <div className="flex items-center text-sm">
              {referral.status === 'new' ? (
                <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full">חדש</span>
              ) : (
                <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full flex items-center">
                  <CheckCircle className="h-3 w-3 ml-1" />
                  נוצר קשר
                </span>
              )}
            </div>
          </div>
          
          <div className="text-gray-700 mb-4">
            <div className="flex items-center mb-2">
              <Phone className="h-4 w-4 text-[#00D09E] ml-2" />
              <a href={`tel:${referral.phoneNumber}`} className="font-medium hover:text-blue-600 transition-colors">
                {referral.phoneNumber}
              </a>
            </div>
            <div className="flex items-center text-sm text-gray-500">
              <Calendar className="h-3 w-3 ml-1" />
              <p>{referral.date}</p>
            </div>
          </div>
          
          <div className="flex justify-between pt-2 border-t border-gray-100">
            <Button 
              variant="outline" 
              size="sm" 
              className="text-blue-700 border-blue-200 hover:bg-blue-50" 
              onClick={() => window.open(`/professional/${referral.professionalId}`, '_blank')}
            >
              <Eye size={16} className="ml-1" />
              צפה בפרופיל
            </Button>
            
            {referral.status === 'new' && (
              <Button 
                size="sm" 
                className="bg-[#00D09E] hover:bg-[#00C090]" 
                onClick={() => onMarkContacted(referral.id!)}
              >
                סמן כנוצר קשר
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReferralCard;
