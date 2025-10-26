import { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { BookOpen, Award, History, MessageSquare, BarChart3, Crown } from 'lucide-react';

const Admin360 = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('wealth');

  useEffect(() => {
    const path = location.pathname.split('/').pop();
    if (path && ['wealth', 'legacy', 'history', 'forum', 'analytics'].includes(path)) {
      setActiveTab(path);
    }
  }, [location]);

  const tabs = [
    { id: 'wealth', label: 'Wealth Hub Management', icon: BookOpen, path: '/admin/360/wealth' },
    { id: 'legacy', label: 'Legacy Wall Moderation', icon: Award, path: '/admin/360/legacy' },
    { id: 'history', label: 'History Import', icon: History, path: '/admin/360/history' },
    { id: 'forum', label: 'Forum Moderation', icon: MessageSquare, path: '/admin/360/forum' },
    { id: 'analytics', label: '360 Analytics Dashboard', icon: BarChart3, path: '/admin/360/analytics' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-900 to-yellow-900 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-3">
            <Crown className="w-8 h-8 text-yellow-400" />
            <div>
              <h1 className="text-3xl font-bold">BlkXchange 360™ Manager</h1>
              <p className="text-emerald-200 text-sm">Manage premium content, moderation, and analytics</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <Link
                  key={tab.id}
                  to={tab.path}
                  className={`flex items-center gap-2 py-4 px-3 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                    isActive
                      ? 'border-emerald-600 text-emerald-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {tab.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </div>
    </div>
  );
};

export default Admin360;
