
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import RequestsTab from './RequestsTab';
import ReferralsTab from './ReferralsTab';

interface DashboardTabsProps {
  isLoggedIn: boolean;
}

const DashboardTabs: React.FC<DashboardTabsProps> = ({ isLoggedIn }) => {
  return (
    <Tabs defaultValue="requests" className="mb-8">
      <TabsList className="w-full mb-6">
        <TabsTrigger value="requests" className="flex-1">הבקשות והצעות שלי</TabsTrigger>
        <TabsTrigger value="referrals" className="flex-1">
          ההפניות שלי
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="requests">
        <RequestsTab />
      </TabsContent>
      
      <TabsContent value="referrals">
        <ReferralsTab />
      </TabsContent>
    </Tabs>
  );
};

export default DashboardTabs;
