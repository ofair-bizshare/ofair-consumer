
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Link } from 'react-router-dom';
import RequestsTab from './RequestsTab';
import ReferralsTab from './ReferralsTab';
import CreditCard from './CreditCard';

interface DashboardTabsProps {
  isLoggedIn: boolean;
}

const DashboardTabs: React.FC<DashboardTabsProps> = ({ isLoggedIn }) => {
  return (
    <Tabs defaultValue="requests" className="mb-8">
      <TabsList className="w-full mb-6">
        <TabsTrigger value="requests" className="flex-1">הבקשות והצעות שלי</TabsTrigger>
        <TabsTrigger value="referrals" className="flex-1">
          <Link to="/referrals" className="w-full h-full flex items-center justify-center">
            ההפניות שלי
          </Link>
        </TabsTrigger>
        {isLoggedIn && <TabsTrigger value="credits" className="flex-1">הקרדיט שלי</TabsTrigger>}
      </TabsList>
      
      <TabsContent value="requests">
        <RequestsTab />
      </TabsContent>
      
      <TabsContent value="referrals">
        <ReferralsTab />
      </TabsContent>
      
      <TabsContent value="credits">
        <div className="max-w-md mx-auto">
          <CreditCard creditAmount={250} />
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default DashboardTabs;
