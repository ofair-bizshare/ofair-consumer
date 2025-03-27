
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { User, LogOut, Settings, Inbox, UserCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface UserDropdownProps {
  onLogout: () => void;
  isMobile?: boolean;
}

const UserDropdown: React.FC<UserDropdownProps> = ({ onLogout, isMobile = false }) => {
  const navigate = useNavigate();

  if (isMobile) {
    return (
      <div className="space-y-2">
        <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/dashboard')}>
          <User className="mr-2 h-4 w-4" />
          <span>אזור אישי</span>
        </Button>
        <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/referrals')}>
          <Inbox className="mr-2 h-4 w-4" />
          <span>ההפניות שלי</span>
        </Button>
        <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/dashboard/settings')}>
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
        <Button 
          variant="ghost" 
          className="hidden md:flex items-center space-x-2 text-blue-700 hover:text-blue-800 hover:bg-blue-50"
        >
          <UserCircle size={18} />
          <span>פרופיל</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuItem onClick={() => navigate('/dashboard')}>
          <User className="mr-2 h-4 w-4" />
          <span>אזור אישי</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigate('/referrals')}>
          <Inbox className="mr-2 h-4 w-4" />
          <span>ההפניות שלי</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigate('/dashboard/settings')}>
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
