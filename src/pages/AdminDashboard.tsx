import { useState, useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { 
  Home, Users, Briefcase, ShoppingBag, Megaphone, Clock, 
  Globe, Settings, LogOut, Menu, X, Search, Plus, Download,
  CheckCircle, Crown, BookOpen, Award, History, MessageSquare, BarChart3
} from 'lucide-react';
import { isAdminAuthenticated } from '@/utils/auth';

interface AdminDashboardProps {
  onLogout?: () => void;
}

export default function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
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

  const menuItems = [
    { path: '/admin', icon: Home, label: 'Overview', exact: true },
    { path: '/admin/vendors', icon: Users, label: 'Vendors' },
    { path: '/admin/professionals', icon: Briefcase, label: 'Professionals' },
    { path: '/admin/products', icon: ShoppingBag, label: 'Products' },
    { path: '/admin/ads', icon: Megaphone, label: 'Ads' },
    { path: '/admin/pending', icon: Clock, label: 'Pending Submissions' },
    { path: '/admin/community', icon: Globe, label: 'Community & Events' },
    { path: '/admin/settings', icon: Settings, label: 'Settings' },
  ];

  const blkXchange360Items = [
    { path: '/admin/360/wealth', icon: BookOpen, label: 'Wealth Hub Management' },
    { path: '/admin/360/legacy', icon: Award, label: 'Legacy Wall Moderation' },
    { path: '/admin/360/history', icon: History, label: 'History Import' },
    { path: '/admin/360/forum', icon: MessageSquare, label: 'Forum Moderation' },
    { path: '/admin/360/analytics', icon: BarChart3, label: '360 Analytics Dashboard' },
  ];

  const isActive = (path: string, exact?: boolean) => {
    if (exact) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    if (onLogout) {
      onLogout();
    }
    navigate('/admin/login');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Searching for:', searchQuery);
  };

  return (
    <div className="flex h-screen bg-[#111111] text-white">
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-gradient-to-b from-[#00A86B] to-[#000000] transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-6 border-b border-white/10">
            <Link to="/" className="text-2xl font-heading font-bold text-[#C5A14E]">
              BlkXchange™
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-white hover:text-[#C5A14E]"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto py-6">
            <div className="space-y-1 px-3">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path, item.exact);
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                      active
                        ? 'bg-[#00A86B] text-white'
                        : 'text-white/80 hover:bg-white/10 hover:text-[#C5A14E]'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                );
              })}

              {/* BlkXchange 360 Manager Section */}
              <div className="mt-6 pt-6 border-t border-white/10">
                <div className="flex items-center space-x-2 px-4 mb-3">
                  <Crown className="w-5 h-5 text-[#C5A14E]" />
                  <h3 className="text-sm font-bold text-[#C5A14E] uppercase tracking-wider">
                    BlkXchange 360™ Manager
                  </h3>
                </div>
                {blkXchange360Items.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.path);
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                        active
                          ? 'bg-[#00A86B] text-white'
                          : 'text-white/80 hover:bg-white/10 hover:text-[#C5A14E]'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium text-sm">{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </nav>

          <div className="p-4 border-t border-white/10">
            <button
              onClick={handleLogout}
              className="flex items-center space-x-3 w-full px-4 py-3 rounded-lg text-white/80 hover:bg-white/10 hover:text-[#C5A14E] transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </aside>

      <div className={`flex-1 flex flex-col transition-all duration-300 ${sidebarOpen ? 'lg:ml-64' : ''}`}>
        <header className="bg-[#000000] border-b border-[#C5A14E]/20 sticky top-0 z-40">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden text-white hover:text-[#C5A14E]"
              >
                <Menu className="w-6 h-6" />
              </button>
              <h1 className="text-xl font-bold text-[#C5A14E]">Admin Portal</h1>
            </div>

            <div className="flex items-center space-x-4">
              <form onSubmit={handleSearch} className="hidden md:block">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/50" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search vendors, products, professionals..."
                    className="pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-[#C5A14E] w-80"
                  />
                </div>
              </form>

              <div className="flex items-center space-x-2">
                <button
                  className="p-2 bg-[#00A86B] hover:bg-[#00A86B]/80 rounded-lg transition-colors"
                  title="Add Vendor"
                >
                  <Plus className="w-5 h-5" />
                </button>
                <button
                  className="p-2 bg-[#00A86B] hover:bg-[#00A86B]/80 rounded-lg transition-colors"
                  title="Approve All Pending"
                >
                  <CheckCircle className="w-5 h-5" />
                </button>
                <button
                  className="p-2 bg-[#00A86B] hover:bg-[#00A86B]/80 rounded-lg transition-colors"
                  title="Export Data"
                >
                  <Download className="w-5 h-5" />
                </button>
              </div>

              <div className="text-right">
                <p className="text-sm text-white/80">Welcome,</p>
                <p className="text-sm font-semibold text-[#C5A14E]">Dr. Aldric Marshall</p>
              </div>
            </div>
          </div>

          <div className="md:hidden px-6 pb-4">
            <form onSubmit={handleSearch}>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/50" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search..."
                  className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-[#C5A14E]"
                />
              </div>
            </form>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
