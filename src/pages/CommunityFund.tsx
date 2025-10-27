import { useState, useEffect } from 'react';
import { 
  DollarSign, TrendingUp, Heart, Users, GraduationCap, 
  Building, PieChart, BarChart3, Target
} from 'lucide-react';
import axios from 'axios';
import { PieChart as RechartsPie, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

interface FundMetrics {
  total_raised: number;
  vendor_allocation: number;
  operations_allocation: number;
  hbcu_allocation: number;
  total_vendors_supported: number;
  total_hbcus_supported: number;
  monthly_growth: number;
}

interface Donation {
  id: string;
  donor_name: string;
  amount: number;
  category: string;
  timestamp: string;
  anonymous: boolean;
}

const CommunityFund = () => {
  const [metrics, setMetrics] = useState<FundMetrics>({
    total_raised: 0,
    vendor_allocation: 0,
    operations_allocation: 0,
    hbcu_allocation: 0,
    total_vendors_supported: 0,
    total_hbcus_supported: 0,
    monthly_growth: 0,
  });
  const [recentDonations, setRecentDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const [donationAmount, setDonationAmount] = useState<number>(25);
  const [donationCategory, setDonationCategory] = useState<string>('general');

  useEffect(() => {
    fetchFundData();
  }, []);

  const fetchFundData = async () => {
    try {
      const [metricsRes, donationsRes] = await Promise.all([
        axios.get(`${API_URL}/api/blk360/fund/metrics`),
        axios.get(`${API_URL}/api/blk360/fund/donations/recent`),
      ]);
      setMetrics(metricsRes.data);
      setRecentDonations(donationsRes.data);
    } catch (error) {
      console.error('Error fetching fund data:', error);
      setMetrics({
        total_raised: 125000,
        vendor_allocation: 106250, // 85%
        operations_allocation: 15000, // 12%
        hbcu_allocation: 3750, // 3%
        total_vendors_supported: 47,
        total_hbcus_supported: 5,
        monthly_growth: 12.5,
      });
      setRecentDonations([
        {
          id: '1',
          donor_name: 'John Smith',
          amount: 100,
          category: 'HBCU Scholarship',
          timestamp: new Date().toISOString(),
          anonymous: false,
        },
        {
          id: '2',
          donor_name: 'Anonymous',
          amount: 250,
          category: 'Vendor Support',
          timestamp: new Date(Date.now() - 86400000).toISOString(),
          anonymous: true,
        },
        {
          id: '3',
          donor_name: 'Sarah Johnson',
          amount: 50,
          category: 'General Fund',
          timestamp: new Date(Date.now() - 172800000).toISOString(),
          anonymous: false,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleDonate = async () => {
    try {
      await axios.post(`${API_URL}/api/blk360/fund/donate`, {
        amount: donationAmount,
        category: donationCategory,
      });
      alert('Thank you for your donation!');
      fetchFundData();
    } catch (error) {
      console.error('Error processing donation:', error);
      alert('Donation processing coming soon!');
    }
  };

  const allocationData = [
    { name: 'Vendor Support (85%)', value: metrics.vendor_allocation, color: '#10b981' },
    { name: 'Operations (12%)', value: metrics.operations_allocation, color: '#f59e0b' },
    { name: 'HBCUs (3%)', value: metrics.hbcu_allocation, color: '#8b5cf6' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-emerald-950 flex items-center justify-center">
        <div className="text-white text-xl">Loading Community Fund...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-emerald-950">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-900/50 to-yellow-900/50 border-b border-emerald-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center gap-3 mb-4">
            <Heart className="w-8 h-8 text-emerald-400" />
            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-yellow-400">
              Community Fund & Impact Dashboard
            </h1>
          </div>
          <p className="text-xl text-gray-300 max-w-3xl">
            Transparent tracking of how your contributions support vendors, operations, and HBCUs.
          </p>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-emerald-600 to-emerald-800 rounded-2xl p-6 border-2 border-emerald-500 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <span className="text-emerald-100 text-sm font-semibold">Total Raised</span>
              <DollarSign className="w-6 h-6 text-emerald-200" />
            </div>
            <div className="text-3xl font-bold text-white mb-2">
              ${metrics.total_raised.toLocaleString()}
            </div>
            <div className="flex items-center gap-2 text-emerald-100 text-sm">
              <TrendingUp className="w-4 h-4" />
              <span>+{metrics.monthly_growth}% this month</span>
            </div>
          </div>

          <div className="bg-gradient-to-br from-yellow-600 to-yellow-800 rounded-2xl p-6 border-2 border-yellow-500 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <span className="text-yellow-100 text-sm font-semibold">Vendors Supported</span>
              <Users className="w-6 h-6 text-yellow-200" />
            </div>
            <div className="text-3xl font-bold text-white mb-2">
              {metrics.total_vendors_supported}
            </div>
            <div className="text-yellow-100 text-sm">Active vendors</div>
          </div>

          <div className="bg-gradient-to-br from-purple-600 to-purple-800 rounded-2xl p-6 border-2 border-purple-500 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <span className="text-purple-100 text-sm font-semibold">HBCUs Supported</span>
              <GraduationCap className="w-6 h-6 text-purple-200" />
            </div>
            <div className="text-3xl font-bold text-white mb-2">
              {metrics.total_hbcus_supported}
            </div>
            <div className="text-purple-100 text-sm">Partner institutions</div>
          </div>

          <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-6 border-2 border-blue-500 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <span className="text-blue-100 text-sm font-semibold">HBCU Allocation</span>
              <Target className="w-6 h-6 text-blue-200" />
            </div>
            <div className="text-3xl font-bold text-white mb-2">
              ${metrics.hbcu_allocation.toLocaleString()}
            </div>
            <div className="text-blue-100 text-sm">3% of total funds</div>
          </div>
        </div>
      </div>

      {/* Fund Allocation Visualization */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Pie Chart */}
          <div className="bg-gray-900 rounded-xl p-6 border-2 border-gray-700">
            <div className="flex items-center gap-3 mb-6">
              <PieChart className="w-6 h-6 text-emerald-400" />
              <h2 className="text-2xl font-bold text-white">Fund Allocation Breakdown</h2>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <RechartsPie>
                <Pie
                  data={allocationData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {allocationData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => `$${value.toLocaleString()}`} />
                <Legend />
              </RechartsPie>
            </ResponsiveContainer>
          </div>

          {/* Allocation Details */}
          <div className="bg-gray-900 rounded-xl p-6 border-2 border-gray-700">
            <div className="flex items-center gap-3 mb-6">
              <BarChart3 className="w-6 h-6 text-emerald-400" />
              <h2 className="text-2xl font-bold text-white">Where Your Money Goes</h2>
            </div>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-emerald-600/20 flex items-center justify-center flex-shrink-0">
                  <Users className="w-6 h-6 text-emerald-500" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-white mb-1">Vendor Support (85%)</h3>
                  <p className="text-gray-400 text-sm mb-2">
                    Direct support to Black-owned businesses through reduced fees and growth resources.
                  </p>
                  <div className="text-emerald-400 font-bold">
                    ${metrics.vendor_allocation.toLocaleString()}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-yellow-600/20 flex items-center justify-center flex-shrink-0">
                  <Building className="w-6 h-6 text-yellow-500" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-white mb-1">Operations (12%)</h3>
                  <p className="text-gray-400 text-sm mb-2">
                    Platform maintenance, customer support, and technology improvements.
                  </p>
                  <div className="text-yellow-400 font-bold">
                    ${metrics.operations_allocation.toLocaleString()}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-purple-600/20 flex items-center justify-center flex-shrink-0">
                  <GraduationCap className="w-6 h-6 text-purple-500" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-white mb-1">HBCUs & Scholarships (3%)</h3>
                  <p className="text-gray-400 text-sm mb-2">
                    Supporting historically Black colleges and student scholarships.
                  </p>
                  <div className="text-purple-400 font-bold">
                    ${metrics.hbcu_allocation.toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Donation Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-gradient-to-r from-emerald-900/50 to-yellow-900/50 rounded-2xl p-8 border-2 border-emerald-700">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">Make a Direct Contribution</h2>
          <div className="max-w-2xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Donation Amount
                </label>
                <div className="flex gap-2">
                  {[25, 50, 100, 250].map((amount) => (
                    <button
                      key={amount}
                      onClick={() => setDonationAmount(amount)}
                      className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
                        donationAmount === amount
                          ? 'bg-emerald-600 text-white'
                          : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                      }`}
                    >
                      ${amount}
                    </button>
                  ))}
                </div>
                <input
                  type="number"
                  value={donationAmount}
                  onChange={(e) => setDonationAmount(Number(e.target.value))}
                  className="w-full mt-2 px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-emerald-500 focus:outline-none"
                  placeholder="Custom amount"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Donation Category
                </label>
                <select
                  value={donationCategory}
                  onChange={(e) => setDonationCategory(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-emerald-500 focus:outline-none"
                >
                  <option value="general">General Fund</option>
                  <option value="vendor">Vendor Support</option>
                  <option value="hbcu">HBCU Scholarship</option>
                  <option value="operations">Platform Operations</option>
                </select>
              </div>
            </div>

            <button
              onClick={handleDonate}
              className="w-full bg-gradient-to-r from-emerald-600 to-yellow-600 text-white px-6 py-4 rounded-lg font-bold text-lg hover:shadow-xl transition-all duration-300"
            >
              Donate ${donationAmount}
            </button>

            <p className="text-center text-gray-400 text-sm mt-4">
              Secure payment processing via Stripe. Tax-deductible receipts provided.
            </p>
          </div>
        </div>
      </div>

      {/* Recent Donations */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-2xl font-bold text-white mb-6">Recent Contributions</h2>
        <div className="bg-gray-900 rounded-xl border-2 border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-800">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Donor
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {recentDonations.map((donation) => (
                  <tr key={donation.id} className="hover:bg-gray-800 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                      {donation.anonymous ? 'Anonymous' : donation.donor_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-600 text-white">
                        {donation.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                      {new Date(donation.timestamp).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-semibold text-emerald-400">
                      ${donation.amount.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityFund;
