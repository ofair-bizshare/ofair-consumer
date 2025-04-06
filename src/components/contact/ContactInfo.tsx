
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Mail, Phone, MapPin } from 'lucide-react';

const ContactInfo = () => {
  return (
    <Card className="h-full">
      <CardContent className="p-6 space-y-6">
        <h2 className="text-xl font-semibold mb-4">פרטי התקשרות</h2>
        
        <div className="space-y-4">
          <div className="flex items-center">
            <div className="bg-[#00D09E]/10 p-3 rounded-full ml-4">
              <Mail className="h-5 w-5 text-[#00D09E]" />
            </div>
            <div>
              <p className="text-sm text-gray-500">דוא״ל</p>
              <a href="mailto:contact@ofair.co.il" className="font-medium text-blue-600 hover:underline">info@ofair.co.il</a>
            </div>
          </div>
          
          <div className="flex items-center">
            <div className="bg-[#00D09E]/10 p-3 rounded-full ml-4">
              <Phone className="h-5 w-5 text-[#00D09E]" />
            </div>
            <div>
              <p className="text-sm text-gray-500">טלפון</p>
              <a href="tel:050-552-4542" className="font-medium">050-552-4542</a>
            </div>
          </div>
          
          <div className="flex items-center">
            <div className="bg-[#00D09E]/10 p-3 rounded-full ml-4">
              <MapPin className="h-5 w-5 text-[#00D09E]" />
            </div>
            <div>
              <p className="text-sm text-gray-500">כתובת</p>
              <p className="font-medium">הקטיף, נתיבות, ישראל</p>
            </div>
          </div>
        </div>
        
        <div className="pt-6 mt-6 border-t border-gray-200">
          <h3 className="font-medium mb-2">שעות פעילות</h3>
          <p className="text-sm text-gray-600">
            ימים א׳-ה׳: 9:00 - 18:00<br />
            יום ו׳: 9:00 - 13:00
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ContactInfo;
