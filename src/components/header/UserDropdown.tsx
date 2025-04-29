import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, LogOut, Settings, Inbox, UserCircle, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/providers/AuthProvider';
import type { RealtimeChannel } from '@supabase/supabase-js';

interface UserDropdownProps {
  onLogout: () => void;
  isMobile?: boolean;
}

const UserDropdown: React.FC<UserDropdownProps> = ({
  onLogout,
  isMobile = false
}) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [notificationsCount, setNotificationsCount] = useState(0);

  useEffect(() => {
    const fetchNotifications = async () => {
      if (!user) return;
      try {
        // Check if we have a notification count in localStorage
        const cachedCount = localStorage.getItem(`notificationCount-${user.id}`);
        
        if (cachedCount) {
          setNotificationsCount(parseInt(cachedCount, 10));
        } else {
          // Default to 0 notifications
          setNotificationsCount(0);
          // Store in localStorage
          localStorage.setItem(`notificationCount-${user.id}`, '0');
        }
        
        // Try to fetch real notifications from database
        try {
          const { count, error } = await supabase
            .from('notifications')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', user.id)
            .eq('is_read', false);
          
          if (!error && count !== null) {
            setNotificationsCount(count);
            localStorage.setItem(`notificationCount-${user.id}`, count.toString());
          }
        } catch (dbError) {
          console.error('Error fetching notifications:', dbError);
        }
      } catch (error) {
        console.error('Error in notifications logic:', error);
      }
    };
    
    fetchNotifications();
    
    // Set up subscription for real-time notifications if user exists
    let channel: RealtimeChannel | null = null;
    
    if (user) {
      channel = supabase
        .channel('notifications')
        .on('postgres_changes', { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'notifications',
          filter: `user_id=eq.${user.id}`
        }, (payload) => {
          setNotificationsCount(prev => {
            const newCount = prev + 1;
            localStorage.setItem(`notificationCount-${user.id}`, newCount.toString());
            return newCount;
          });
        })
        .subscribe();
    }
      
    return () => {
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, [user]);

  const handleNotificationsClick = () => {
    // Reset notification count when viewing notifications
    if (notificationsCount > 0) {
      setNotificationsCount(0);
      if (user) {
        localStorage.setItem(`notificationCount-${user.id}`, '0');
      }
    }
    navigate('/dashboard?tab=notifications');
  };

  if (isMobile) {
    return (
      <div className="space-y-2">
        <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/dashboard')}>
          <User className="mr-2 h-4 w-4" />
          <span>אזור אישי</span>
        </Button>
        <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/referrals')}>
          <Inbox className="mr-2 h-4 w-4" />
          <span>הפניות שלי</span>
        </Button>
        <Button variant="outline" className="w-full justify-start relative" onClick={handleNotificationsClick}>
          <Bell className="mr-2 h-4 w-4" />
          <span>התראות</span>
          {notificationsCount > 0 && (
            <span className="absolute top-1 right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
              {notificationsCount}
            </span>
          )}
        </Button>
        <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/settings')}>
          <Settings className="mr-2 h-4 w-4" />
          <span>הגדרות</span>
        </Button>
        <Button variant="outline" className="w-full justify-start text-red-600" onClick={onLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>יציאה</span>
        </Button>
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="hidden md:flex items-center space-x-2 text-blue-700 hover:text-blue-800 hover:bg-blue-50 relative">
          <UserCircle size={18} />
          <span>פרופיל</span>
          {notificationsCount > 0 && (
            <span className="absolute top-0 right-0 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
              {notificationsCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuItem onClick={() => navigate('/dashboard')}>
          <User className="mr-2 h-4 w-4" />
          <span>אזור אישי</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigate('/referrals')}>
          <Inbox className="mr-2 h-4 w-4" />
          <span>הפניות שלי</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleNotificationsClick} className="relative">
          <Bell className="mr-2 h-4 w-4" />
          <span>התראות</span>
          {notificationsCount > 0 && (
            <span className="ml-auto bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
              {notificationsCount}
            </span>
          )}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigate('/settings')}>
          <Settings className="mr-2 h-4 w-4" />
          <span>הגדרות</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>יציאה</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserDropdown;
