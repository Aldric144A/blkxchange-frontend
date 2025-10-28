import { Users, ShoppingBag, Briefcase, TrendingUp, Award, Calendar } from 'lucide-react';

export default function AdminOverview360() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard Overview</h1>
        <p className="text-gray-600">Welcome to the BlkXchange™ Unified Admin Console</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-br from-emerald-600 to-emerald-700 p-6 rounded-xl text-white">
          <Users className="w-12 h-12 mb-4 opacity-80" />
          <h3 className="text-3xl font-bold mb-2">0</h3>
          <p className="text-emerald-100">Total Vendors</p>
          <p className="text-sm text-emerald-200 mt-2">0 pending approval</p>
        </div>

        <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-6 rounded-xl text-white">
          <ShoppingBag className="w-12 h-12 mb-4 opacity-80" />
          <h3 className="text-3xl font-bold mb-2">0</h3>
          <p className="text-blue-100">Total Products</p>
          <p className="text-sm text-blue-200 mt-2">0 pending review</p>
        </div>

        <div className="bg-gradient-to-br from-purple-600 to-purple-700 p-6 rounded-xl text-white">
          <Briefcase className="w-12 h-12 mb-4 opacity-80" />
          <h3 className="text-3xl font-bold mb-2">60</h3>
          <p className="text-purple-100">Professionals</p>
          <p className="text-sm text-purple-200 mt-2">All categories</p>
        </div>

        <div className="bg-gradient-to-br from-yellow-600 to-yellow-700 p-6 rounded-xl text-white">
          <Calendar className="w-12 h-12 mb-4 opacity-80" />
          <h3 className="text-3xl font-bold mb-2">0</h3>
          <p className="text-yellow-100">Upcoming Events</p>
          <p className="text-sm text-yellow-200 mt-2">Community events</p>
        </div>

        <div className="bg-gradient-to-br from-pink-600 to-pink-700 p-6 rounded-xl text-white">
          <TrendingUp className="w-12 h-12 mb-4 opacity-80" />
          <h3 className="text-3xl font-bold mb-2">$0.00</h3>
          <p className="text-pink-100">Total Donations</p>
          <p className="text-sm text-pink-200 mt-2">Community impact</p>
        </div>

        <div className="bg-gradient-to-br from-orange-600 to-orange-700 p-6 rounded-xl text-white">
          <Award className="w-12 h-12 mb-4 opacity-80" />
          <h3 className="text-3xl font-bold mb-2">0</h3>
          <p className="text-orange-100">BlkCoins Circulating</p>
          <p className="text-sm text-orange-200 mt-2">0 active wallets</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button className="flex items-center gap-3 p-4 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors">
            <Users className="w-6 h-6 text-emerald-600" />
            <span className="font-semibold text-emerald-900">Add Vendor</span>
          </button>
          <button className="flex items-center gap-3 p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
            <ShoppingBag className="w-6 h-6 text-blue-600" />
            <span className="font-semibold text-blue-900">Add Product</span>
          </button>
          <button className="flex items-center gap-3 p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors">
            <Calendar className="w-6 h-6 text-purple-600" />
            <span className="font-semibold text-purple-900">Create Event</span>
          </button>
          <button className="flex items-center gap-3 p-4 bg-yellow-50 hover:bg-yellow-100 rounded-lg transition-colors">
            <Award className="w-6 h-6 text-yellow-600" />
            <span className="font-semibold text-yellow-900">Award Scholarship</span>
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white p-6 rounded-xl border border-gray-200">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h2>
        <div className="text-center py-8 text-gray-500">
          <p>No recent activity to display</p>
          <p className="text-sm mt-2">Activity will appear here as vendors, products, and events are added</p>
        </div>
      </div>
    </div>
  );
}
