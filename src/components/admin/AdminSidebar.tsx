
import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  MessageSquare, 
  Settings,
  LogOut
} from 'lucide-react';
import AdminNavLink from './AdminNavLink';

interface AdminSidebarProps {
  onSignOut: () => void;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ onSignOut }) => {
  return (
    <aside className="w-64 bg-white dark:bg-gray-800 shadow-md">
      <div className="p-4 border-b dark:border-gray-700">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">ניהול מערכת</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">ממשק סופר אדמין</p>
      </div>
      
      <nav className="p-4">
        <ul className="space-y-2">
          <AdminNavLink to="/admin" icon={<LayoutDashboard size={20} />} text="דשבורד" exact />
          <AdminNavLink to="/admin/professionals" icon={<Users size={20} />} text="בעלי מקצוע" />
          <AdminNavLink to="/admin/articles" icon={<FileText size={20} />} text="מאמרים" />
          <AdminNavLink to="/admin/messages" icon={<MessageSquare size={20} />} text="הודעות" />
          <AdminNavLink to="/admin/settings" icon={<Settings size={20} />} text="הגדרות" />
        </ul>
      </nav>
      
      <div className="absolute bottom-0 w-64 p-4 border-t dark:border-gray-700">
        <button 
          onClick={onSignOut}
          className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700 rounded-md"
        >
          <LogOut size={20} className="ml-2" />
          <span>התנתק</span>
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
