import { useState, useEffect } from 'react';
import { 
  Users, Briefcase, ShoppingBag, DollarSign, TrendingUp, 
  Clock, CheckCircle, XCircle, AlertCircle, Crown, ArrowRight, RefreshCw 
} from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  PieChart, Pie, Cell, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

interface MetricsData {
  vendors: {
    total: number;
    approved: number;
    pending: number;
    rejected: number;
  };
  professionals: {
    total: number;
    approved: number;
    pending: number;
    rejected: number;
  };
  products: {
    total: number;
    approved: number;
    pending: number;
    rejected: number;
  };
  revenue: {
    total: number;
    thisMonth: number;
    lastMonth: number;
    growth: number;
  };
  impact: {
    totalDonated: number;
    hbcuFunds: number;
    startupInvestments: number;
  };
  recentActivity: Array<{
    id: string;
    type: string;
    description: string;
    timestamp: string;
  }>;
}

export default function AdminOverview() {
  const [metrics, setMetrics] = useState<MetricsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMetrics();
  }, []);

  const fetchMetrics = async () => {
    try {
      const token = localStorage.getItem('admin_token') || sessionStorage.getItem('admin_token');
      const response = await fetch('https://app-tcqwzext.fly.dev/api/admin/metrics', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setMetrics(data);
      }
    } catch (error) {
      console.error('Error fetching metrics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C5A14E] mx-auto mb-4"></div>
          <p className="text-white/60">Loading metrics...</p>
        </div>
      </div>
    );
  }

  if (!metrics) {
    return (
      <div className="text-center text-white/60">
        <p>Unable to load metrics. Please try again.</p>
      </div>
    );
  }

  const StatCard = ({ 
    icon: Icon, 
    title, 
    value, 
    subtitle, 
    color = 'emerald' 
  }: { 
    icon: any; 
    title: string; 
    value: string | number; 
    subtitle?: string; 
    color?: 'emerald' | 'gold' | 'blue' | 'red'; 
  }) => {
    const colorClasses = {
      emerald: 'bg-[#00A86B]/20 text-[#00A86B]',
      gold: 'bg-[#C5A14E]/20 text-[#C5A14E]',
      blue: 'bg-blue-500/20 text-blue-400',
      red: 'bg-red-500/20 text-red-400',
    };

    return (
      <div className="bg-[#1A1A1A] border border-white/10 rounded-xl p-6 hover:border-[#C5A14E]/50 transition-colors">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-white/60 text-sm mb-1">{title}</p>
            <p className="text-3xl font-bold text-white mb-1">{value}</p>
            {subtitle && <p className="text-sm text-white/50">{subtitle}</p>}
          </div>
          <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
            <Icon className="w-6 h-6" />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[#C5A14E] mb-2">Admin Overview</h2>
          <p className="text-white/60">Welcome to the BlkXchange™ Admin Portal</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={fetchMetrics}
            className="flex items-center gap-2 bg-[#1A1A1A] border border-white/10 text-white px-4 py-3 rounded-lg font-semibold hover:border-[#C5A14E]/50 transition-all"
          >
            <RefreshCw className="w-5 h-5" />
            Refresh Metrics
          </button>
          <Link
            to="/admin/360"
            className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-yellow-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
          >
            <Crown className="w-5 h-5" />
            Go to BlkXchange 360 Manager
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={Users}
          title="Total Vendors"
          value={metrics.vendors.total}
          subtitle={`${metrics.vendors.pending} pending approval`}
          color="emerald"
        />
        <StatCard
          icon={Briefcase}
          title="Total Professionals"
          value={metrics.professionals.total}
          subtitle={`${metrics.professionals.pending} pending approval`}
          color="gold"
        />
        <StatCard
          icon={ShoppingBag}
          title="Total Products"
          value={metrics.products.total}
          subtitle={`${metrics.products.pending} pending approval`}
          color="blue"
        />
        <StatCard
          icon={DollarSign}
          title="Revenue (This Month)"
          value={`$${metrics.revenue.thisMonth.toLocaleString()}`}
          subtitle={`${metrics.revenue.growth > 0 ? '+' : ''}${metrics.revenue.growth}% vs last month`}
          color="emerald"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-[#1A1A1A] border border-white/10 rounded-xl p-6">
          <h3 className="text-lg font-bold text-[#C5A14E] mb-4 flex items-center">
            <Users className="w-5 h-5 mr-2" />
            Vendor Status
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 text-[#00A86B] mr-2" />
                <span className="text-white/80">Approved</span>
              </div>
              <span className="font-semibold text-white">{metrics.vendors.approved}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Clock className="w-4 h-4 text-[#C5A14E] mr-2" />
                <span className="text-white/80">Pending</span>
              </div>
              <span className="font-semibold text-white">{metrics.vendors.pending}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <XCircle className="w-4 h-4 text-red-400 mr-2" />
                <span className="text-white/80">Rejected</span>
              </div>
              <span className="font-semibold text-white">{metrics.vendors.rejected}</span>
            </div>
          </div>
        </div>

        <div className="bg-[#1A1A1A] border border-white/10 rounded-xl p-6">
          <h3 className="text-lg font-bold text-[#C5A14E] mb-4 flex items-center">
            <Briefcase className="w-5 h-5 mr-2" />
            Professional Status
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 text-[#00A86B] mr-2" />
                <span className="text-white/80">Approved</span>
              </div>
              <span className="font-semibold text-white">{metrics.professionals.approved}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Clock className="w-4 h-4 text-[#C5A14E] mr-2" />
                <span className="text-white/80">Pending</span>
              </div>
              <span className="font-semibold text-white">{metrics.professionals.pending}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <XCircle className="w-4 h-4 text-red-400 mr-2" />
                <span className="text-white/80">Rejected</span>
              </div>
              <span className="font-semibold text-white">{metrics.professionals.rejected}</span>
            </div>
          </div>
        </div>

        <div className="bg-[#1A1A1A] border border-white/10 rounded-xl p-6">
          <h3 className="text-lg font-bold text-[#C5A14E] mb-4 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2" />
            Community Impact
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-white/80">Total Donated</span>
              <span className="font-semibold text-white">${metrics.impact.totalDonated.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-white/80">HBCU Funds</span>
              <span className="font-semibold text-white">${metrics.impact.hbcuFunds.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-white/80">Startup Investments</span>
              <span className="font-semibold text-white">${metrics.impact.startupInvestments.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#1A1A1A] border border-white/10 rounded-xl p-6">
        <h3 className="text-lg font-bold text-[#C5A14E] mb-4 flex items-center">
          <AlertCircle className="w-5 h-5 mr-2" />
          Recent Activity
        </h3>
        <div className="space-y-3">
          {metrics.recentActivity.length > 0 ? (
            metrics.recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start justify-between py-3 border-b border-white/5 last:border-0">
                <div>
                  <p className="text-white/80">{activity.description}</p>
                  <p className="text-sm text-white/50 mt-1">{new Date(activity.timestamp).toLocaleString()}</p>
                </div>
                <span className="text-xs bg-[#00A86B]/20 text-[#00A86B] px-2 py-1 rounded">
                  {activity.type}
                </span>
              </div>
            ))
          ) : (
            <p className="text-white/50 text-center py-4">No recent activity</p>
          )}
        </div>
      </div>

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Vendor Status Distribution Pie Chart */}
        <div className="bg-[#1A1A1A] border border-white/10 rounded-xl p-6">
          <h3 className="text-lg font-bold text-[#C5A14E] mb-4">Vendor Status Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={[
                  { name: 'Approved', value: metrics.vendors.approved },
                  { name: 'Pending', value: metrics.vendors.pending },
                  { name: 'Rejected', value: metrics.vendors.rejected },
                ]}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                <Cell fill="#00A86B" />
                <Cell fill="#C5A14E" />
                <Cell fill="#EF4444" />
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1A1A1A', 
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '8px',
                  color: '#fff'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Product Status Distribution Pie Chart */}
        <div className="bg-[#1A1A1A] border border-white/10 rounded-xl p-6">
          <h3 className="text-lg font-bold text-[#C5A14E] mb-4">Product Status Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={[
                  { name: 'Approved', value: metrics.products.approved },
                  { name: 'Pending', value: metrics.products.pending },
                  { name: 'Rejected', value: metrics.products.rejected },
                ]}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                <Cell fill="#00A86B" />
                <Cell fill="#C5A14E" />
                <Cell fill="#EF4444" />
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1A1A1A', 
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '8px',
                  color: '#fff'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Revenue Trend Bar Chart */}
      <div className="bg-[#1A1A1A] border border-white/10 rounded-xl p-6">
        <h3 className="text-lg font-bold text-[#C5A14E] mb-4">Revenue Comparison</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={[
              { name: 'Last Month', revenue: metrics.revenue.lastMonth },
              { name: 'This Month', revenue: metrics.revenue.thisMonth },
            ]}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis dataKey="name" stroke="#fff" />
            <YAxis stroke="#fff" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#1A1A1A', 
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '8px',
                color: '#fff'
              }}
            />
            <Bar dataKey="revenue" fill="#00A86B" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Community Impact Bar Chart */}
      <div className="bg-[#1A1A1A] border border-white/10 rounded-xl p-6">
        <h3 className="text-lg font-bold text-[#C5A14E] mb-4">Community Impact Breakdown</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={[
              { name: 'HBCU Funds', amount: metrics.impact.hbcuFunds },
              { name: 'Startup Investments', amount: metrics.impact.startupInvestments },
            ]}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis dataKey="name" stroke="#fff" />
            <YAxis stroke="#fff" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#1A1A1A', 
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '8px',
                color: '#fff'
              }}
            />
            <Bar dataKey="amount" fill="#C5A14E" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
