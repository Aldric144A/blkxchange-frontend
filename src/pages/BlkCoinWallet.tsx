import { useState, useEffect } from 'react';
import { Coins, TrendingUp, Gift, History, Award } from 'lucide-react';

interface BlkCoinWallet {
  id: string;
  user_id: string;
  email: string;
  balance: number;
  lifetime_earned: number;
  lifetime_redeemed: number;
  created_at: string;
  last_updated: string;
}

interface BlkCoinTransaction {
  id: string;
  user_id: string;
  transaction_type: string;
  activity_type: string;
  amount: number;
  balance_after: number;
  reason: string;
  metadata: any;
  created_at: string;
}

interface BlkCoinReward {
  id: string;
  activity_type: string;
  amount: number;
  description: string;
  is_active: boolean;
  created_at: string;
}

export default function BlkCoinWallet() {
  const [wallet, setWallet] = useState<BlkCoinWallet | null>(null);
  const [transactions, setTransactions] = useState<BlkCoinTransaction[]>([]);
  const [rewards, setRewards] = useState<BlkCoinReward[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId] = useState('demo-user-001');
  const [email] = useState('user@blkxchange.com');

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

  useEffect(() => {
    fetchWalletData();
    fetchRewards();
  }, [userId]);

  const fetchWalletData = async () => {
    try {
      const walletRes = await fetch(`${API_URL}/api/blkcoin/wallet/${userId}`);
      if (walletRes.ok) {
        const walletData = await walletRes.json();
        setWallet(walletData);
      } else if (walletRes.status === 404) {
        const createRes = await fetch(`${API_URL}/api/blkcoin/wallet/create?user_id=${userId}&email=${email}`, {
          method: 'POST'
        });
        if (createRes.ok) {
          const newWallet = await createRes.json();
          setWallet(newWallet);
        }
      }

      const txRes = await fetch(`${API_URL}/api/blkcoin/transactions/${userId}`);
      if (txRes.ok) {
        const txData = await txRes.json();
        setTransactions(txData);
      }
    } catch (error) {
      console.error('Error fetching wallet data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRewards = async () => {
    try {
      const res = await fetch(`${API_URL}/api/blkcoin/rewards`);
      if (res.ok) {
        const data = await res.json();
        setRewards(data.filter((r: BlkCoinReward) => r.is_active));
      }
    } catch (error) {
      console.error('Error fetching rewards:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getActivityIcon = (activityType: string) => {
    switch (activityType) {
      case 'wealth_module_complete':
        return <Award className="w-5 h-5 text-yellow-500" />;
      case 'event_rsvp':
      case 'event_attend':
        return <TrendingUp className="w-5 h-5 text-green-500" />;
      case 'donation':
        return <Gift className="w-5 h-5 text-purple-500" />;
      default:
        return <Coins className="w-5 h-5 text-[#C5A14E]" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#111111] flex items-center justify-center">
        <div className="text-[#C5A14E] text-xl">Loading your BlkCoin™ Wallet...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#111111] py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-[#C5A14E] mb-4">
            BlkCoin™ Wallet
          </h1>
          <p className="text-white text-lg">
            Earn rewards for community engagement and redeem for exclusive benefits
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-gradient-to-br from-[#C5A14E] to-[#8B7355] p-8 rounded-xl shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <Coins className="w-10 h-10 text-white" />
              <span className="text-white text-sm font-semibold">Current Balance</span>
            </div>
            <div className="text-white text-5xl font-bold">
              {wallet?.balance.toFixed(0) || 0}
            </div>
            <div className="text-white/80 text-sm mt-2">BlkCoins</div>
          </div>

          <div className="bg-[#1A1A1A] border border-[#C5A14E]/30 p-8 rounded-xl">
            <div className="flex items-center justify-between mb-4">
              <TrendingUp className="w-8 h-8 text-green-500" />
              <span className="text-[#C5A14E] text-sm font-semibold">Lifetime Earned</span>
            </div>
            <div className="text-white text-4xl font-bold">
              {wallet?.lifetime_earned.toFixed(0) || 0}
            </div>
            <div className="text-white/60 text-sm mt-2">Total BlkCoins Earned</div>
          </div>

          <div className="bg-[#1A1A1A] border border-[#C5A14E]/30 p-8 rounded-xl">
            <div className="flex items-center justify-between mb-4">
              <Gift className="w-8 h-8 text-purple-500" />
              <span className="text-[#C5A14E] text-sm font-semibold">Lifetime Redeemed</span>
            </div>
            <div className="text-white text-4xl font-bold">
              {wallet?.lifetime_redeemed.toFixed(0) || 0}
            </div>
            <div className="text-white/60 text-sm mt-2">Total BlkCoins Redeemed</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-[#1A1A1A] border border-[#C5A14E]/30 rounded-xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <Award className="w-6 h-6 text-[#C5A14E]" />
              <h2 className="text-2xl font-bold text-[#C5A14E]">Earn BlkCoins</h2>
            </div>
            <div className="space-y-4">
              {rewards.map((reward) => (
                <div
                  key={reward.id}
                  className="flex items-center justify-between p-4 bg-[#111111] rounded-lg border border-[#C5A14E]/20 hover:border-[#C5A14E]/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    {getActivityIcon(reward.activity_type)}
                    <div>
                      <div className="text-white font-semibold">{reward.description}</div>
                      <div className="text-white/60 text-sm">
                        {reward.activity_type.replace(/_/g, ' ')}
                      </div>
                    </div>
                  </div>
                  <div className="text-[#C5A14E] font-bold text-lg">
                    +{reward.amount}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#1A1A1A] border border-[#C5A14E]/30 rounded-xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <History className="w-6 h-6 text-[#C5A14E]" />
              <h2 className="text-2xl font-bold text-[#C5A14E]">Transaction History</h2>
            </div>
            <div className="space-y-3 max-h-[600px] overflow-y-auto">
              {transactions.length === 0 ? (
                <div className="text-center text-white/60 py-8">
                  No transactions yet. Start earning BlkCoins!
                </div>
              ) : (
                transactions.map((tx) => (
                  <div
                    key={tx.id}
                    className="flex items-center justify-between p-4 bg-[#111111] rounded-lg border border-[#C5A14E]/20"
                  >
                    <div className="flex items-center gap-3">
                      {getActivityIcon(tx.activity_type)}
                      <div>
                        <div className="text-white font-medium">{tx.reason}</div>
                        <div className="text-white/60 text-sm">
                          {formatDate(tx.created_at)}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div
                        className={`font-bold text-lg ${
                          tx.transaction_type === 'earn'
                            ? 'text-green-500'
                            : 'text-red-500'
                        }`}
                      >
                        {tx.transaction_type === 'earn' ? '+' : '-'}
                        {tx.amount}
                      </div>
                      <div className="text-white/60 text-sm">
                        Balance: {tx.balance_after.toFixed(0)}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="mt-12 bg-gradient-to-r from-[#C5A14E]/20 to-[#8B7355]/20 border border-[#C5A14E]/30 rounded-xl p-8">
          <h3 className="text-2xl font-bold text-[#C5A14E] mb-4">Redeem Your BlkCoins</h3>
          <p className="text-white mb-6">
            Use your BlkCoins to unlock premium features, get marketplace discounts, enter scholarship drawings, and more!
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="bg-[#C5A14E] hover:bg-[#8B7355] text-white font-bold py-4 px-6 rounded-lg transition-colors">
              Premium Upgrade (500 BlkCoins)
            </button>
            <button className="bg-[#C5A14E] hover:bg-[#8B7355] text-white font-bold py-4 px-6 rounded-lg transition-colors">
              Marketplace Coupon (100 BlkCoins)
            </button>
            <button className="bg-[#C5A14E] hover:bg-[#8B7355] text-white font-bold py-4 px-6 rounded-lg transition-colors">
              Scholarship Entry (50 BlkCoins)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
