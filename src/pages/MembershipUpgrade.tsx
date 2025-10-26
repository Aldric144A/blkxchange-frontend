import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, Crown, Star } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const tiers = [
  {
    name: 'Basic',
    price: 0,
    period: 'Forever Free',
    icon: null,
    color: 'gray',
    features: [
      'Standard listing placement',
      'Basic profile page',
      'Email notifications',
      'Community support',
      'Standard search visibility'
    ],
    limitations: [
      'No priority placement',
      'No analytics dashboard',
      'No monthly reports'
    ]
  },
  {
    name: 'Featured',
    price: 49,
    period: 'per month',
    icon: Star,
    color: 'gold',
    popular: true,
    features: [
      'Priority search placement',
      'Featured badge on profile',
      'Basic analytics dashboard',
      'Email & phone support',
      'Enhanced profile customization',
      'Monthly performance summary'
    ],
    limitations: [
      'Limited to 10 top locations',
      'Standard reporting frequency'
    ]
  },
  {
    name: 'Elite',
    price: 99,
    period: 'per month',
    icon: Crown,
    color: 'gradient',
    features: [
      'Top priority placement',
      'Elite crown badge',
      'Advanced analytics dashboard',
      'Geographic heatmap',
      'Conversion tracking',
      'Monthly detailed reports',
      'Priority email & phone support',
      'A/B testing tools',
      'Custom profile URL',
      'Featured in newsletters',
      'Quarterly strategy consultation'
    ],
    limitations: []
  }
];

export default function MembershipUpgrade() {
  const [selectedTier, setSelectedTier] = useState<string | null>(null);
  const { toast } = useToast();

  const handleUpgrade = (tierName: string, price: number) => {
    if (price === 0) {
      toast({
        title: "Already on Basic",
        description: "You're currently on the Basic (Free) plan.",
      });
      return;
    }

    setSelectedTier(tierName);
    
    toast({
      title: "Stripe Integration Coming Soon",
      description: `Upgrade to ${tierName} ($${price}/mo) will be available once Stripe is configured.`,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-black to-brand-charcoal py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-brand-gold mb-4">
            Upgrade Your Membership
          </h1>
          <p className="text-xl text-brand-ivory max-w-2xl mx-auto">
            Choose the plan that fits your business goals and unlock powerful features to grow your presence on BlkXchange™
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {tiers.map((tier) => {
            const Icon = tier.icon;
            const isPopular = tier.popular;
            
            return (
              <Card
                key={tier.name}
                className={`relative ${
                  isPopular
                    ? 'border-4 border-brand-gold shadow-2xl transform scale-105'
                    : 'border-2 border-gray-300'
                } ${selectedTier === tier.name ? 'ring-4 ring-brand-gold' : ''}`}
              >
                {isPopular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-brand-gold text-brand-black px-4 py-1 rounded-full text-sm font-bold">
                      MOST POPULAR
                    </span>
                  </div>
                )}
                
                <CardHeader className="text-center pb-4">
                  {Icon && (
                    <div className="flex justify-center mb-4">
                      {tier.color === 'gradient' ? (
                        <div className="w-16 h-16 rounded-full bg-gradient-to-r from-brand-gold to-yellow-300 flex items-center justify-center">
                          <Icon className="w-8 h-8 text-brand-black" />
                        </div>
                      ) : (
                        <div className="w-16 h-16 rounded-full bg-brand-gold flex items-center justify-center">
                          <Icon className="w-8 h-8 text-white" />
                        </div>
                      )}
                    </div>
                  )}
                  
                  <CardTitle className="text-2xl font-bold text-brand-black mb-2">
                    {tier.name}
                  </CardTitle>
                  
                  <div className="mb-4">
                    <span className="text-4xl font-bold text-brand-black">
                      ${tier.price}
                    </span>
                    <span className="text-gray-600 ml-2">{tier.period}</span>
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="space-y-4 mb-6">
                    <div>
                      <h4 className="font-semibold text-brand-black mb-2">Features:</h4>
                      <ul className="space-y-2">
                        {tier.features.map((feature, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                            <span className="text-sm text-gray-700">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <Button
                    onClick={() => handleUpgrade(tier.name, tier.price)}
                    className={`w-full ${
                      isPopular
                        ? 'bg-brand-gold text-brand-black hover:bg-brand-gold/90'
                        : 'bg-brand-black text-white hover:bg-brand-black/90'
                    }`}
                  >
                    {tier.price === 0 ? 'Current Plan' : `Upgrade to ${tier.name}`}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Card className="bg-brand-ivory border-2 border-brand-gold">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold text-brand-black mb-4">
              Why Upgrade?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-brand-black mb-2">📈 Increase Visibility</h3>
                <p className="text-gray-700 text-sm">
                  Featured and Elite members appear at the top of search results, getting up to 5x more profile views than Basic members.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-brand-black mb-2">📊 Track Performance</h3>
                <p className="text-gray-700 text-sm">
                  Access detailed analytics to understand your audience, track conversions, and optimize your profile for better results.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-brand-black mb-2">🎯 Generate More Leads</h3>
                <p className="text-gray-700 text-sm">
                  Premium badges build trust and credibility, leading to higher click-through rates and more consultation bookings.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-brand-black mb-2">💼 Professional Support</h3>
                <p className="text-gray-700 text-sm">
                  Get priority support and quarterly strategy consultations to maximize your ROI on the platform.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="text-center mt-12">
          <p className="text-brand-ivory text-sm">
            All plans include access to the BlkXchange™ marketplace and community.
            <br />
            Cancel anytime. No hidden fees.
          </p>
        </div>
      </div>
    </div>
  );
}
