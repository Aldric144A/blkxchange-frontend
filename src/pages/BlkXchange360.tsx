import { Link } from 'react-router-dom';
import { BookOpen, Award, History, MessageSquare, Crown } from 'lucide-react';

const BlkXchange360 = () => {


  const membershipTiers = [
    {
      name: 'Free',
      price: '$0',
      period: 'forever',
      features: [
        'Access to basic Wealth Hub modules',
        'View Legacy Wall tributes',
        'Browse History Window',
        'Read Community Forum posts',
      ],
      color: 'from-gray-600 to-gray-800',
      buttonText: 'Current Plan',
      buttonDisabled: true,
    },
    {
      name: 'Premium',
      price: '$9.99',
      period: 'per month',
      features: [
        'All Free features',
        'Access to Premium Wealth Hub modules',
        'Submit Legacy Wall tributes',
        'Post in Community Forum',
        'Priority support',
      ],
      color: 'from-emerald-600 to-emerald-800',
      buttonText: 'Upgrade to Premium',
      buttonDisabled: false,
      popular: true,
    },
    {
      name: 'Elite',
      price: '$99',
      period: 'per month',
      features: [
        'All Premium features',
        'Access to Elite Wealth Hub modules',
        'Featured Legacy Wall placement',
        'Elite Lounge exclusive forum',
        'Monthly 1-on-1 coaching call',
        'Exclusive networking events',
      ],
      color: 'from-yellow-600 to-yellow-800',
      buttonText: 'Upgrade to Elite',
      buttonDisabled: false,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-emerald-950">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/20 to-yellow-600/20 animate-pulse"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-600 to-yellow-600 rounded-full text-white text-sm font-semibold mb-6 animate-fade-in">
            <Crown className="w-4 h-4" />
            <span>BlkXchange 360™ Premium Experience</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-yellow-400 mb-6 animate-fade-in-up">
            Elevate Your Journey
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            Empowering Ownership. Elevating Community. Building Generational Wealth.
          </p>
          <p className="text-lg text-gray-400 mb-12 max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            BlkXchange 360™ is your premium gateway to wealth education, legacy preservation, Black history, and community connection.
          </p>
        </div>
      </div>

      {/* Membership Tiers */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-4">
          Choose Your Membership
        </h2>
        <p className="text-center text-gray-400 mb-12 max-w-2xl mx-auto">
          Select the plan that fits your journey. All plans support our mission to build generational wealth in the Black community.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {membershipTiers.map((tier, index) => (
            <div
              key={tier.name}
              className={`relative bg-gray-900 rounded-2xl p-8 border-2 ${
                tier.popular ? 'border-emerald-500 scale-105' : 'border-gray-800'
              } hover:border-emerald-600 transition-all duration-300 animate-scale-in`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {tier.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-emerald-600 to-yellow-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                    Most Popular
                  </span>
                </div>
              )}
              
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-white mb-2">{tier.name}</h3>
                <div className="flex items-baseline justify-center gap-2">
                  <span className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-yellow-400">
                    {tier.price}
                  </span>
                  <span className="text-gray-400">/ {tier.period}</span>
                </div>
              </div>

              <ul className="space-y-4 mb-8">
                {tier.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-gray-300">
                    <svg className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link
                to={tier.buttonDisabled ? '#' : '/blkxchange360/upgrade'}
                className={`block w-full py-3 px-6 rounded-lg text-center font-semibold transition-all duration-300 ${
                  tier.buttonDisabled
                    ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                    : `bg-gradient-to-r ${tier.color} text-white hover:shadow-lg hover:scale-105`
                }`}
                onClick={(e) => tier.buttonDisabled && e.preventDefault()}
              >
                {tier.buttonText}
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Features Preview */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-12">
          What's Inside BlkXchange 360™
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Link
            to="/blkxchange360/wealth-hub"
            className="bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-xl border border-gray-700 hover:border-emerald-500 transition-all duration-300 hover:scale-105 group"
          >
            <div className="w-12 h-12 bg-gradient-to-r from-emerald-600 to-yellow-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Wealth Hub</h3>
            <p className="text-gray-400 text-sm">
              Master entrepreneurship, investing, leadership, and financial literacy with expert-led modules.
            </p>
          </Link>

          <Link
            to="/blkxchange360/legacy-wall"
            className="bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-xl border border-gray-700 hover:border-emerald-500 transition-all duration-300 hover:scale-105 group"
          >
            <div className="w-12 h-12 bg-gradient-to-r from-emerald-600 to-yellow-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Award className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Legacy Wall</h3>
            <p className="text-gray-400 text-sm">
              Honor and preserve the stories of our ancestors, family members, and community heroes.
            </p>
          </Link>

          <Link
            to="/blkxchange360/history-window"
            className="bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-xl border border-gray-700 hover:border-emerald-500 transition-all duration-300 hover:scale-105 group"
          >
            <div className="w-12 h-12 bg-gradient-to-r from-emerald-600 to-yellow-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <History className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">History Window</h3>
            <p className="text-gray-400 text-sm">
              Explore an interactive timeline of Black history, achievements, and contributions to the world.
            </p>
          </Link>

          <Link
            to="/blkxchange360/community"
            className="bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-xl border border-gray-700 hover:border-emerald-500 transition-all duration-300 hover:scale-105 group"
          >
            <div className="w-12 h-12 bg-gradient-to-r from-emerald-600 to-yellow-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <MessageSquare className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Community Forum</h3>
            <p className="text-gray-400 text-sm">
              Connect with like-minded entrepreneurs, share insights, and build lasting relationships.
            </p>
          </Link>
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <div className="bg-gradient-to-r from-emerald-900/50 to-yellow-900/50 rounded-2xl p-12 border border-emerald-700">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Elevate Your Journey?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands of Black entrepreneurs building generational wealth and preserving our legacy.
          </p>
          <Link
            to="/blkxchange360/upgrade"
            className="inline-block bg-gradient-to-r from-emerald-600 to-yellow-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:shadow-lg hover:scale-105 transition-all duration-300"
          >
            Start Your Premium Journey
          </Link>
        </div>
      </div>

      {/* Demo Notice */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-yellow-900/20 border border-yellow-700 rounded-lg p-4 text-center">
          <p className="text-yellow-400 text-sm">
            <strong>Stripe Test Mode:</strong> This is a demo environment. No real payments will be processed.
          </p>
        </div>
      </div>
    </div>
  );
};

export default BlkXchange360;
