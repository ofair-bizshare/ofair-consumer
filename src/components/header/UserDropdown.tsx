import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, LogOut, Settings, Inbox, UserCircle, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/providers/AuthProvider';
import { RealtimeChannel } from '@supabase/supabase-js';
interface UserDropdownProps {
  onLogout: () => void;
  isMobile?: boolean;
}
const UserDropdown: React.FC<UserDropdownProps> = ({
  onLogout,
  isMobile = false
}) => {
  const navigate = useNavigate();
  const {
    user
  } = useAuth();
  const [notificationsCount, setNotificationsCount] = useState(0);
  useEffect(() => {
    const fetchNotifications = async () => {
      if (!user) return;
      try {
        // Try to fetch real notifications from database
        const {
          data,
          error
        } = await supabase.from('notifications').select('id, is_read').eq('professional_id', user.id).eq('is_read', false);
        if (error) {
          console.error('Error fetching notifications:', error);
          return;
        }

        // Set the actual unread notifications count
        setNotificationsCount(data?.length || 0);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };
    fetchNotifications();

    // Set up realtime subscription for notifications if needed
    let notificationsChannel: RealtimeChannel | null = null;
    if (user) {
      notificationsChannel = supabase.channel('notifications-changes').on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'notifications',
        filter: `professional_id=eq.${user.id}`
      }, () => {
        fetchNotifications();
      }).subscribe();
    }
    return () => {
      if (notificationsChannel) {
        supabase.removeChannel(notificationsChannel);
      }
    };
  }, [user]);
  const handleNotificationsClick = () => {
    navigate('/dashboard?tab=notifications');
  };
  if (isMobile) {
    return <div className="space-y-2">
        <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/dashboard')}>
          <User className="ml-2 h-4 w-4" />
          <span>אזור אישי</span>
        </Button>
        <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/referrals')}>
          <Inbox className="ml-2 h-4 w-4" />
          <span>הפניות שלי</span>
        </Button>
        <Button variant="outline" className="w-full justify-start relative" onClick={handleNotificationsClick}>
          <Bell className="ml-2 h-4 w-4" />
          <span>התראות</span>
          {notificationsCount > 0 && <span className="absolute top-1 left-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
              {notificationsCount}
            </span>}
        </Button>
        <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/settings')}>
          <Settings className="ml-2 h-4 w-4" />
          <span>הגדרות</span>
        </Button>
        <Button variant="outline" className="w-full justify-start text-red-600" onClick={onLogout}>
          <LogOut className="ml-2 h-4 w-4" />
          <span>יציאה</span>
        </Button>
      </div>;
  }
  return <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="hidden md:flex items-center space-x-2 text-blue-700 hover:text-blue-800 hover:bg-blue-50 relative">
          <UserCircle size={18} />
          <span>פרופיל</span>
          {notificationsCount > 0 && <span className="absolute top-0 left-0 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
              {notificationsCount}
            </span>}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 text-right bg-stone-50">
        <DropdownMenuItem onClick={() => navigate('/dashboard')}>
          <User className="ml-2 h-4 w-4" />
          <span className="mx-[4px]">אזור אישי</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigate('/referrals')}>
          <Inbox className="ml-2 h-4 w-4" />
          <span className="mx-[6px]">הפניות שלי</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleNotificationsClick} className="relative">
          <Bell className="ml-2 h-4 w-4" />
          <span className="mx-[4px]">התראות</span>
          {notificationsCount > 0 && <span className="mr-auto bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
              {notificationsCount}
            </span>}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigate('/settings')}>
          <Settings className="ml-2 h-4 w-4" />
          <span className="mx-[6px]">הגדרות</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onLogout}>
          <LogOut className="ml-2 h-4 w-4" />
          <span className="mx-[8px]">יציאה</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>;
};
export default UserDropdown;