
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import RequestsTab from './RequestsTab';
import ReferralsTab from './ReferralsTab';
import { Button } from '@/components/ui/button';
import { FileText } from 'lucide-react';
import RequestDialog from './RequestDialog';

interface DashboardTabsProps {
  isLoggedIn: boolean;
}

const DashboardTabs: React.FC<DashboardTabsProps> = ({ isLoggedIn }) => {
  const [isRequestDialogOpen, setIsRequestDialogOpen] = React.useState(false);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-blue-700">ניהול הפעילות שלי</h2>
        
        <RequestDialog
          isOpen={isRequestDialogOpen} 
          onOpenChange={setIsRequestDialogOpen} 
          triggerClassName="bg-[#00D09E] hover:bg-[#00C090] text-white"
          triggerLabel="שליחת בקשה חדשה"
        />
      </div>
      
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
    </div>
  );
};

export default DashboardTabs;
