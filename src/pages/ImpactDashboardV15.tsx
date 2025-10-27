import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  TrendingUp,
  Users,
  DollarSign,
  ShoppingBag,
  Download,
  Calendar,
  BarChart3,
  PieChart
} from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'https://app-tcqwzext.fly.dev';

interface ImpactMetrics {
  subscriptions: {
    total: number;
    premium: number;
    elite: number;
    revenue: number;
  };
  vendors: {
    total: number;
    active: number;
    pending: number;
  };
  products: {
    total: number;
    approved: number;
    pending: number;
  };
  mentorship: {
    total_matches: number;
    pending: number;
    approved: number;
  };
  ai_content: {
    total_generated: number;
    pending: number;
    approved: number;
  };
  community_fund: {
    total_contributed: number;
    hbcu_allocated: number;
    scholarships_allocated: number;
  };
  date_range: {
    start: string;
    end: string;
  };
}

export default function ImpactDashboardV15() {
  const [metrics, setMetrics] = useState<ImpactMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState({
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    loadMetrics();
  }, [dateRange]);

  const loadMetrics = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${API_URL}/api/impact/metrics?start_date=${dateRange.start}&end_date=${dateRange.end}`
      );
      const data = await response.json();

      if (data.success) {
        setMetrics(data.metrics);
      } else {
        setError('Failed to load metrics');
      }
    } catch (err) {
      setError('Failed to load metrics. Please try again.');
      console.error('Metrics error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async (format: 'csv' | 'pdf') => {
    try {
      const adminSecret = prompt('Enter admin password to export metrics:');
      if (!adminSecret) return;

      const response = await fetch(
        `${API_URL}/api/impact/export?format=${format}&start_date=${dateRange.start}&end_date=${dateRange.end}`,
        {
          headers: {
            'X-Admin-Secret': adminSecret
          }
        }
      );

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `blkxchange-impact-metrics-${dateRange.start}-to-${dateRange.end}.${format}`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        alert('Failed to export metrics. Check admin password.');
      }
    } catch (err) {
      console.error('Export error:', err);
      alert('Failed to export metrics');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-ivory py-12 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-gold mx-auto mb-4"></div>
          <p className="text-gray-600">Loading impact metrics...</p>
        </div>
      </div>
    );
  }

  if (error || !metrics) {
    return (
      <div className="min-h-screen bg-brand-ivory py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded">
            <p className="text-red-700">{error || 'Failed to load metrics'}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-ivory py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-heading font-bold text-brand-black mb-2">
            Impact Dashboard V1.5
          </h1>
          <p className="text-xl text-gray-700">
            Platform analytics and community impact metrics
          </p>
        </div>

        {/* Date Range Selector */}
        <Card className="border-2 border-gray-300 mb-8">
          <CardContent className="p-6">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-brand-gold" />
                <span className="font-semibold">Date Range:</span>
              </div>
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                className="px-4 py-2 border border-gray-300 rounded-lg"
              />
              <span>to</span>
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                className="px-4 py-2 border border-gray-300 rounded-lg"
              />
              <button
                onClick={loadMetrics}
                className="px-6 py-2 bg-brand-gold text-white rounded-lg hover:bg-opacity-90 transition-all"
              >
                Update
              </button>
              <div className="ml-auto flex gap-2">
                <button
                  onClick={() => handleExport('csv')}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-all flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Export CSV
                </button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Subscription Metrics */}
        <div className="mb-8">
          <h2 className="text-2xl font-heading font-bold text-brand-black mb-4 flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-brand-gold" />
            Subscription Metrics
          </h2>
          <div className="grid md:grid-cols-4 gap-6">
            <Card className="border-2 border-gray-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <Users className="w-8 h-8 text-blue-600" />
                  <span className="text-3xl font-bold text-brand-black">
                    {metrics.subscriptions.total}
                  </span>
                </div>
                <p className="text-gray-600 font-semibold">Total Subscriptions</p>
              </CardContent>
            </Card>

            <Card className="border-2 border-gray-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <Users className="w-8 h-8 text-purple-600" />
                  <span className="text-3xl font-bold text-brand-black">
                    {metrics.subscriptions.premium}
                  </span>
                </div>
                <p className="text-gray-600 font-semibold">Premium Members</p>
              </CardContent>
            </Card>

            <Card className="border-2 border-gray-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <Users className="w-8 h-8 text-brand-gold" />
                  <span className="text-3xl font-bold text-brand-black">
                    {metrics.subscriptions.elite}
                  </span>
                </div>
                <p className="text-gray-600 font-semibold">Elite 360 Members</p>
              </CardContent>
            </Card>

            <Card className="border-2 border-gray-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <DollarSign className="w-8 h-8 text-emerald-600" />
                  <span className="text-3xl font-bold text-brand-black">
                    ${metrics.subscriptions.revenue.toFixed(2)}
                  </span>
                </div>
                <p className="text-gray-600 font-semibold">Subscription Revenue</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Vendor & Product Metrics */}
        <div className="mb-8">
          <h2 className="text-2xl font-heading font-bold text-brand-black mb-4 flex items-center gap-2">
            <ShoppingBag className="w-6 h-6 text-brand-gold" />
            Marketplace Metrics
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="border-2 border-gray-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <Users className="w-8 h-8 text-emerald-600" />
                  <span className="text-3xl font-bold text-brand-black">
                    {metrics.vendors.total}
                  </span>
                </div>
                <p className="text-gray-600 font-semibold">Total Vendors</p>
                <div className="mt-2 text-sm text-gray-500">
                  {metrics.vendors.active} active • {metrics.vendors.pending} pending
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-gray-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <ShoppingBag className="w-8 h-8 text-blue-600" />
                  <span className="text-3xl font-bold text-brand-black">
                    {metrics.products.total}
                  </span>
                </div>
                <p className="text-gray-600 font-semibold">Total Products</p>
                <div className="mt-2 text-sm text-gray-500">
                  {metrics.products.approved} approved • {metrics.products.pending} pending
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-gray-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <BarChart3 className="w-8 h-8 text-purple-600" />
                  <span className="text-3xl font-bold text-brand-black">
                    {metrics.products.approved > 0
                      ? ((metrics.products.approved / metrics.products.total) * 100).toFixed(1)
                      : 0}
                    %
                  </span>
                </div>
                <p className="text-gray-600 font-semibold">Approval Rate</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* AI Automation Metrics */}
        <div className="mb-8">
          <h2 className="text-2xl font-heading font-bold text-brand-black mb-4 flex items-center gap-2">
            <PieChart className="w-6 h-6 text-brand-gold" />
            AI Automation Metrics
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="border-2 border-gray-300">
              <CardHeader>
                <CardTitle>Mentorship Matching</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Total Matches</span>
                    <span className="text-2xl font-bold text-brand-black">
                      {metrics.mentorship.total_matches}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Approved</span>
                    <span className="text-xl font-semibold text-emerald-600">
                      {metrics.mentorship.approved}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Pending Review</span>
                    <span className="text-xl font-semibold text-yellow-600">
                      {metrics.mentorship.pending}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-gray-300">
              <CardHeader>
                <CardTitle>AI Content Generation</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Total Generated</span>
                    <span className="text-2xl font-bold text-brand-black">
                      {metrics.ai_content.total_generated}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Approved</span>
                    <span className="text-xl font-semibold text-emerald-600">
                      {metrics.ai_content.approved}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Pending Review</span>
                    <span className="text-xl font-semibold text-yellow-600">
                      {metrics.ai_content.pending}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Community Impact Fund */}
        <Card className="border-2 border-brand-gold">
          <CardHeader className="bg-gradient-to-r from-emerald-600 to-yellow-600">
            <CardTitle className="text-2xl text-white flex items-center gap-2">
              <DollarSign className="w-6 h-6" />
              Community Impact Fund (3%)
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-emerald-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-2">Total Contributed</p>
                <p className="text-3xl font-bold text-emerald-600">
                  ${metrics.community_fund.total_contributed.toFixed(2)}
                </p>
              </div>
              <div className="text-center p-6 bg-blue-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-2">HBCU Allocation</p>
                <p className="text-3xl font-bold text-blue-600">
                  ${metrics.community_fund.hbcu_allocated.toFixed(2)}
                </p>
              </div>
              <div className="text-center p-6 bg-purple-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-2">Scholarships</p>
                <p className="text-3xl font-bold text-purple-600">
                  ${metrics.community_fund.scholarships_allocated.toFixed(2)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
