import { Link, useLocation } from 'react-router-dom';
import { Store, Users, Package, Megaphone, LogOut } from 'lucide-react';
import { clearAdminAuth } from '@/utils/auth';

export function AdminTopNav() {
  const location = useLocation();
  
  const navItems = [
    { name: 'Vendors', path: '/admin/vendors', icon: Store },
    { name: 'Professionals', path: '/admin/pending-professionals', icon: Users },
    { name: 'Products', path: '/admin/products', icon: Package },
    { name: 'Ads', path: '/admin/ads', icon: Megaphone },
  ];

  const handleLogout = () => {
    if (confirm('Are you sure you want to logout?')) {
      clearAdminAuth();
      window.location.href = '/admin/login';
    }
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-[#013220] border-b border-[#C5A14E]/20 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Logo and Nav Items */}
          <div className="flex items-center space-x-8">
            <div className="flex-shrink-0">
              <h1 className="text-xl font-bold text-[#C5A14E]">BlkXchange™ Admin</h1>
            </div>
            
            <div className="hidden md:flex space-x-4">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive(item.path)
                        ? 'bg-[#C5A14E] text-black'
                        : 'text-white hover:bg-[#C5A14E]/20 hover:text-[#C5A14E]'
                    }`}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Right: User Info and Logout */}
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-white text-sm">
                Welcome, Dr. Aldric Marshall
              </span>
            </div>
            
            <button
              onClick={handleLogout}
              className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-white hover:bg-red-500/20 hover:text-red-400 transition-colors border border-red-500/30"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className="md:hidden px-4 pb-3 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive(item.path)
                  ? 'bg-[#C5A14E] text-black'
                  : 'text-white hover:bg-[#C5A14E]/20 hover:text-[#C5A14E]'
              }`}
            >
              <Icon className="w-4 h-4 mr-2" />
              {item.name}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
