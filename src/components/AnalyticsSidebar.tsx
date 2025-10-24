import { useState, useEffect } from 'react';
import { RefreshCw, TrendingUp, Users, Package, Megaphone, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getAdminHeaders } from '@/utils/auth';

interface AdminMetrics {
  total_vendors: number;
  total_professionals: number;
  total_products: number;
  total_ads: number;
  total_visitors: number;
  pending_vendors: number;
  pending_professionals: number;
  pending_products: number;
  last_updated: string;
}

export function AnalyticsSidebar() {
  const [metrics, setMetrics] = useState<AdminMetrics | null>(null);
  const [loading, setLoading] = useState(false);

  const loadMetrics = async () => {
    setLoading(true);
    try {
      const headers = getAdminHeaders();
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/admin/metrics`,
        { headers }
      );

      if (response.ok) {
        const data = await response.json();
        setMetrics(data);
      }
    } catch (err) {
      console.error('Error loading metrics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMetrics();
    const interval = setInterval(loadMetrics, 60000);
    return () => clearInterval(interval);
  }, []);

  if (!metrics) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>
      </div>
    );
  }

  const stats = [
    {
      label: 'Total Vendors',
      value: metrics.total_vendors,
      pending: metrics.pending_vendors,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      label: 'Total Professionals',
      value: metrics.total_professionals,
      pending: metrics.pending_professionals,
      icon: Users,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      label: 'Total Products',
      value: metrics.total_products,
      pending: metrics.pending_products,
      icon: Package,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      label: 'Total Ads',
      value: metrics.total_ads,
      pending: 0,
      icon: Megaphone,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
    {
      label: 'Monthly Visitors',
      value: metrics.total_visitors,
      pending: 0,
      icon: Eye,
      color: 'text-pink-600',
      bgColor: 'bg-pink-50',
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 sticky top-4">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-[#C5A14E]" />
          Analytics Snapshot
        </h3>
        <Button
          size="sm"
          variant="outline"
          onClick={loadMetrics}
          disabled={loading}
          className="h-8 w-8 p-0"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </Button>
      </div>

      <div className="space-y-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className={`${stat.bgColor} rounded-lg p-4`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">{stat.label}</span>
                <Icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <div className="flex items-baseline gap-2">
                <span className={`text-2xl font-bold ${stat.color}`}>{stat.value}</span>
                {stat.pending > 0 && (
                  <span className="text-xs text-yellow-600 font-semibold bg-yellow-100 px-2 py-1 rounded">
                    {stat.pending} pending
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 pt-6 border-t border-gray-200">
        <p className="text-xs text-gray-500">
          Last updated: {new Date(metrics.last_updated).toLocaleTimeString()}
        </p>
      </div>
    </div>
  );
}
