
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Info, Wrench, CreditCard, MessageCircle } from 'lucide-react';
import GeneralFAQContent from './content/GeneralFAQContent';
import ProfessionalsFAQContent from './content/ProfessionalsFAQContent';
import PaymentFAQContent from './content/PaymentFAQContent';
import ReferralsFAQContent from './content/ReferralsFAQContent';

const FAQTabs = () => {
  return (
    <Tabs defaultValue="general" className="mb-16">
      <TabsList className="border-b w-full justify-start mb-8 bg-transparent">
        <TabsTrigger value="general" className="data-[state=active]:border-blue-600 data-[state=active]:text-blue-700 border-b-2 border-transparent rounded-none">
          <Info className="w-4 h-4 mr-2" />
          כללי
        </TabsTrigger>
        <TabsTrigger value="professionals" className="data-[state=active]:border-blue-600 data-[state=active]:text-blue-700 border-b-2 border-transparent rounded-none">
          <Wrench className="w-4 h-4 mr-2" />
          בעלי מקצוע
        </TabsTrigger>
        <TabsTrigger value="payment" className="data-[state=active]:border-blue-600 data-[state=active]:text-blue-700 border-b-2 border-transparent rounded-none">
          <CreditCard className="w-4 h-4 mr-2" />
          תשלומים
        </TabsTrigger>
        <TabsTrigger value="referrals" className="data-[state=active]:border-blue-600 data-[state=active]:text-blue-700 border-b-2 border-transparent rounded-none">
          <MessageCircle className="w-4 h-4 mr-2" />
          הפניות
        </TabsTrigger>
      </TabsList>
      
      <GeneralFAQContent />
      <ProfessionalsFAQContent />
      <PaymentFAQContent />
      <ReferralsFAQContent />
    </Tabs>
  );
};

export default FAQTabs;
