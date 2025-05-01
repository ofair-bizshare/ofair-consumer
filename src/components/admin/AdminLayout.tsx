
import React, { ReactNode } from 'react';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';
import AdminStorageInitializer from './AdminStorageInitializer';

interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  return (
    <div className="flex h-screen overflow-hidden bg-gray-100">
      <AdminSidebar />
      <div className="flex-1 overflow-y-auto">
        <AdminHeader />
        <main className="p-6">
          <AdminStorageInitializer />
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
