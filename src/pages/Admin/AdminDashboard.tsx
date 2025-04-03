
import React from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, FileText, MessageSquare, CheckCircle } from 'lucide-react';
import { fetchProfessionals } from '@/services/professionals';
import { fetchArticles } from '@/services/articles';
import { fetchUserMessages, fetchAllUsers } from '@/services/admin';

const AdminDashboard = () => {
  const [stats, setStats] = React.useState({
    professionals: 0,
    articles: 0,
    messages: 0,
    users: 0
  });
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        
        // Fetch data in parallel
        const [professionals, articles, messages, users] = await Promise.all([
          fetchProfessionals().catch(err => {
            console.error('Error fetching professionals:', err);
            return [];
          }),
          fetchArticles().catch(err => {
            console.error('Error fetching articles:', err);
            return [];
          }),
          fetchUserMessages().catch(err => {
            console.error('Error fetching messages:', err);
            return [];
          }),
          fetchAllUsers().catch(err => {
            console.error('Error fetching users:', err);
            return [];
          })
        ]);
        
        setStats({
          professionals: professionals?.length || 0,
          articles: articles?.length || 0,
          messages: messages?.length || 0,
          users: users?.length || 0
        });
      } catch (error) {
        console.error('Error fetching admin stats:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchStats();
  }, []);

  return (
    <AdminLayout>
      <h1 className="text-3xl font-bold mb-6">דשבורד ניהול</h1>
      
      {loading ? (
        <div className="flex justify-center my-12">
          <div className="w-12 h-12 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard 
            title="בעלי מקצוע" 
            value={stats.professionals} 
            description="סה״כ בעלי מקצוע במערכת" 
            icon={<Users className="h-8 w-8 text-blue-500" />} 
          />
          <StatCard 
            title="מאמרים" 
            value={stats.articles} 
            description="סה״כ מאמרים שפורסמו" 
            icon={<FileText className="h-8 w-8 text-green-500" />} 
          />
          <StatCard 
            title="הודעות" 
            value={stats.messages} 
            description="סה״כ הודעות שנשלחו" 
            icon={<MessageSquare className="h-8 w-8 text-yellow-500" />} 
          />
          <StatCard 
            title="משתמשים" 
            value={stats.users} 
            description="סה״כ משתמשים רשומים" 
            icon={<CheckCircle className="h-8 w-8 text-purple-500" />} 
          />
        </div>
      )}
      
      <div className="mt-10">
        <h2 className="text-2xl font-bold mb-4">פעולות אחרונות</h2>
        <Card>
          <CardHeader>
            <CardTitle>לוח זמנים של פעילות</CardTitle>
            <CardDescription>פעולות אחרונות שבוצעו במערכת</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-500 dark:text-gray-400 text-center py-8">
              מידע על פעולות אחרונות יוצג כאן בקרוב
            </p>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

interface StatCardProps {
  title: string;
  value: number;
  description: string;
  icon: React.ReactNode;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, description, icon }) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
};

export default AdminDashboard;
