import React from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Settings, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useAuth } from '@/providers/AuthProvider';

interface MobileProfileButtonProps {
  onLogout: () => void;
}

const MobileProfileButton: React.FC<MobileProfileButtonProps> = ({ onLogout }) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  if (!user) {
    return (
      <Button 
        variant="ghost" 
        size="sm"
        className="text-blue-700 hover:text-blue-800 hover:bg-blue-50"
        onClick={() => navigate('/login')}
      >
        <User size={18} />
        <span className="mr-1 text-sm">כניסה</span>
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm"
          className="text-blue-700 hover:text-blue-800 hover:bg-blue-50"
        >
          <User size={18} />
          <span className="mr-1 text-sm">פרופיל</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-48 text-right bg-white">
        <DropdownMenuItem onClick={() => navigate('/settings')}>
          <Settings className="ml-2 h-4 w-4" />
          <span>הגדרות</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onLogout} className="text-red-600">
          <LogOut className="ml-2 h-4 w-4" />
          <span>יציאה</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default MobileProfileButton;