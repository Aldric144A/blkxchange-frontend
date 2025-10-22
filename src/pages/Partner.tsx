import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, ArrowRight, TrendingUp, Users, Heart, Shield } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function Partner() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSubscribe = (tier: string, price: string) => {
    console.log(`Payment processing simulated for ${tier} tier at ${price}`);
    alert(`Stripe integration coming soon! You selected ${tier} tier at ${price}`);
  };

  const basicPrice = billingCycle === 'monthly' ? '$19.99' : '$199';
  const featuredPrice = billingCycle === 'monthly' ? '$49.99' : '$499';

  return (
    <div className="min-h-screen bg-brand-ivory">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-[#000000] to-[#013220] text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-heading font-bold mb-6">
            Partner With BlkXchange™
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto mb-8">
            Join the movement empowering Black professionals to build wealth, visibility, and legacy — together.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => scrollToSection('pricing')}
              className="bg-[#C5A14E] text-brand-black hover:bg-opacity-90 text-lg px-8 py-6"
            >
              Start Free Trial
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button
              onClick={() => scrollToSection('terms')}
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-brand-black text-lg px-8 py-6"
            >
              View Agreement
            </Button>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-heading font-bold mb-4 text-brand-black">
              Choose Your Partnership Tier
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Your subscription supports visibility, growth, and community reinvestment.
            </p>
            
            {/* Billing Cycle Toggle */}
            <div className="flex items-center justify-center gap-4 mb-8">
              <button
                onClick={() => setBillingCycle('monthly')}
                className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                  billingCycle === 'monthly'
                    ? 'bg-[#C5A14E] text-brand-black'
                    : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingCycle('annual')}
                className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                  billingCycle === 'annual'
                    ? 'bg-[#C5A14E] text-brand-black'
                    : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                }`}
              >
                Annual <span className="text-sm">(Save 17%)</span>
              </button>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Trial Tier */}
            <Card className="border-2 border-gray-300 rounded-2xl shadow-lg hover:shadow-xl transition-all">
              <CardHeader className="bg-gray-100 rounded-t-2xl">
                <CardTitle className="text-2xl text-center text-brand-black">Trial</CardTitle>
                <div className="text-center">
                  <div className="text-4xl font-bold text-brand-black mt-4">Free</div>
                  <div className="text-gray-600">30 Days</div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">1 listing</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Category visibility only</span>
                  </li>
                  <li className="flex items-start gap-2 opacity-50">
                    <span className="text-gray-500">✗ No logo or ad</span>
                  </li>
                  <li className="flex items-start gap-2 opacity-50">
                    <span className="text-gray-500">✗ No analytics access</span>
                  </li>
                </ul>
                <Button
                  onClick={() => handleSubscribe('Trial', 'Free')}
                  className="w-full bg-gray-400 text-white hover:bg-gray-500"
                >
                  Start Free Trial
                </Button>
              </CardContent>
            </Card>

            {/* Basic Tier */}
            <Card className="border-2 border-[#C5A14E] rounded-2xl shadow-lg hover:shadow-xl transition-all">
              <CardHeader className="bg-[#C5A14E] rounded-t-2xl">
                <CardTitle className="text-2xl text-center text-brand-black">Basic</CardTitle>
                <div className="text-center">
                  <div className="text-4xl font-bold text-brand-black mt-4">{basicPrice}</div>
                  <div className="text-brand-charcoal">{billingCycle === 'monthly' ? 'per month' : 'per year'}</div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Category listing with logo</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">"Visit Website" button</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Profile image & tagline</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Standard placement</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Dashboard analytics (future)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Verified Partner badge</span>
                  </li>
                </ul>
                <Button
                  onClick={() => handleSubscribe('Basic', basicPrice)}
                  className="w-full bg-green-600 text-white hover:bg-green-700"
                >
                  Subscribe — {basicPrice}
                </Button>
              </CardContent>
            </Card>

            {/* Featured Tier */}
            <Card className="border-2 border-[#C5A14E] rounded-2xl shadow-lg hover:shadow-xl transition-all relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-[#C5A14E] text-brand-black px-4 py-1 rounded-full text-sm font-bold">
                MOST POPULAR
              </div>
              <CardHeader className="bg-gradient-to-br from-[#C5A14E] to-[#B39145] rounded-t-2xl">
                <CardTitle className="text-2xl text-center text-brand-black">Featured</CardTitle>
                <div className="text-center">
                  <div className="text-4xl font-bold text-brand-black mt-4">{featuredPrice}</div>
                  <div className="text-brand-charcoal">{billingCycle === 'monthly' ? 'per month' : 'per year'}</div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-[#C5A14E] flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 font-semibold">All Basic benefits +</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-[#C5A14E] flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Homepage & sidebar placement</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-[#C5A14E] flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">"Featured Partner" badge</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-[#C5A14E] flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Priority search placement</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-[#C5A14E] flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Free ad space rotation</span>
                  </li>
                </ul>
                <Button
                  onClick={() => handleSubscribe('Featured', featuredPrice)}
                  className="w-full bg-[#C5A14E] text-brand-black hover:bg-opacity-90"
                >
                  Upgrade to Featured — {featuredPrice}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Community Impact Section */}
      <section className="py-16 bg-[#111111]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-heading font-bold mb-4 text-white">
              How Your Subscription Creates Change
            </h2>
            <p className="text-xl text-gray-400">
              BlkXchange™ reinvests 3% of every subscription directly into education and empowerment.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            {/* Revenue Model Visualization */}
            <Card className="bg-[#1A1A1A] border-[#C5A14E]">
              <CardContent className="p-8">
                <div className="space-y-6">
                  {/* Vendor Earnings */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-[#00A86B]" />
                        <span className="text-white font-semibold">Vendor Earnings</span>
                      </div>
                      <span className="text-[#00A86B] font-bold text-xl">85%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-4">
                      <div className="bg-[#00A86B] h-4 rounded-full" style={{ width: '85%' }}></div>
                    </div>
                  </div>

                  {/* Platform Operations */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center gap-2">
                        <Shield className="w-5 h-5 text-[#C5A14E]" />
                        <span className="text-white font-semibold">Platform Operations</span>
                      </div>
                      <span className="text-[#C5A14E] font-bold text-xl">12%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-4">
                      <div className="bg-[#C5A14E] h-4 rounded-full" style={{ width: '12%' }}></div>
                    </div>
                  </div>

                  {/* Community Impact */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center gap-2">
                        <Heart className="w-5 h-5 text-[#002C3A]" />
                        <span className="text-white font-semibold">Community Impact Fund</span>
                      </div>
                      <span className="text-[#002C3A] font-bold text-xl">3%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-4">
                      <div className="bg-[#002C3A] h-4 rounded-full" style={{ width: '3%' }}></div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 p-4 bg-[#C5A14E] bg-opacity-10 border border-[#C5A14E] rounded-lg">
                  <p className="text-[#C5A14E] text-center font-semibold">
                    Every subscription you pay helps fund HBCUs, scholarships, and nonprofit partners.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Terms of Service Section */}
      <section id="terms" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-heading font-bold mb-4 text-brand-black">
              Service Provider Agreement Overview
            </h2>
          </div>

          <div className="max-w-4xl mx-auto space-y-6">
            <Card className="border-2 border-[#C5A14E]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-6 h-6 text-[#C5A14E]" />
                  1. Authenticity & Compliance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li>All listings must accurately represent your services.</li>
                  <li>Hate speech, fraud, or counterfeit promotion prohibited.</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-2 border-[#C5A14E]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-6 h-6 text-[#C5A14E]" />
                  2. Subscription Fees
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li>Monthly recurring: $19.99 (Basic) or $49.99 (Featured)</li>
                  <li>3% of each subscription supports HBCUs and scholarships</li>
                  <li>Cancel anytime before next billing cycle.</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-2 border-[#C5A14E]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-6 h-6 text-[#C5A14E]" />
                  3. Content Ownership
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li>You retain ownership of all logos, images, and brand names.</li>
                  <li>You grant BlkXchange™ permission to display them for directory visibility.</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-2 border-[#C5A14E]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="w-6 h-6 text-[#C5A14E]" />
                  4. Dispute & Removal Policy
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li>Listings in violation of policy may be suspended or removed.</li>
                  <li>Disputes reviewed internally with fairness and transparency.</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-2 border-[#C5A14E]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ArrowRight className="w-6 h-6 text-[#C5A14E]" />
                  5. Platform Evolution Clause
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li>Pricing or benefits may be updated with 30 days' notice.</li>
                </ul>
              </CardContent>
            </Card>

            <div className="text-center mt-8">
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="bg-[#C5A14E] text-brand-black hover:bg-opacity-90 text-lg px-8 py-6">
                    Read Full Terms
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-heading">
                      BlkXchange™ Service Provider Agreement
                    </DialogTitle>
                    <DialogDescription className="text-left space-y-4 mt-4">
                      <section>
                        <h3 className="text-lg font-semibold text-brand-black mb-2">1. Authenticity & Compliance</h3>
                        <p className="text-gray-700">
                          All listings must accurately represent your services. You agree to provide truthful information
                          about your business, credentials, and offerings. Hate speech, fraud, counterfeit promotion, or
                          any content that violates our community standards is strictly prohibited.
                        </p>
                      </section>

                      <section>
                        <h3 className="text-lg font-semibold text-brand-black mb-2">2. Subscription Fees</h3>
                        <p className="text-gray-700 mb-2">
                          BlkXchange™ operates on a subscription-based model:
                        </p>
                        <ul className="list-disc pl-6 space-y-1 text-gray-700">
                          <li>Trial: Free for 30 days (limited features)</li>
                          <li>Basic: $19.99/month or $199/year</li>
                          <li>Featured: $49.99/month or $499/year</li>
                        </ul>
                        <p className="text-gray-700 mt-2">
                          3% of each subscription supports HBCUs, scholarships, and nonprofit partners through the
                          BlkXchange™ Community Impact Fund. You may cancel your subscription at any time before the
                          next billing cycle.
                        </p>
                      </section>

                      <section>
                        <h3 className="text-lg font-semibold text-brand-black mb-2">3. Content Ownership</h3>
                        <p className="text-gray-700">
                          You retain full ownership of all logos, images, brand names, and content you upload to
                          BlkXchange™. By creating a listing, you grant BlkXchange™ a non-exclusive, worldwide license
                          to display your content for the purpose of directory visibility and marketing the platform.
                        </p>
                      </section>

                      <section>
                        <h3 className="text-lg font-semibold text-brand-black mb-2">4. Dispute & Removal Policy</h3>
                        <p className="text-gray-700">
                          Listings found in violation of our policies may be suspended or removed without prior notice.
                          All disputes are reviewed internally with fairness and transparency. You may appeal any
                          suspension by contacting support@blkxchange.com.
                        </p>
                      </section>

                      <section>
                        <h3 className="text-lg font-semibold text-brand-black mb-2">5. Platform Evolution Clause</h3>
                        <p className="text-gray-700">
                          BlkXchange™ reserves the right to update pricing, features, or subscription benefits with
                          30 days' advance notice to all active subscribers. We are committed to transparency and will
                          always communicate changes clearly.
                        </p>
                      </section>

                      <section>
                        <h3 className="text-lg font-semibold text-brand-black mb-2">6. Payment Processing</h3>
                        <p className="text-gray-700">
                          All payments are processed securely through Stripe. By subscribing, you authorize BlkXchange™
                          to charge your payment method on a recurring basis until you cancel your subscription.
                        </p>
                      </section>

                      <section className="pt-4 border-t border-gray-300">
                        <p className="text-sm text-gray-600 text-center">
                          <strong>Effective Date:</strong> January 1, 2025<br />
                          BlkXchange™ Service Provider Agreement © 2025. All Rights Reserved.
                        </p>
                      </section>
                    </DialogDescription>
                  </DialogHeader>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
