import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Package,
  Heart,
  Calendar,
  DollarSign,
  Handshake,
  UserCheck,
  GraduationCap,
  ChevronLeft,
  ChevronRight,
  Settings,
  LogOut
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  roles?: string[];
}

const navItems: NavItem[] = [
  { title: 'Dashboard', href: '/admin360', icon: LayoutDashboard },
  { title: 'Vendors', href: '/admin360/vendors', icon: Users },
  { title: 'Products', href: '/admin360/products', icon: Package },
  { title: 'Community', href: '/admin360/community', icon: Heart, roles: ['SuperAdmin', 'Moderator'] },
  { title: 'Events', href: '/admin360/events', icon: Calendar, roles: ['SuperAdmin', 'Moderator'] },
  { title: 'Donations', href: '/admin360/donations', icon: DollarSign, roles: ['SuperAdmin', 'FinanceAdmin'] },
  { title: 'Partners', href: '/admin360/partners', icon: Handshake, roles: ['SuperAdmin', 'PartnerAdmin'] },
  { title: 'Volunteers', href: '/admin360/volunteers', icon: UserCheck, roles: ['SuperAdmin', 'PartnerAdmin'] },
  { title: 'Scholarships', href: '/admin360/scholarships', icon: GraduationCap, roles: ['SuperAdmin', 'FinanceAdmin'] },
];

interface AdminSidebarProps {
  userRole?: string;
}

export default function AdminSidebar({ userRole = 'SuperAdmin' }: AdminSidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const filteredNavItems = navItems.filter(item => {
    if (!item.roles) return true;
    return item.roles.includes(userRole);
  });

  return (
    <div
      className={cn(
        'bg-gradient-to-b from-emerald-900 to-emerald-950 text-white h-screen sticky top-0 transition-all duration-300 flex flex-col',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Header */}
      <div className="p-4 border-b border-emerald-800 flex items-center justify-between">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-lg flex items-center justify-center font-bold text-emerald-950">
              B
            </div>
            <span className="font-bold text-lg">Admin360</span>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1 hover:bg-emerald-800 rounded transition-colors"
        >
          {collapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4">
        {filteredNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.href;

          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                'flex items-center gap-3 px-4 py-3 transition-colors relative',
                isActive
                  ? 'bg-emerald-800 text-yellow-400 font-semibold'
                  : 'text-emerald-100 hover:bg-emerald-800/50 hover:text-white'
              )}
              title={collapsed ? item.title : undefined}
            >
              {isActive && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-yellow-400" />
              )}
              <Icon className={cn('flex-shrink-0', isActive ? 'text-yellow-400' : '')} />
              {!collapsed && <span>{item.title}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-emerald-800 p-4">
        <Link
          to="/admin360/settings"
          className={cn(
            'flex items-center gap-3 px-4 py-3 text-emerald-100 hover:bg-emerald-800/50 hover:text-white transition-colors rounded',
            collapsed && 'justify-center'
          )}
          title={collapsed ? 'Settings' : undefined}
        >
          <Settings className="h-5 w-5" />
          {!collapsed && <span>Settings</span>}
        </Link>
        <button
          className={cn(
            'flex items-center gap-3 px-4 py-3 text-emerald-100 hover:bg-emerald-800/50 hover:text-white transition-colors rounded w-full',
            collapsed && 'justify-center'
          )}
          title={collapsed ? 'Logout' : undefined}
        >
          <LogOut className="h-5 w-5" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </div>
  );
}
