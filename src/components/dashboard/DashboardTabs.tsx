
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Link } from 'react-router-dom';
import ReferralsTab from './ReferralsTab';
import RequestsTab from './RequestsTab';
import NotificationsTab from './NotificationsTab';
import { MessageSquare, Phone, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DashboardTabsProps {
  isLoggedIn: boolean;
  defaultTab?: string;
}

const DashboardTabs: React.FC<DashboardTabsProps> = ({ isLoggedIn, defaultTab = "requests" }) => {
  const [activeTab, setActiveTab] = useState(defaultTab);
  
  console.log("Rendering DashboardTabs with active tab:", activeTab);
  
  if (!isLoggedIn) {
    return (
      <div className="glass-card p-8 text-center">
        <h2 className="text-xl font-semibold mb-4">התחבר כדי לצפות באזור האישי שלך</h2>
        <p className="text-gray-600 mb-6">עליך להתחבר כדי לצפות בפניות, הצעות והתראות</p>
        <Button asChild className="bg-blue-600 hover:bg-blue-700">
          <Link to="/login">התחבר עכשיו</Link>
        </Button>
      </div>
    );
  }

  return (
    <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
      <div className="flex justify-between items-center mb-6">
        <TabsList className="grid grid-cols-3 h-auto">
          <TabsTrigger value="requests" className="py-3">
            <MessageSquare className="ml-2 h-5 w-5 text-blue-500" />
            <span>פניות מקצועיות</span>
          </TabsTrigger>
          <TabsTrigger value="referrals" className="py-3">
            <Phone className="ml-2 h-5 w-5 text-teal-500" />
            <span>אנשי קשר שמורים</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="py-3">
            <Bell className="ml-2 h-5 w-5 text-amber-500" />
            <span>התראות</span>
          </TabsTrigger>
        </TabsList>
      </div>
      
      <TabsContent value="requests" className="mt-0">
        <RequestsTab />
      </TabsContent>
      
      <TabsContent value="referrals" className="mt-0">
        <ReferralsTab />
      </TabsContent>
      
      <TabsContent value="notifications" className="mt-0">
        <NotificationsTab />
      </TabsContent>
    </Tabs>
  );
};

export default DashboardTabs;
