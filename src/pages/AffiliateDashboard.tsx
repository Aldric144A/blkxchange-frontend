import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link2, TrendingUp, Users, DollarSign, Copy, Check } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'https://app-tcqwzext.fly.dev';

interface AffiliateStats {
  id: string;
  user_id: string;
  email: string;
  referral_code: string;
  referral_url: string;
  clicks: number;
  conversions: number;
  revenue_generated: number;
  commission_earned: number;
  commission_rate: number;
  status: string;
  created_at: string;
}

export default function AffiliateDashboard() {
  const [affiliate, setAffiliate] = useState<AffiliateStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [userId, setUserId] = useState('');
  const [email, setEmail] = useState('');
  const [showSignup, setShowSignup] = useState(true);
  const [conversionRate, setConversionRate] = useState(0);
  const [avgOrderValue, setAvgOrderValue] = useState(0);

  const handleSignup = async () => {
    if (!userId || !email) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_URL}/api/payments/affiliate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          user_id: userId,
          email: email
        })
      });

      const data = await response.json();

      if (data.success) {
        setAffiliate(data.affiliate);
        setShowSignup(false);
        loadAffiliateStats(userId);
      } else {
        setError(data.message || 'Failed to create affiliate account');
      }
    } catch (err) {
      setError('Failed to create affiliate account. Please try again.');
      console.error('Affiliate signup error:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadAffiliateStats = async (uid: string) => {
    try {
      const response = await fetch(`${API_URL}/api/payments/affiliate/${uid}`);
      const data = await response.json();

      if (data.success) {
        setAffiliate(data.affiliate);
        setConversionRate(data.conversion_rate || 0);
        setAvgOrderValue(data.avg_order_value || 0);
      }
    } catch (err) {
      console.error('Failed to load affiliate stats:', err);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (showSignup) {
    return (
      <div className="min-h-screen bg-brand-ivory py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-heading font-bold text-brand-black mb-4">
              Join the BlkXchange™ Affiliate Program
            </h1>
            <p className="text-xl text-gray-700">
              Earn 10% commission on every sale you refer
            </p>
          </div>

          <Card className="border-2 border-brand-gold mb-8">
            <CardHeader className="bg-gradient-to-r from-emerald-600 to-yellow-600">
              <CardTitle className="text-2xl text-white">Program Benefits</CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="flex items-start gap-3">
                  <DollarSign className="w-6 h-6 text-brand-gold flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-lg mb-2">10% Commission Rate</h3>
                    <p className="text-gray-700">Earn 10% on every sale from your referrals</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Link2 className="w-6 h-6 text-brand-gold flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-lg mb-2">Unique Referral Link</h3>
                    <p className="text-gray-700">Get your personalized tracking link</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <TrendingUp className="w-6 h-6 text-brand-gold flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-lg mb-2">Real-Time Analytics</h3>
                    <p className="text-gray-700">Track clicks, conversions, and earnings</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Users className="w-6 h-6 text-brand-gold flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-lg mb-2">Community Impact</h3>
                    <p className="text-gray-700">Support Black-owned businesses while earning</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {error && (
            <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded">
              <p className="text-red-700">{error}</p>
            </div>
          )}

          <Card className="border-2 border-gray-300">
            <CardHeader>
              <CardTitle>Sign Up for Affiliate Program</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-gold focus:border-transparent"
                    placeholder="your@email.com"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    User ID *
                  </label>
                  <input
                    type="text"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-gold focus:border-transparent"
                    placeholder="Your user ID"
                    required
                  />
                </div>
                <button
                  onClick={handleSignup}
                  disabled={loading}
                  className="w-full bg-brand-gold text-white py-3 rounded-lg font-semibold hover:bg-opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Creating Account...' : 'Join Affiliate Program'}
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!affiliate) {
    return (
      <div className="min-h-screen bg-brand-ivory py-12 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-gold mx-auto mb-4"></div>
          <p className="text-gray-600">Loading affiliate dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-ivory py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-heading font-bold text-brand-black mb-2">
            Affiliate Dashboard
          </h1>
          <p className="text-xl text-gray-700">
            Track your referrals and earnings
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="border-2 border-gray-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <Users className="w-8 h-8 text-blue-600" />
                <span className="text-3xl font-bold text-brand-black">{affiliate.clicks}</span>
              </div>
              <p className="text-gray-600 font-semibold">Total Clicks</p>
            </CardContent>
          </Card>

          <Card className="border-2 border-gray-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <TrendingUp className="w-8 h-8 text-emerald-600" />
                <span className="text-3xl font-bold text-brand-black">{affiliate.conversions}</span>
              </div>
              <p className="text-gray-600 font-semibold">Conversions</p>
            </CardContent>
          </Card>

          <Card className="border-2 border-gray-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <DollarSign className="w-8 h-8 text-brand-gold" />
                <span className="text-3xl font-bold text-brand-black">
                  ${affiliate.commission_earned.toFixed(2)}
                </span>
              </div>
              <p className="text-gray-600 font-semibold">Commission Earned</p>
            </CardContent>
          </Card>

          <Card className="border-2 border-gray-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <TrendingUp className="w-8 h-8 text-purple-600" />
                <span className="text-3xl font-bold text-brand-black">{conversionRate}%</span>
              </div>
              <p className="text-gray-600 font-semibold">Conversion Rate</p>
            </CardContent>
          </Card>
        </div>

        {/* Referral Link Card */}
        <Card className="border-2 border-brand-gold mb-8">
          <CardHeader className="bg-gradient-to-r from-emerald-600 to-yellow-600">
            <CardTitle className="text-2xl text-white flex items-center gap-2">
              <Link2 className="w-6 h-6" />
              Your Referral Link
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Referral Code
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={affiliate.referral_code}
                    readOnly
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                  />
                  <button
                    onClick={() => copyToClipboard(affiliate.referral_code)}
                    className="px-4 py-2 bg-brand-gold text-white rounded-lg hover:bg-opacity-90 transition-all flex items-center gap-2"
                  >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Referral URL
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={affiliate.referral_url}
                    readOnly
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                  />
                  <button
                    onClick={() => copyToClipboard(affiliate.referral_url)}
                    className="px-4 py-2 bg-brand-gold text-white rounded-lg hover:bg-opacity-90 transition-all flex items-center gap-2"
                  >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Performance Metrics */}
        <Card className="border-2 border-gray-300">
          <CardHeader>
            <CardTitle>Performance Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-2">Commission Rate</p>
                <p className="text-2xl font-bold text-brand-gold">{affiliate.commission_rate}%</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-2">Revenue Generated</p>
                <p className="text-2xl font-bold text-emerald-600">
                  ${affiliate.revenue_generated.toFixed(2)}
                </p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-2">Avg Order Value</p>
                <p className="text-2xl font-bold text-blue-600">${avgOrderValue.toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
