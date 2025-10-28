import { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Home, Users, Briefcase, ShoppingBag, Megaphone, Clock,
  Globe, Settings, LogOut, Menu, X, Search, Bell, Plus,
  ChevronDown, ChevronRight, Crown, DollarSign, Sparkles,
  Calendar, Building2, Heart, Award, BookOpen, History,
  MessageSquare, BarChart3, Shield, TrendingUp, FileText
} from 'lucide-react';
import { isAdminAuthenticated } from '@/utils/auth';

interface MenuItem {
  path: string;
  icon: any;
  label: string;
  exact?: boolean;
}

interface MenuSection {
  title: string;
  icon: any;
  items: MenuItem[];
}

export default function AdminConsole() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [expandedSections, setExpandedSections] = useState<string[]>([
    'Marketplace Management',
    'Community Ecosystem',
  ]);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const authenticated = isAdminAuthenticated();
    if (!authenticated) {
      navigate('/admin/login');
    } else {
      setLoading(false);
    }
  }, [navigate]);

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C5A14E] mx-auto mb-4"></div>
          <p className="text-white">Loading...</p>
        </div>
      </div>
    );
  }

  const menuSections: MenuSection[] = [
    {
      title: 'Marketplace Management',
      icon: ShoppingBag,
      items: [
        { path: '/admin360', icon: Home, label: 'Overview', exact: true },
        { path: '/admin360/vendors', icon: Users, label: 'Vendors' },
        { path: '/admin360/products', icon: ShoppingBag, label: 'Products' },
        { path: '/admin360/professionals', icon: Briefcase, label: 'Professionals' },
        { path: '/admin360/pending', icon: Clock, label: 'Pending Submissions' },
      ],
    },
    {
      title: 'Monetization & AI',
      icon: DollarSign,
      items: [
        { path: '/admin360/subscriptions', icon: Crown, label: 'Subscriptions' },
        { path: '/admin360/affiliate', icon: Users, label: 'Affiliate Program' },
        { path: '/admin360/ai-content', icon: Sparkles, label: 'AI Content' },
        { path: '/admin360/ads', icon: Megaphone, label: 'Ads' },
      ],
    },
    {
      title: 'Community Ecosystem',
      icon: Globe,
      items: [
        { path: '/admin360/community', icon: Globe, label: 'Community & Events' },
        { path: '/admin360/events', icon: Calendar, label: 'Events' },
        { path: '/admin360/partners', icon: Building2, label: 'Partners' },
        { path: '/admin360/nonprofits', icon: Heart, label: 'Nonprofits' },
        { path: '/admin360/volunteers', icon: Users, label: 'Volunteers' },
        { path: '/admin360/donations', icon: Heart, label: 'Donations' },
        { path: '/admin360/scholarships', icon: Award, label: 'Scholarships' },
        { path: '/admin360/blkcoin', icon: Award, label: 'BlkCoin' },
      ],
    },
    {
      title: 'Legacy & Culture',
      icon: BookOpen,
      items: [
        { path: '/admin360/wealth', icon: BookOpen, label: 'Wealth Hub' },
        { path: '/admin360/legacy', icon: Award, label: 'Legacy Wall' },
        { path: '/admin360/history', icon: History, label: 'History Window' },
        { path: '/admin360/forum', icon: MessageSquare, label: 'Forum' },
      ],
    },
    {
      title: 'Analytics & Impact',
      icon: BarChart3,
      items: [
        { path: '/admin360/analytics', icon: BarChart3, label: '360 Analytics' },
        { path: '/admin360/impact', icon: TrendingUp, label: 'Impact Dashboard' },
        { path: '/admin360/reports', icon: FileText, label: 'Reports Export' },
      ],
    },
    {
      title: 'Settings & Security',
      icon: Settings,
      items: [
        { path: '/admin360/settings', icon: Settings, label: 'Settings' },
        { path: '/admin360/roles', icon: Shield, label: 'User Roles' },
        { path: '/admin360/security', icon: Shield, label: '2FA & Security' },
        { path: '/admin360/system', icon: Settings, label: 'System Health' },
      ],
    },
  ];

  const toggleSection = (title: string) => {
    setExpandedSections((prev) =>
      prev.includes(title) ? prev.filter((s) => s !== title) : [...prev, title]
    );
  };

  const isActive = (path: string, exact?: boolean) => {
    if (exact) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin/login');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Searching for:', searchQuery);
  };

  return (
    <div className="flex h-screen bg-gray-50 text-gray-900">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-gradient-to-b from-emerald-900 to-gray-900 text-white transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 overflow-y-auto`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/10">
            <Link to="/" className="flex items-center gap-2">
              <Crown className="w-8 h-8 text-yellow-400" />
              <div>
                <h1 className="text-xl font-heading font-bold text-yellow-400">
                  BlkXchange™
                </h1>
                <p className="text-xs text-emerald-200">Admin Console</p>
              </div>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-white hover:text-yellow-400"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-6 px-3">
            <div className="space-y-2">
              {menuSections.map((section) => {
                const SectionIcon = section.icon;
                const isExpanded = expandedSections.includes(section.title);
                return (
                  <div key={section.title}>
                    <button
                      onClick={() => toggleSection(section.title)}
                      className="flex items-center justify-between w-full px-4 py-3 rounded-lg text-white/80 hover:bg-white/10 hover:text-yellow-400 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <SectionIcon className="w-5 h-5" />
                        <span className="font-semibold text-sm">{section.title}</span>
                      </div>
                      {isExpanded ? (
                        <ChevronDown className="w-4 h-4" />
                      ) : (
                        <ChevronRight className="w-4 h-4" />
                      )}
                    </button>
                    {isExpanded && (
                      <div className="ml-4 mt-1 space-y-1">
                        {section.items.map((item) => {
                          const Icon = item.icon;
                          const active = isActive(item.path, item.exact);
                          return (
                            <Link
                              key={item.path}
                              to={item.path}
                              className={`flex items-center gap-3 px-4 py-2 rounded-lg text-sm transition-colors ${
                                active
                                  ? 'bg-emerald-600 text-white'
                                  : 'text-white/70 hover:bg-white/10 hover:text-yellow-400'
                              }`}
                            >
                              <Icon className="w-4 h-4" />
                              <span>{item.label}</span>
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-white/10">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-white/80 hover:bg-white/10 hover:text-yellow-400 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${sidebarOpen ? 'lg:ml-72' : ''}`}>
        {/* Header */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden text-gray-600 hover:text-emerald-600"
              >
                <Menu className="w-6 h-6" />
              </button>
              <h1 className="text-2xl font-bold text-gray-900">Admin Console</h1>
            </div>

            <div className="flex items-center gap-4">
              {/* Search */}
              <form onSubmit={handleSearch} className="hidden md:block">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search vendors, products, events..."
                    className="pl-10 pr-4 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:border-emerald-600 w-80"
                  />
                </div>
              </form>

              {/* Quick Actions */}
              <div className="flex items-center gap-2">
                <button
                  className="p-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors"
                  title="Quick Add"
                >
                  <Plus className="w-5 h-5" />
                </button>
                <button
                  className="p-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors relative"
                  title="Notifications"
                >
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>
              </div>

              {/* User Info */}
              <div className="text-right">
                <p className="text-sm text-gray-600">Welcome,</p>
                <p className="text-sm font-semibold text-emerald-600">Dr. Aldric Marshall</p>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
