
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import RequestsTab from './RequestsTab';
import ReferralsTab from './ReferralsTab';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import NotificationsTab from './NotificationsTab';

interface DashboardTabsProps {
  isLoggedIn: boolean;
}

const DashboardTabs: React.FC<DashboardTabsProps> = ({ isLoggedIn }) => {
  if (!isLoggedIn) {
    return (
      <div className="glass-card p-10 text-center">
        <AlertCircle className="h-14 w-14 text-red-300 mx-auto mb-4" />
        <h2 className="text-2xl font-semibold text-gray-800 mb-3">התחברות נדרשת</h2>
        <p className="text-gray-600 mb-6 max-w-lg mx-auto">
          על מנת לצפות בפרטי הבקשות והצעות המחיר שלך, יש להתחבר למערכת תחילה.
        </p>
        <div className="flex justify-center gap-4">
          <Link to="/login">
            <Button className="bg-blue-600 hover:bg-blue-700">
              התחברות
            </Button>
          </Link>
          <Link to="/register">
            <Button variant="outline">
              הרשמה
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <Tabs defaultValue="requests" dir="rtl" className="animate-fade-in">
      <TabsList className="grid grid-cols-3 md:w-[400px] mb-8">
        <TabsTrigger value="requests">הפניות שלי</TabsTrigger>
        <TabsTrigger value="referrals">הפניות שלי</TabsTrigger>
        <TabsTrigger value="notifications">התראות</TabsTrigger>
      </TabsList>
      
      <TabsContent value="requests">
        <RequestsTab />
      </TabsContent>
      
      <TabsContent value="referrals">
        <ReferralsTab />
      </TabsContent>
      
      <TabsContent value="notifications">
        <NotificationsTab />
      </TabsContent>
    </Tabs>
  );
};

export default DashboardTabs;
