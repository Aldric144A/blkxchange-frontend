import { useEffect, useState } from 'react';
import { Users, Package, DollarSign, TrendingUp, Heart, Calendar, Handshake, GraduationCap } from 'lucide-react';
import Admin360Layout from '@/components/admin/Admin360Layout';

interface DashboardStats {
  totalVendors: number;
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  communityImpact: number;
  activeEvents: number;
  totalPartners: number;
  scholarshipsAwarded: number;
}

export default function Admin360Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalVendors: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    communityImpact: 0,
    activeEvents: 0,
    totalPartners: 0,
    scholarshipsAwarded: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      
      const vendorsRes = await fetch(`${apiUrl}/api/vendors`);
      const vendors = await vendorsRes.json();
      
      const productsRes = await fetch(`${apiUrl}/api/products`);
      const products = await productsRes.json();
      
      const ordersRes = await fetch(`${apiUrl}/api/orders`);
      const orders = await ordersRes.json();
      
      const impactRes = await fetch(`${apiUrl}/api/impact`);
      const impact = await impactRes.json();
      
      const totalRevenue = orders.reduce((sum: number, order: any) => sum + order.total_amount, 0);
      
      setStats({
        totalVendors: vendors.length,
        totalProducts: products.length,
        totalOrders: orders.length,
        totalRevenue,
        communityImpact: impact.total_donations || 0,
        activeEvents: 0, // TODO: Implement events API
        totalPartners: 0, // TODO: Implement partners API
        scholarshipsAwarded: 0, // TODO: Implement scholarships API
      });
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Vendors',
      value: stats.totalVendors,
      icon: Users,
      color: 'from-blue-500 to-blue-600',
      change: '+12%',
    },
    {
      title: 'Total Products',
      value: stats.totalProducts,
      icon: Package,
      color: 'from-purple-500 to-purple-600',
      change: '+8%',
    },
    {
      title: 'Total Orders',
      value: stats.totalOrders,
      icon: TrendingUp,
      color: 'from-green-500 to-green-600',
      change: '+23%',
    },
    {
      title: 'Total Revenue',
      value: `$${stats.totalRevenue.toFixed(2)}`,
      icon: DollarSign,
      color: 'from-yellow-500 to-yellow-600',
      change: '+18%',
    },
    {
      title: 'Community Impact',
      value: `$${stats.communityImpact.toFixed(2)}`,
      icon: Heart,
      color: 'from-red-500 to-red-600',
      change: '+15%',
    },
    {
      title: 'Active Events',
      value: stats.activeEvents,
      icon: Calendar,
      color: 'from-indigo-500 to-indigo-600',
      change: '+5%',
    },
    {
      title: 'Partners',
      value: stats.totalPartners,
      icon: Handshake,
      color: 'from-teal-500 to-teal-600',
      change: '+10%',
    },
    {
      title: 'Scholarships',
      value: stats.scholarshipsAwarded,
      icon: GraduationCap,
      color: 'from-orange-500 to-orange-600',
      change: '+7%',
    },
  ];

  if (loading) {
    return (
      <Admin360Layout>
        <div className="flex items-center justify-center h-full">
          <div className="text-gray-500">Loading dashboard...</div>
        </div>
      </Admin360Layout>
    );
  }

  return (
    <Admin360Layout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-emerald-600 to-emerald-800 rounded-lg p-6 text-white">
          <h2 className="text-3xl font-bold mb-2">Welcome to Admin360</h2>
          <p className="text-emerald-100">
            Your unified command center for managing BlkXchange™ marketplace operations
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.title}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <span className="text-sm font-medium text-green-600">{stat.change}</span>
                </div>
                <h3 className="text-gray-600 text-sm font-medium mb-1">{stat.title}</h3>
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
              </div>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="px-4 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium">
              Approve Pending Vendors
            </button>
            <button className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
              Review Products
            </button>
            <button className="px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium">
              Generate Reports
            </button>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">New vendor application received</p>
                <p className="text-xs text-gray-500">2 minutes ago</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Product approved and published</p>
                <p className="text-xs text-gray-500">15 minutes ago</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Order requires attention</p>
                <p className="text-xs text-gray-500">1 hour ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Admin360Layout>
  );
}
