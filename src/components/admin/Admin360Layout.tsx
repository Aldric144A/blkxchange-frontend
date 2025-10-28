import { ReactNode } from 'react';
import AdminSidebar from './AdminSidebar';
import GlobalSearch from './GlobalSearch';
import NotificationCenter from './NotificationCenter';

interface Admin360LayoutProps {
  children: ReactNode;
  userRole?: string;
}

export default function Admin360Layout({ children, userRole = 'SuperAdmin' }: Admin360LayoutProps) {
  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSidebar userRole={userRole} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 flex-1">
              <h1 className="text-2xl font-bold text-gray-900">BlkXchange™ Admin Console</h1>
            </div>
            
            <div className="flex items-center gap-4">
              <GlobalSearch />
              <NotificationCenter />
              
              <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900">Admin User</div>
                  <div className="text-xs text-gray-500">{userRole}</div>
                </div>
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-full flex items-center justify-center text-white font-bold">
                  A
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
