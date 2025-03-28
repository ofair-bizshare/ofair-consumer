
import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Info, Wrench, CreditCard, MessageCircle } from 'lucide-react';
import GeneralFAQContent from './content/GeneralFAQContent';
import ProfessionalsFAQContent from './content/ProfessionalsFAQContent';
import PaymentFAQContent from './content/PaymentFAQContent';
import ReferralsFAQContent from './content/ReferralsFAQContent';

const FAQTabs = () => {
  const [activeTab, setActiveTab] = useState("general");

  return (
    <Tabs defaultValue="general" className="mb-16" value={activeTab} onValueChange={setActiveTab}>
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
      
      <TabsContent value="general">
        <GeneralFAQContent />
      </TabsContent>
      <TabsContent value="professionals">
        <ProfessionalsFAQContent />
      </TabsContent>
      <TabsContent value="payment">
        <PaymentFAQContent />
      </TabsContent>
      <TabsContent value="referrals">
        <ReferralsFAQContent />
      </TabsContent>
    </Tabs>
  );
};

export default FAQTabs;
