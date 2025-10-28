import { useState, useEffect } from 'react';
import { Coins, Users, TrendingUp, DollarSign, Search } from 'lucide-react';

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

export default function AdminBlkCoin() {
  const [wallets, setWallets] = useState<BlkCoinWallet[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAdjustModal, setShowAdjustModal] = useState(false);
  const [selectedWallet, setSelectedWallet] = useState<BlkCoinWallet | null>(null);
  const [adjustAmount, setAdjustAmount] = useState(0);
  const [adjustReason, setAdjustReason] = useState('');
  const [adminPassword, setAdminPassword] = useState('');

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

  useEffect(() => {
    const password = prompt('Enter admin password:');
    if (password) {
      setAdminPassword(password);
      fetchWallets(password);
    }
  }, []);

  const fetchWallets = async (password: string) => {
    try {
      const res = await fetch(`${API_URL}/api/admin/blkcoin/wallets`, {
        headers: {
          'X-Admin-Secret': password
        }
      });

      if (res.ok) {
        const data = await res.json();
        setWallets(data);
      } else {
        alert('Unauthorized. Please refresh and enter the correct password.');
      }
    } catch (error) {
      console.error('Error fetching wallets:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdjustBalance = async () => {
    if (!selectedWallet || adjustAmount === 0 || !adjustReason.trim()) {
      alert('Please enter an amount and reason');
      return;
    }

    try {
      const res = await fetch(
        `${API_URL}/api/admin/blkcoin/adjust?user_id=${selectedWallet.user_id}&amount=${adjustAmount}&reason=${encodeURIComponent(adjustReason)}`,
        {
          method: 'POST',
          headers: {
            'X-Admin-Secret': adminPassword
          }
        }
      );

      if (res.ok) {
        alert('Balance adjusted successfully!');
        setShowAdjustModal(false);
        setAdjustAmount(0);
        setAdjustReason('');
        setSelectedWallet(null);
        fetchWallets(adminPassword);
      } else {
        alert('Failed to adjust balance');
      }
    } catch (error) {
      console.error('Error adjusting balance:', error);
      alert('Failed to adjust balance');
    }
  };

  const filteredWallets = wallets.filter(
    (wallet) =>
      wallet.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      wallet.user_id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalCirculating = wallets.reduce((sum, w) => sum + w.balance, 0);
  const totalEarned = wallets.reduce((sum, w) => sum + w.lifetime_earned, 0);
  const totalRedeemed = wallets.reduce((sum, w) => sum + w.lifetime_redeemed, 0);
  const activeWallets = wallets.filter((w) => w.balance > 0).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#111111] flex items-center justify-center">
        <div className="text-[#C5A14E] text-xl">Loading BlkCoin data...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#111111] py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[#C5A14E] mb-2">
            BlkCoin™ Admin Dashboard
          </h1>
          <p className="text-white/80">
            Manage BlkCoin wallets, view transactions, and adjust balances
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-[#C5A14E] to-[#8B7355] p-6 rounded-xl">
            <Coins className="w-8 h-8 text-white mb-3" />
            <div className="text-white text-3xl font-bold">
              {totalCirculating.toFixed(0)}
            </div>
            <div className="text-white/80 text-sm">Total Circulating</div>
          </div>

          <div className="bg-[#1A1A1A] border border-green-500/30 p-6 rounded-xl">
            <TrendingUp className="w-8 h-8 text-green-500 mb-3" />
            <div className="text-white text-3xl font-bold">
              {totalEarned.toFixed(0)}
            </div>
            <div className="text-white/60 text-sm">Total Earned</div>
          </div>

          <div className="bg-[#1A1A1A] border border-red-500/30 p-6 rounded-xl">
            <DollarSign className="w-8 h-8 text-red-500 mb-3" />
            <div className="text-white text-3xl font-bold">
              {totalRedeemed.toFixed(0)}
            </div>
            <div className="text-white/60 text-sm">Total Redeemed</div>
          </div>

          <div className="bg-[#1A1A1A] border border-blue-500/30 p-6 rounded-xl">
            <Users className="w-8 h-8 text-blue-500 mb-3" />
            <div className="text-white text-3xl font-bold">
              {activeWallets} / {wallets.length}
            </div>
            <div className="text-white/60 text-sm">Active Wallets</div>
          </div>
        </div>

        <div className="bg-[#1A1A1A] border border-[#C5A14E]/30 rounded-xl p-6 mb-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by email or user ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-[#111111] border border-[#C5A14E]/30 rounded-lg pl-10 pr-4 py-3 text-white focus:outline-none focus:border-[#C5A14E]"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#C5A14E]/30">
                  <th className="text-left text-[#C5A14E] font-semibold py-3 px-4">User ID</th>
                  <th className="text-left text-[#C5A14E] font-semibold py-3 px-4">Email</th>
                  <th className="text-right text-[#C5A14E] font-semibold py-3 px-4">Balance</th>
                  <th className="text-right text-[#C5A14E] font-semibold py-3 px-4">Earned</th>
                  <th className="text-right text-[#C5A14E] font-semibold py-3 px-4">Redeemed</th>
                  <th className="text-center text-[#C5A14E] font-semibold py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredWallets.map((wallet) => (
                  <tr
                    key={wallet.id}
                    className="border-b border-[#C5A14E]/10 hover:bg-[#111111] transition-colors"
                  >
                    <td className="py-4 px-4 text-white/80 font-mono text-sm">
                      {wallet.user_id}
                    </td>
                    <td className="py-4 px-4 text-white">{wallet.email}</td>
                    <td className="py-4 px-4 text-right">
                      <span className="text-[#C5A14E] font-bold text-lg">
                        {wallet.balance.toFixed(0)}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right text-green-500">
                      +{wallet.lifetime_earned.toFixed(0)}
                    </td>
                    <td className="py-4 px-4 text-right text-red-500">
                      -{wallet.lifetime_redeemed.toFixed(0)}
                    </td>
                    <td className="py-4 px-4 text-center">
                      <button
                        onClick={() => {
                          setSelectedWallet(wallet);
                          setShowAdjustModal(true);
                        }}
                        className="bg-[#C5A14E] hover:bg-[#8B7355] text-white px-4 py-2 rounded-lg text-sm transition-colors"
                      >
                        Adjust
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredWallets.length === 0 && (
              <div className="text-center text-white/60 py-12">
                No wallets found matching your search.
              </div>
            )}
          </div>
        </div>
      </div>

      {showAdjustModal && selectedWallet && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-[#1A1A1A] border border-[#C5A14E]/30 rounded-xl p-8 max-w-md w-full">
            <h3 className="text-2xl font-bold text-[#C5A14E] mb-4">
              Adjust Balance
            </h3>
            <p className="text-white/80 mb-6">
              User: {selectedWallet.email}
              <br />
              Current Balance: {selectedWallet.balance.toFixed(0)} BlkCoins
            </p>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-[#C5A14E] font-semibold mb-2">
                  Amount (positive to add, negative to subtract)
                </label>
                <input
                  type="number"
                  value={adjustAmount}
                  onChange={(e) => setAdjustAmount(parseFloat(e.target.value) || 0)}
                  className="w-full bg-[#111111] border border-[#C5A14E]/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#C5A14E]"
                  placeholder="Enter amount..."
                />
              </div>

              <div>
                <label className="block text-[#C5A14E] font-semibold mb-2">
                  Reason
                </label>
                <textarea
                  value={adjustReason}
                  onChange={(e) => setAdjustReason(e.target.value)}
                  rows={3}
                  className="w-full bg-[#111111] border border-[#C5A14E]/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#C5A14E]"
                  placeholder="Explain why you're adjusting this balance..."
                />
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={handleAdjustBalance}
                className="flex-1 bg-[#C5A14E] hover:bg-[#8B7355] text-white font-bold py-3 px-6 rounded-lg transition-colors"
              >
                Confirm Adjustment
              </button>
              <button
                onClick={() => {
                  setShowAdjustModal(false);
                  setAdjustAmount(0);
                  setAdjustReason('');
                  setSelectedWallet(null);
                }}
                className="px-6 py-3 border border-[#C5A14E]/30 text-[#C5A14E] hover:bg-[#C5A14E]/10 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
