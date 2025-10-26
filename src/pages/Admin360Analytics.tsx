import { useState, useEffect } from 'react';
import { Users, DollarSign, BookOpen, Award, MessageSquare, TrendingUp } from 'lucide-react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

interface AnalyticsMetrics {
  total_subscriptions: number;
  free_subscriptions: number;
  premium_subscriptions: number;
  elite_subscriptions: number;
  total_revenue: number;
  total_wealth_modules: number;
  total_legacy_entries: number;
  approved_legacy_entries: number;
  total_history_entries: number;
  total_forum_posts: number;
  total_forum_replies: number;
}

const Admin360Analytics = () => {
  const [metrics, setMetrics] = useState<AnalyticsMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMetrics();
  }, []);

  const fetchMetrics = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/blk360/analytics/metrics`);
      setMetrics(response.data);
    } catch (error) {
      console.error('Error fetching metrics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading analytics...</div>;
  }

  if (!metrics) {
    return (
      <div className="text-center py-12 bg-white rounded-lg shadow">
        <p className="text-red-600">Failed to load analytics data</p>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Subscriptions',
      value: metrics.total_subscriptions,
      icon: Users,
      color: 'bg-blue-500',
      subtext: `Free: ${metrics.free_subscriptions} | Premium: ${metrics.premium_subscriptions} | Elite: ${metrics.elite_subscriptions}`
    },
    {
      title: 'Total Revenue',
      value: `$${metrics.total_revenue.toLocaleString()}`,
      icon: DollarSign,
      color: 'bg-green-500',
      subtext: 'Monthly recurring revenue'
    },
    {
      title: 'Wealth Modules',
      value: metrics.total_wealth_modules,
      icon: BookOpen,
      color: 'bg-purple-500',
      subtext: 'Learning resources available'
    },
    {
      title: 'Legacy Entries',
      value: metrics.total_legacy_entries,
      icon: Award,
      color: 'bg-yellow-500',
      subtext: `${metrics.approved_legacy_entries} approved`
    },
    {
      title: 'History Entries',
      value: metrics.total_history_entries,
      icon: TrendingUp,
      color: 'bg-indigo-500',
      subtext: 'Timeline events documented'
    },
    {
      title: 'Forum Activity',
      value: metrics.total_forum_posts,
      icon: MessageSquare,
      color: 'bg-pink-500',
      subtext: `${metrics.total_forum_replies} total replies`
    }
  ];

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">360 Analytics Dashboard</h2>
        <p className="text-gray-600">Real-time metrics for BlkXchange 360™ platform</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
              <h3 className="text-gray-600 text-sm font-medium mb-1">{stat.title}</h3>
              <p className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</p>
              <p className="text-sm text-gray-500">{stat.subtext}</p>
            </div>
          );
        })}
      </div>

      {/* Subscription Breakdown */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Subscription Breakdown</h3>
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Free Tier</span>
              <span className="text-sm font-bold text-gray-900">{metrics.free_subscriptions}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gray-500 h-2 rounded-full"
                style={{ width: `${(metrics.free_subscriptions / metrics.total_subscriptions) * 100}%` }}
              />
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Premium Tier</span>
              <span className="text-sm font-bold text-gray-900">{metrics.premium_subscriptions}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-emerald-500 h-2 rounded-full"
                style={{ width: `${(metrics.premium_subscriptions / metrics.total_subscriptions) * 100}%` }}
              />
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Elite Tier</span>
              <span className="text-sm font-bold text-gray-900">{metrics.elite_subscriptions}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-yellow-500 h-2 rounded-full"
                style={{ width: `${(metrics.elite_subscriptions / metrics.total_subscriptions) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Content Engagement */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Content Engagement</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Legacy Wall</h4>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-gray-900">{metrics.total_legacy_entries}</span>
              <span className="text-sm text-gray-500">
                {((metrics.approved_legacy_entries / metrics.total_legacy_entries) * 100).toFixed(1)}% approved
              </span>
            </div>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Community Forum</h4>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-gray-900">{metrics.total_forum_posts}</span>
              <span className="text-sm text-gray-500">
                {(metrics.total_forum_replies / metrics.total_forum_posts).toFixed(1)} replies/post
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin360Analytics;
