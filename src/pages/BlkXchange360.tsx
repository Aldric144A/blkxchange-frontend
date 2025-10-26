import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, 
  GraduationCap, 
  TrendingUp, 
  Users, 
  BookOpen, 
  Award,
  ArrowRight,
  Check,
  Crown,
  Shield
} from 'lucide-react';

export default function BlkXchange360() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showComingSoon, setShowComingSoon] = useState(false);

  const handleComingSoonClick = () => {
    setShowComingSoon(true);
    setTimeout(() => setShowComingSoon(false), 3000);
  };

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: Sparkles },
    { id: 'wealth', label: 'Wealth Hub', icon: TrendingUp, comingSoon: true },
    { id: 'legacy', label: 'Legacy Wall', icon: Award, comingSoon: true },
    { id: 'history', label: 'History Window', icon: BookOpen, comingSoon: true },
    { id: 'community', label: 'Community Forum', icon: Users, comingSoon: true },
  ];

  const membershipTiers = [
    {
      name: 'Free Access',
      price: '$0',
      period: 'forever',
      description: 'Basic Directory + Marketplace',
      features: [
        'Browse Marketplace',
        'View Professional Directory',
        'Access Community Events',
        'Read Black Chronicle Articles',
        'Basic Search Features'
      ],
      icon: Shield,
      gradient: 'from-gray-600 to-gray-800',
      available: true
    },
    {
      name: 'Premium',
      price: '$9.99',
      period: '/month',
      description: 'Education, Wealth Tools, Legacy Hub',
      features: [
        'All Free Features',
        'Access to Learning Hub',
        'Wealth Building Tools',
        'Legacy Wall Contributions',
        'Priority Support',
        'Exclusive Webinars'
      ],
      icon: Crown,
      gradient: 'from-[#00A86B] to-[#023020]',
      available: false,
      badge: 'Coming Soon'
    },
    {
      name: 'Elite',
      price: '$99',
      period: '/month',
      description: 'Business Analytics, Investor Access, Mentorship',
      features: [
        'All Premium Features',
        'Business Analytics Dashboard',
        'Angel Investor Network Access',
        '1-on-1 Mentorship Sessions',
        'Advanced Market Insights',
        'VIP Event Access',
        'Featured Listings'
      ],
      icon: Sparkles,
      gradient: 'from-[#C5A14E] to-[#8B7355]',
      available: false,
      badge: 'Coming Soon'
    }
  ];

  return (
    <div className="min-h-screen bg-[#111111]">
      {/* Coming Soon Modal */}
      {showComingSoon && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-gradient-to-br from-[#1A1A1A] to-[#023020] p-8 rounded-2xl border-2 border-[#C5A14E] max-w-md mx-4 animate-scale-in">
            <div className="text-center">
              <Sparkles className="w-16 h-16 text-[#C5A14E] mx-auto mb-4 animate-pulse" />
              <h3 className="text-2xl font-bold text-[#C5A14E] mb-2">Coming Soon</h3>
              <p className="text-white/80">
                This feature is under development and will be available in Phase 2.
                Stay tuned for updates!
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Hero Banner */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#000000] via-[#023020] to-[#1A1A1A] py-20 px-6">
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNDNUExNEUiIGZpbGwtb3BhY2l0eT0iMC40Ij48cGF0aCBkPSJNMzYgMzRjMC0yLjIxLTEuNzktNC00LTRzLTQgMS43OS00IDQgMS43OSA0IDQgNCA0LTEuNzkgNC00em0wLTEwYzAtMi4yMS0xLjc5LTQtNC00cy00IDEuNzktNCA0IDEuNzkgNCA0IDQgNC0xLjc5IDQtNHptMC0xMGMwLTIuMjEtMS43OS00LTQtNHMtNCAxLjc5LTQgNCAxLjc5IDQgNCA0IDQtMS43OSA0LTR6Ii8+PC9nPjwvZz48L3N2Zz4=')] animate-slide"></div>
        </div>

        <div className="relative max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-[#C5A14E]/20 border border-[#C5A14E] rounded-full px-6 py-2 mb-6 animate-fade-in">
            <Sparkles className="w-5 h-5 text-[#C5A14E]" />
            <span className="text-[#C5A14E] font-semibold">Premium Experience</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in-up">
            <span className="bg-gradient-to-r from-[#C5A14E] via-[#FFD700] to-[#C5A14E] bg-clip-text text-transparent">
              BlkXchange 360™
            </span>
          </h1>
          
          <p className="text-2xl md:text-3xl text-white font-semibold mb-4 animate-fade-in-up animation-delay-200">
            Building the Future of Black Excellence
          </p>
          
          <p className="text-xl text-white/80 max-w-3xl mx-auto mb-8 animate-fade-in-up animation-delay-400">
            Technology, Wealth, and Legacy for the Next Generation
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up animation-delay-600">
            <button
              onClick={handleComingSoonClick}
              className="bg-gradient-to-r from-[#00A86B] to-[#023020] text-white px-8 py-4 rounded-lg font-semibold text-lg hover:scale-105 transition-transform flex items-center justify-center gap-2"
            >
              Join BlkXchange 360
              <ArrowRight className="w-5 h-5" />
            </button>
            <Link
              to="/vendor-apply"
              className="bg-white/10 border-2 border-[#C5A14E] text-[#C5A14E] px-8 py-4 rounded-lg font-semibold text-lg hover:bg-[#C5A14E]/10 transition-colors flex items-center justify-center gap-2"
            >
              Partner with Us
              <Users className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Declaration of Purpose */}
      <section className="py-16 px-6 bg-[#1A1A1A]">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-[#023020] to-[#1A1A1A] border-4 border-[#C5A14E] rounded-2xl p-8 md:p-12 shadow-2xl relative overflow-hidden">
            {/* Decorative Corner Elements */}
            <div className="absolute top-0 left-0 w-20 h-20 border-t-4 border-l-4 border-[#C5A14E] rounded-tl-2xl"></div>
            <div className="absolute bottom-0 right-0 w-20 h-20 border-b-4 border-r-4 border-[#C5A14E] rounded-br-2xl"></div>
            
            <div className="relative">
              <h2 className="text-3xl md:text-4xl font-bold text-[#C5A14E] mb-6 text-center">
                Declaration of Purpose
              </h2>
              
              <div className="space-y-6 text-white/90 text-lg leading-relaxed">
                <p className="italic">
                  "To the elders who paved the way with sacrifice and strength — we honor you. 
                  To the youth who will carry the torch forward — we empower you."
                </p>
                
                <p>
                  BlkXchange 360™ is more than a platform. It is a digital revival of Black Wall Street — 
                  a living temple of enterprise, faith, and unity. Every transaction builds wealth. 
                  Every connection strengthens community. Every story preserves legacy.
                </p>
                
                <p>
                  We stand on the shoulders of giants who built empires from nothing, who turned 
                  adversity into excellence, who transformed pain into power. Now, we build in their 
                  honor — not just for profit, but for purpose.
                </p>
                
                <p className="font-semibold text-[#C5A14E]">
                  This is our time. This is our space. This is our future.
                </p>
                
                <p className="text-center text-sm text-white/60 mt-8 italic">
                  "May every line of code written be a brick laid in the foundation of generational restoration."
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Membership Tiers */}
      <section className="py-16 px-6 bg-[#111111]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-[#C5A14E] mb-4">
              Membership Tiers
            </h2>
            <p className="text-xl text-white/80">
              Choose the level that fits your journey
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {membershipTiers.map((tier, index) => {
              const Icon = tier.icon;
              return (
                <div
                  key={tier.name}
                  className={`relative bg-gradient-to-br ${tier.gradient} rounded-2xl p-8 border-2 ${
                    tier.available ? 'border-white/20' : 'border-[#C5A14E]'
                  } hover:scale-105 transition-transform ${
                    index === 1 ? 'md:scale-110' : ''
                  }`}
                >
                  {tier.badge && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <span className="bg-[#C5A14E] text-black px-4 py-1 rounded-full text-sm font-bold">
                        {tier.badge}
                      </span>
                    </div>
                  )}

                  <div className="text-center mb-6">
                    <Icon className="w-12 h-12 text-white mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-white mb-2">{tier.name}</h3>
                    <div className="text-4xl font-bold text-white mb-2">
                      {tier.price}
                      <span className="text-lg font-normal text-white/80">{tier.period}</span>
                    </div>
                    <p className="text-white/80">{tier.description}</p>
                  </div>

                  <ul className="space-y-3 mb-8">
                    {tier.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2 text-white">
                        <Check className="w-5 h-5 text-[#C5A14E] flex-shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={tier.available ? undefined : handleComingSoonClick}
                    className={`w-full py-3 rounded-lg font-semibold transition-colors ${
                      tier.available
                        ? 'bg-white text-black hover:bg-white/90'
                        : 'bg-white/20 text-white hover:bg-white/30 cursor-pointer'
                    }`}
                  >
                    {tier.available ? 'Current Plan' : 'Coming Soon'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Dashboard Framework */}
      <section className="py-16 px-6 bg-[#1A1A1A]">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-[#C5A14E] mb-8 text-center">
            Your 360 Dashboard
          </h2>

          {/* Tab Navigation */}
          <div className="flex flex-wrap gap-2 mb-8 justify-center">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    if (tab.comingSoon) {
                      handleComingSoonClick();
                    } else {
                      setActiveTab(tab.id);
                    }
                  }}
                  className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-[#00A86B] to-[#023020] text-white'
                      : 'bg-white/10 text-white/80 hover:bg-white/20'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {tab.label}
                  {tab.comingSoon && (
                    <span className="text-xs bg-[#C5A14E] text-black px-2 py-0.5 rounded-full">
                      Soon
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Dashboard Content */}
          <div className="bg-gradient-to-br from-[#023020] to-[#1A1A1A] rounded-2xl p-8 md:p-12 border-2 border-[#C5A14E]/30">
            {activeTab === 'dashboard' && (
              <div className="text-center">
                <Sparkles className="w-20 h-20 text-[#C5A14E] mx-auto mb-6 animate-pulse" />
                <h3 className="text-3xl font-bold text-white mb-4">
                  Welcome to BlkXchange 360™
                </h3>
                <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
                  Your journey to building wealth, preserving legacy, and connecting with 
                  the global Black community starts here.
                </p>

                <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                  <button
                    onClick={handleComingSoonClick}
                    className="bg-white/10 hover:bg-white/20 border-2 border-[#C5A14E] rounded-xl p-6 text-left transition-all group"
                  >
                    <GraduationCap className="w-10 h-10 text-[#C5A14E] mb-4 group-hover:scale-110 transition-transform" />
                    <h4 className="text-xl font-bold text-white mb-2">Learning & Wealth Hub</h4>
                    <p className="text-white/70">
                      Access courses, tools, and resources for financial empowerment
                    </p>
                    <span className="inline-block mt-4 text-[#C5A14E] font-semibold">
                      Coming Soon →
                    </span>
                  </button>

                  <button
                    onClick={handleComingSoonClick}
                    className="bg-white/10 hover:bg-white/20 border-2 border-[#C5A14E] rounded-xl p-6 text-left transition-all group"
                  >
                    <Award className="w-10 h-10 text-[#C5A14E] mb-4 group-hover:scale-110 transition-transform" />
                    <h4 className="text-xl font-bold text-white mb-2">Legacy Wall</h4>
                    <p className="text-white/70">
                      Share your story and honor those who paved the way
                    </p>
                    <span className="inline-block mt-4 text-[#C5A14E] font-semibold">
                      Coming Soon →
                    </span>
                  </button>

                  <button
                    onClick={handleComingSoonClick}
                    className="bg-white/10 hover:bg-white/20 border-2 border-[#C5A14E] rounded-xl p-6 text-left transition-all group"
                  >
                    <BookOpen className="w-10 h-10 text-[#C5A14E] mb-4 group-hover:scale-110 transition-transform" />
                    <h4 className="text-xl font-bold text-white mb-2">History Window</h4>
                    <p className="text-white/70">
                      Explore the rich history of Black Wall Street and beyond
                    </p>
                    <span className="inline-block mt-4 text-[#C5A14E] font-semibold">
                      Coming Soon →
                    </span>
                  </button>

                  <button
                    onClick={handleComingSoonClick}
                    className="bg-white/10 hover:bg-white/20 border-2 border-[#C5A14E] rounded-xl p-6 text-left transition-all group"
                  >
                    <Users className="w-10 h-10 text-[#C5A14E] mb-4 group-hover:scale-110 transition-transform" />
                    <h4 className="text-xl font-bold text-white mb-2">Community Forum</h4>
                    <p className="text-white/70">
                      Connect, collaborate, and grow with the community
                    </p>
                    <span className="inline-block mt-4 text-[#C5A14E] font-semibold">
                      Coming Soon →
                    </span>
                  </button>
                </div>

                <div className="mt-12">
                  <Link
                    to="/vendor-apply"
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-[#00A86B] to-[#023020] text-white px-8 py-4 rounded-lg font-semibold text-lg hover:scale-105 transition-transform"
                  >
                    Partner with Us Today
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 px-6 bg-gradient-to-br from-[#023020] to-[#000000]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-[#C5A14E] mb-6">
            Ready to Build Your Legacy?
          </h2>
          <p className="text-xl text-white/80 mb-8">
            Join thousands of Black entrepreneurs, professionals, and visionaries 
            building the future together.
          </p>
          <button
            onClick={handleComingSoonClick}
            className="bg-gradient-to-r from-[#C5A14E] to-[#8B7355] text-black px-10 py-5 rounded-lg font-bold text-xl hover:scale-105 transition-transform inline-flex items-center gap-3"
          >
            <Crown className="w-6 h-6" />
            Get Started with BlkXchange 360
            <ArrowRight className="w-6 h-6" />
          </button>
        </div>
      </section>
    </div>
  );
}
