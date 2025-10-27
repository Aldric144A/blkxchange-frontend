import { useState, useEffect } from 'react';
import { 
  Wallet as WalletIcon, TrendingUp, Gift, ShoppingBag, 
  Users, MessageSquare, Calendar, Award, ArrowUpRight, ArrowDownRight
} from 'lucide-react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

interface Transaction {
  id: string;
  type: 'earned' | 'spent' | 'bonus';
  amount: number;
  description: string;
  timestamp: string;
  category: string;
}

interface WalletData {
  balance: number;
  lifetime_earned: number;
  lifetime_spent: number;
  transactions: Transaction[];
}

const Wallet = () => {
  const [walletData, setWalletData] = useState<WalletData>({
    balance: 0,
    lifetime_earned: 0,
    lifetime_spent: 0,
    transactions: [],
  });
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<'all' | 'earned' | 'spent'>('all');

  const earningRules = [
    {
      icon: ShoppingBag,
      title: 'Make a Purchase',
      points: '10 points per $1 spent',
      color: 'emerald',
    },
    {
      icon: Users,
      title: 'Refer a Friend',
      points: '500 points',
      color: 'blue',
    },
    {
      icon: MessageSquare,
      title: 'Post in Community',
      points: '25 points per post',
      color: 'purple',
    },
    {
      icon: Calendar,
      title: 'Attend an Event',
      points: '100 points',
      color: 'yellow',
    },
    {
      icon: Award,
      title: 'Complete Profile',
      points: '250 points',
      color: 'pink',
    },
    {
      icon: Gift,
      title: 'Monthly Bonus',
      points: '50 points',
      color: 'red',
    },
  ];

  useEffect(() => {
    fetchWalletData();
  }, []);

  const fetchWalletData = async () => {
    try {
      const userId = 'demo-user';
      const response = await axios.get(`${API_URL}/api/blk360/wallet/${userId}`);
      setWalletData(response.data);
    } catch (error) {
      console.error('Error fetching wallet data:', error);
      setWalletData({
        balance: 1250,
        lifetime_earned: 2500,
        lifetime_spent: 1250,
        transactions: [
          {
            id: '1',
            type: 'earned',
            amount: 500,
            description: 'Referred a friend',
            timestamp: new Date().toISOString(),
            category: 'Referral',
          },
          {
            id: '2',
            type: 'earned',
            amount: 100,
            description: 'Attended Community Event',
            timestamp: new Date(Date.now() - 86400000).toISOString(),
            category: 'Event',
          },
          {
            id: '3',
            type: 'spent',
            amount: -250,
            description: 'Redeemed for discount',
            timestamp: new Date(Date.now() - 172800000).toISOString(),
            category: 'Redemption',
          },
          {
            id: '4',
            type: 'earned',
            amount: 250,
            description: 'Completed profile',
            timestamp: new Date(Date.now() - 259200000).toISOString(),
            category: 'Profile',
          },
          {
            id: '5',
            type: 'earned',
            amount: 25,
            description: 'Posted in Community Forum',
            timestamp: new Date(Date.now() - 345600000).toISOString(),
            category: 'Community',
          },
        ],
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredTransactions = walletData.transactions.filter(tx => {
    if (filterType === 'all') return true;
    return tx.type === filterType;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-emerald-950 flex items-center justify-center">
        <div className="text-white text-xl">Loading Wallet...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-emerald-950">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-900/50 to-yellow-900/50 border-b border-emerald-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center gap-3 mb-4">
            <WalletIcon className="w-8 h-8 text-emerald-400" />
            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-yellow-400">
              BlkXchange Wallet
            </h1>
          </div>
          <p className="text-xl text-gray-300 max-w-3xl">
            Your digital wallet for earning and redeeming BlkPoints across the platform.
          </p>
        </div>
      </div>

      {/* Balance Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Current Balance */}
          <div className="bg-gradient-to-br from-emerald-600 to-emerald-800 rounded-2xl p-6 border-2 border-emerald-500 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <span className="text-emerald-100 text-sm font-semibold">Current Balance</span>
              <WalletIcon className="w-6 h-6 text-emerald-200" />
            </div>
            <div className="text-4xl font-bold text-white mb-2">
              {walletData.balance.toLocaleString()}
            </div>
            <div className="text-emerald-100 text-sm">BlkPoints</div>
          </div>

          {/* Lifetime Earned */}
          <div className="bg-gradient-to-br from-yellow-600 to-yellow-800 rounded-2xl p-6 border-2 border-yellow-500 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <span className="text-yellow-100 text-sm font-semibold">Lifetime Earned</span>
              <TrendingUp className="w-6 h-6 text-yellow-200" />
            </div>
            <div className="text-4xl font-bold text-white mb-2">
              {walletData.lifetime_earned.toLocaleString()}
            </div>
            <div className="text-yellow-100 text-sm">BlkPoints</div>
          </div>

          {/* Lifetime Spent */}
          <div className="bg-gradient-to-br from-purple-600 to-purple-800 rounded-2xl p-6 border-2 border-purple-500 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <span className="text-purple-100 text-sm font-semibold">Lifetime Spent</span>
              <Gift className="w-6 h-6 text-purple-200" />
            </div>
            <div className="text-4xl font-bold text-white mb-2">
              {walletData.lifetime_spent.toLocaleString()}
            </div>
            <div className="text-purple-100 text-sm">BlkPoints</div>
          </div>
        </div>
      </div>

      {/* Earning Rules */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-2xl font-bold text-white mb-6">How to Earn BlkPoints</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {earningRules.map((rule, index) => {
            const Icon = rule.icon;
            return (
              <div
                key={index}
                className="bg-gray-900 rounded-xl p-6 border-2 border-gray-700 hover:border-emerald-500 transition-all duration-300"
              >
                <div className={`w-12 h-12 rounded-full bg-${rule.color}-600/20 flex items-center justify-center mb-4`}>
                  <Icon className={`w-6 h-6 text-${rule.color}-500`} />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{rule.title}</h3>
                <p className="text-emerald-400 font-semibold">{rule.points}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Transaction History */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Transaction History</h2>
          <div className="flex gap-2">
            <button
              onClick={() => setFilterType('all')}
              className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
                filterType === 'all'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilterType('earned')}
              className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
                filterType === 'earned'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              Earned
            </button>
            <button
              onClick={() => setFilterType('spent')}
              className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
                filterType === 'spent'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              Spent
            </button>
          </div>
        </div>

        <div className="bg-gray-900 rounded-xl border-2 border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-800">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {filteredTransactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-gray-800 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                      {new Date(tx.timestamp).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-white">
                      {tx.description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-700 text-gray-300">
                        {tx.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className={`flex items-center justify-end gap-2 font-semibold ${
                        tx.type === 'earned' ? 'text-emerald-400' : 'text-red-400'
                      }`}>
                        {tx.type === 'earned' ? (
                          <ArrowUpRight className="w-4 h-4" />
                        ) : (
                          <ArrowDownRight className="w-4 h-4" />
                        )}
                        <span>{Math.abs(tx.amount).toLocaleString()} pts</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Redemption Options */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-2xl font-bold text-white mb-6">Redeem Your Points</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-900 rounded-xl p-6 border-2 border-gray-700 hover:border-emerald-500 transition-all duration-300">
            <h3 className="text-lg font-bold text-white mb-2">$5 Discount</h3>
            <p className="text-gray-400 mb-4">Use on any purchase</p>
            <div className="flex items-center justify-between">
              <span className="text-emerald-400 font-bold">500 points</span>
              <button className="bg-emerald-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-emerald-700 transition-all duration-300">
                Redeem
              </button>
            </div>
          </div>
          <div className="bg-gray-900 rounded-xl p-6 border-2 border-gray-700 hover:border-emerald-500 transition-all duration-300">
            <h3 className="text-lg font-bold text-white mb-2">$10 Discount</h3>
            <p className="text-gray-400 mb-4">Use on any purchase</p>
            <div className="flex items-center justify-between">
              <span className="text-emerald-400 font-bold">900 points</span>
              <button className="bg-emerald-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-emerald-700 transition-all duration-300">
                Redeem
              </button>
            </div>
          </div>
          <div className="bg-gray-900 rounded-xl p-6 border-2 border-gray-700 hover:border-emerald-500 transition-all duration-300">
            <h3 className="text-lg font-bold text-white mb-2">$25 Discount</h3>
            <p className="text-gray-400 mb-4">Use on any purchase</p>
            <div className="flex items-center justify-between">
              <span className="text-emerald-400 font-bold">2000 points</span>
              <button className="bg-emerald-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-emerald-700 transition-all duration-300">
                Redeem
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Wallet;
