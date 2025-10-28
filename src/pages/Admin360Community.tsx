import React, { useState, useEffect } from 'react';
import { Calendar, Users, Building2, Heart, TrendingUp, Award } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const Admin360Community: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [metrics, setMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [adminPassword, setAdminPassword] = useState('');
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      fetchMetrics();
    }
  }, [isAuthenticated]);

  const handlePasswordSubmit = () => {
    if (adminPassword === 'changeme') {
      setIsAuthenticated(true);
      setShowPasswordPrompt(false);
    } else {
      alert('Incorrect password');
    }
  };

  const fetchMetrics = async () => {
    try {
      const response = await fetch(`${API_URL}/api/impact/metrics/v3`);
      const data = await response.json();
      setMetrics(data.metrics);
    } catch (error) {
      console.error('Error fetching metrics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (showPasswordPrompt) {
    return (
      <div className="min-h-screen bg-[#1A1A1A] flex items-center justify-center p-4">
        <div className="bg-[#2A2A2A] p-8 rounded-xl max-w-md w-full border border-[#C5A14E]">
          <h2 className="text-2xl font-bold text-[#C5A14E] mb-4">Admin Access Required</h2>
          <input
            type="password"
            value={adminPassword}
            onChange={(e) => setAdminPassword(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handlePasswordSubmit()}
            placeholder="Enter admin password"
            className="w-full px-4 py-2 bg-[#1A1A1A] text-white rounded-lg border border-[#3A3A3A] mb-4"
          />
          <button
            onClick={handlePasswordSubmit}
            className="w-full bg-[#C5A14E] text-black font-bold py-2 rounded-lg hover:bg-[#D4B15F]"
          >
            Access Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Community & Events Management
        </h2>
        <p className="text-gray-600">
          Manage events, partners, nonprofits, volunteers, and community impact
        </p>
      </div>

      <div className="flex gap-4 mb-8 overflow-x-auto border-b border-gray-200">
        {['overview', 'events', 'partners', 'nonprofits', 'volunteers', 'donations'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-3 font-semibold whitespace-nowrap transition-all border-b-2 ${
              activeTab === tab
                ? 'border-emerald-600 text-emerald-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#C5A14E]"></div>
          </div>
        ) : activeTab === 'overview' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-[#C5A14E] to-[#D4B15F] p-6 rounded-xl">
              <Calendar className="w-12 h-12 text-black mb-4" />
              <h3 className="text-2xl font-bold text-black mb-2">
                {metrics?.events?.total_events || 0}
              </h3>
              <p className="text-black/80">Total Events</p>
              <p className="text-sm text-black/60 mt-2">
                {metrics?.events?.upcoming_events || 0} upcoming
              </p>
            </div>

            <div className="bg-gradient-to-br from-emerald-600 to-emerald-700 p-6 rounded-xl">
              <Building2 className="w-12 h-12 text-white mb-4" />
              <h3 className="text-2xl font-bold text-white mb-2">
                {metrics?.partners?.active_partners || 0}
              </h3>
              <p className="text-white/80">Active Partners</p>
              <p className="text-sm text-white/60 mt-2">
                {metrics?.partners?.pending_partners || 0} pending
              </p>
            </div>

            <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-6 rounded-xl">
              <Heart className="w-12 h-12 text-white mb-4" />
              <h3 className="text-2xl font-bold text-white mb-2">
                {metrics?.nonprofits?.active_nonprofits || 0}
              </h3>
              <p className="text-white/80">Active Nonprofits</p>
              <p className="text-sm text-white/60 mt-2">
                {metrics?.nonprofits?.pending_nonprofits || 0} pending
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-600 to-purple-700 p-6 rounded-xl">
              <Users className="w-12 h-12 text-white mb-4" />
              <h3 className="text-2xl font-bold text-white mb-2">
                {metrics?.volunteers?.total_volunteers || 0}
              </h3>
              <p className="text-white/80">Total Volunteers</p>
              <p className="text-sm text-white/60 mt-2">
                {metrics?.volunteers?.total_hours || 0} hours logged
              </p>
            </div>

            <div className="bg-gradient-to-br from-pink-600 to-pink-700 p-6 rounded-xl">
              <TrendingUp className="w-12 h-12 text-white mb-4" />
              <h3 className="text-2xl font-bold text-white mb-2">
                ${(metrics?.donations?.total_amount || 0).toFixed(2)}
              </h3>
              <p className="text-white/80">Total Donations</p>
              <p className="text-sm text-white/60 mt-2">
                {metrics?.donations?.total_count || 0} donations
              </p>
            </div>

            <div className="bg-gradient-to-br from-orange-600 to-orange-700 p-6 rounded-xl">
              <Award className="w-12 h-12 text-white mb-4" />
              <h3 className="text-2xl font-bold text-white mb-2">
                {metrics?.blkcoin?.total_circulating || 0}
              </h3>
              <p className="text-white/80">BlkCoins Circulating</p>
              <p className="text-sm text-white/60 mt-2">
                {metrics?.blkcoin?.active_wallets || 0} active wallets
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-gray-50 p-8 rounded-xl text-center border border-gray-200">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Management
            </h3>
            <p className="text-gray-600 mb-6">
              Use the dedicated admin pages to manage {activeTab}
            </p>
            <div className="flex gap-4 justify-center">
              {activeTab === 'events' && (
                <a
                  href="/admin360/events"
                  className="bg-emerald-600 text-white font-bold px-6 py-3 rounded-lg hover:bg-emerald-700"
                >
                  Manage Events
                </a>
              )}
              {activeTab === 'partners' && (
                <a
                  href="/admin360/partners"
                  className="bg-emerald-600 text-white font-bold px-6 py-3 rounded-lg hover:bg-emerald-700"
                >
                  Manage Partners
                </a>
              )}
              {activeTab === 'nonprofits' && (
                <a
                  href="/admin360/nonprofits"
                  className="bg-emerald-600 text-white font-bold px-6 py-3 rounded-lg hover:bg-emerald-700"
                >
                  Manage Nonprofits
                </a>
              )}
            </div>
          </div>
        )}
    </div>
  );
};

export default Admin360Community;
