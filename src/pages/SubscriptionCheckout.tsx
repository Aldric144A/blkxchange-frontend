import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CreditCard, Check, Crown, Sparkles } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'https://app-tcqwzext.fly.dev';

interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  interval: string;
  features: string[];
  icon: React.ReactNode;
  popular?: boolean;
}

const plans: SubscriptionPlan[] = [
  {
    id: 'premium',
    name: 'Premium',
    price: 29.99,
    interval: 'month',
    icon: <Crown className="w-8 h-8 text-brand-gold" />,
    features: [
      'Enhanced vendor dashboard',
      'Priority customer support',
      'Advanced analytics',
      'Featured product placement',
      'Monthly performance reports',
      'Access to vendor webinars'
    ]
  },
  {
    id: 'elite',
    name: 'Elite 360',
    price: 99.99,
    interval: 'month',
    icon: <Sparkles className="w-8 h-8 text-brand-gold" />,
    popular: true,
    features: [
      'All Premium features',
      'Full BlkXchange 360™ access',
      'AI-powered product descriptions',
      'AI mentor matching',
      'Exclusive networking events',
      'Dedicated account manager',
      'Custom branding options',
      'API access for integrations'
    ]
  }
];

export default function SubscriptionCheckout() {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    email: '',
    userId: ''
  });

  const handleSubscribe = async (planId: string) => {
    if (!formData.email || !formData.userId) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_URL}/api/payments/subscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          user_id: formData.userId,
          email: formData.email,
          plan_type: planId
        })
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(true);
        setSelectedPlan(planId);
      } else {
        setError(data.message || 'Subscription failed');
      }
    } catch (err) {
      setError('Failed to create subscription. Please try again.');
      console.error('Subscription error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-brand-ivory py-12">
        <div className="max-w-2xl mx-auto px-4">
          <Card className="border-2 border-brand-gold">
            <CardContent className="p-12 text-center">
              <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Check className="w-12 h-12 text-emerald-600" />
              </div>
              <h2 className="text-3xl font-heading font-bold text-brand-black mb-4">
                Subscription Activated!
              </h2>
              <p className="text-lg text-gray-700 mb-6">
                Your {plans.find(p => p.id === selectedPlan)?.name} subscription has been successfully activated.
              </p>
              <p className="text-gray-600 mb-8">
                You now have access to all premium features. Check your email for confirmation details.
              </p>
              <button
                onClick={() => window.location.href = '/vendor-dashboard'}
                className="bg-brand-gold text-white px-8 py-3 rounded-lg font-semibold hover:bg-opacity-90 transition-all"
              >
                Go to Dashboard
              </button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-ivory py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-heading font-bold text-brand-black mb-4">
            Choose Your Plan
          </h1>
          <p className="text-xl text-gray-700">
            Unlock premium features and grow your business on BlkXchange™
          </p>
        </div>

        {error && (
          <div className="max-w-2xl mx-auto mb-8 bg-red-50 border-l-4 border-red-500 p-4 rounded">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {plans.map((plan) => (
            <Card
              key={plan.id}
              className={`relative border-2 ${
                plan.popular ? 'border-brand-gold shadow-xl' : 'border-gray-300'
              } hover:shadow-lg transition-all`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-brand-gold text-white px-4 py-1 rounded-full text-sm font-semibold">
                    Most Popular
                  </span>
                </div>
              )}
              <CardHeader className="text-center pb-4">
                <div className="flex justify-center mb-4">{plan.icon}</div>
                <CardTitle className="text-2xl font-heading">{plan.name}</CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-brand-black">
                    ${plan.price}
                  </span>
                  <span className="text-gray-600">/{plan.interval}</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => setSelectedPlan(plan.id)}
                  className={`w-full py-3 rounded-lg font-semibold transition-all ${
                    plan.popular
                      ? 'bg-brand-gold text-white hover:bg-opacity-90'
                      : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                  }`}
                >
                  Select {plan.name}
                </button>
              </CardContent>
            </Card>
          ))}
        </div>

        {selectedPlan && (
          <Card className="max-w-2xl mx-auto border-2 border-brand-gold">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-6 h-6 text-brand-gold" />
                Complete Your Subscription
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
                    value={formData.userId}
                    onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-gold focus:border-transparent"
                    placeholder="Your user ID"
                    required
                  />
                </div>
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
                  <p className="text-sm text-yellow-800">
                    <strong>Test Mode:</strong> This is a demo subscription. No actual charges will be made.
                  </p>
                </div>
                <button
                  onClick={() => handleSubscribe(selectedPlan)}
                  disabled={loading}
                  className="w-full bg-brand-gold text-white py-3 rounded-lg font-semibold hover:bg-opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Processing...' : `Subscribe to ${plans.find(p => p.id === selectedPlan)?.name}`}
                </button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
