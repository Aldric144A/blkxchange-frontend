import { useState, useEffect } from 'react';
import { Download, FileText, BarChart3, TrendingUp, Users, Package, DollarSign, Heart } from 'lucide-react';

interface DemoStats {
  totalVendors: number;
  totalProducts: number;
  totalRevenue: number;
  communityImpact: number;
  blkCoinDistributed: number;
  volunteerHours: number;
  impactValue: number;
}

export default function DemoInvestor() {
  const [stats, setStats] = useState<DemoStats>({
    totalVendors: 0,
    totalProducts: 0,
    totalRevenue: 0,
    communityImpact: 0,
    blkCoinDistributed: 0,
    volunteerHours: 0,
    impactValue: 0,
  });
  const [demoMode, setDemoMode] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      
      const [vendorsRes, productsRes, impactRes] = await Promise.all([
        fetch(`${apiUrl}/api/vendors`),
        fetch(`${apiUrl}/api/products`),
        fetch(`${apiUrl}/api/impact`)
      ]);

      const vendors = await vendorsRes.json();
      const products = await productsRes.json();
      const impact = await impactRes.json();

      setStats({
        totalVendors: vendors.length,
        totalProducts: products.length,
        totalRevenue: vendors.reduce((sum: number, v: any) => sum + v.total_sales, 0),
        communityImpact: impact.total_donations || 0,
        blkCoinDistributed: 15000,
        volunteerHours: 2500,
        impactValue: 125000,
      });
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  const exportToCSV = () => {
    const csvContent = `Metric,Value
Total Vendors,${demoMode ? 'XXX' : stats.totalVendors}
Total Products,${demoMode ? 'XXX' : stats.totalProducts}
Total Revenue,$${demoMode ? 'XXX' : stats.totalRevenue.toFixed(2)}
Community Impact,$${demoMode ? 'XXX' : stats.communityImpact.toFixed(2)}
BlkCoin Distributed,${demoMode ? 'XXX' : stats.blkCoinDistributed}
Volunteer Hours,${demoMode ? 'XXX' : stats.volunteerHours}
Impact Value,$${demoMode ? 'XXX' : stats.impactValue.toFixed(2)}`;

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'blkxchange-investor-metrics.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const exportToPDF = () => {
    alert('PDF export would be implemented with a library like jsPDF or react-pdf');
  };

  const displayValue = (value: number | string, prefix = '', suffix = '') => {
    if (demoMode) return 'XXX';
    return `${prefix}${typeof value === 'number' ? value.toLocaleString() : value}${suffix}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-emerald-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                BlkXchange™ Investor Dashboard
              </h1>
              <p className="text-gray-600">
                Comprehensive platform metrics and impact analysis
              </p>
            </div>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={demoMode}
                  onChange={(e) => setDemoMode(e.target.checked)}
                  className="w-4 h-4 text-emerald-600 rounded"
                />
                <span className="text-sm font-medium text-gray-700">Demo Mode</span>
              </label>
              <button
                onClick={exportToCSV}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
              >
                <Download className="h-5 w-5" />
                Export CSV
              </button>
              <button
                onClick={exportToPDF}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <FileText className="h-5 w-5" />
                Export PDF
              </button>
            </div>
          </div>

          {demoMode && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <p className="text-yellow-800 text-sm">
                <strong>Demo Mode Active:</strong> Sensitive data is anonymized. Toggle off to view actual metrics.
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-6 text-white">
              <div className="flex items-center justify-between mb-4">
                <Users className="h-8 w-8" />
                <TrendingUp className="h-6 w-6 opacity-75" />
              </div>
              <h3 className="text-sm font-medium opacity-90 mb-1">Total Vendors</h3>
              <p className="text-3xl font-bold">{displayValue(stats.totalVendors)}</p>
              <p className="text-xs opacity-75 mt-2">+12% from last month</p>
            </div>

            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-6 text-white">
              <div className="flex items-center justify-between mb-4">
                <Package className="h-8 w-8" />
                <TrendingUp className="h-6 w-6 opacity-75" />
              </div>
              <h3 className="text-sm font-medium opacity-90 mb-1">Total Products</h3>
              <p className="text-3xl font-bold">{displayValue(stats.totalProducts)}</p>
              <p className="text-xs opacity-75 mt-2">+8% from last month</p>
            </div>

            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-6 text-white">
              <div className="flex items-center justify-between mb-4">
                <DollarSign className="h-8 w-8" />
                <TrendingUp className="h-6 w-6 opacity-75" />
              </div>
              <h3 className="text-sm font-medium opacity-90 mb-1">Total Revenue</h3>
              <p className="text-3xl font-bold">{displayValue(stats.totalRevenue, '$')}</p>
              <p className="text-xs opacity-75 mt-2">+23% from last month</p>
            </div>

            <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-lg p-6 text-white">
              <div className="flex items-center justify-between mb-4">
                <Heart className="h-8 w-8" />
                <TrendingUp className="h-6 w-6 opacity-75" />
              </div>
              <h3 className="text-sm font-medium opacity-90 mb-1">Community Impact</h3>
              <p className="text-3xl font-bold">{displayValue(stats.communityImpact, '$')}</p>
              <p className="text-xs opacity-75 mt-2">+15% from last month</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white border-2 border-emerald-200 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-lg flex items-center justify-center">
                  <BarChart3 className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-600">BlkCoin Distributed</h3>
                  <p className="text-2xl font-bold text-gray-900">
                    {displayValue(stats.blkCoinDistributed)}
                  </p>
                </div>
              </div>
              <p className="text-sm text-gray-600">
                Platform currency distributed to community members
              </p>
            </div>

            <div className="bg-white border-2 border-emerald-200 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-400 to-indigo-600 rounded-lg flex items-center justify-center">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-600">Volunteer Hours</h3>
                  <p className="text-2xl font-bold text-gray-900">
                    {displayValue(stats.volunteerHours)}
                  </p>
                </div>
              </div>
              <p className="text-sm text-gray-600">
                Community service hours contributed by members
              </p>
            </div>

            <div className="bg-white border-2 border-emerald-200 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-lg flex items-center justify-center">
                  <Heart className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-600">Impact Value</h3>
                  <p className="text-2xl font-bold text-gray-900">
                    {displayValue(stats.impactValue, '$')}
                  </p>
                </div>
              </div>
              <p className="text-sm text-gray-600">
                Total estimated community impact value
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-emerald-600 to-emerald-800 rounded-lg p-8 text-white">
            <h2 className="text-2xl font-bold mb-4">Investment Opportunity</h2>
            <p className="text-emerald-100 mb-6">
              BlkXchange™ is revolutionizing the way Black and BIPOC entrepreneurs connect with customers
              and build sustainable businesses. Our platform combines eCommerce, professional services, and
              community impact to create a thriving ecosystem.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h3 className="font-semibold mb-2">Market Opportunity</h3>
                <p className="text-emerald-100 text-sm">
                  $150B+ Black consumer market with growing demand for authentic representation
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Revenue Model</h3>
                <p className="text-emerald-100 text-sm">
                  10% transaction fee with 3% automatically reinvested in community programs
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Growth Trajectory</h3>
                <p className="text-emerald-100 text-sm">
                  23% month-over-month growth with strong vendor and customer retention
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
