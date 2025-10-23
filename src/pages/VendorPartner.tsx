import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Store, Users, Heart, TrendingUp, Shield, CreditCard, FileText, Scale, GraduationCap } from 'lucide-react';

export default function VendorPartner() {
  const [showTermsModal, setShowTermsModal] = useState(false);

  const scrollToTerms = () => {
    const termsSection = document.getElementById('terms-section');
    if (termsSection) {
      termsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-brand-ivory">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-[#000000] to-[#012B1A] text-white py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <Store className="w-20 h-20 text-[#C5A14E] mx-auto mb-6" />
          <h1 className="text-5xl md:text-6xl font-heading font-bold mb-6">
            Become a Vendor on BlkXchange™
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-10 max-w-4xl mx-auto leading-relaxed">
            Sell your products on The Internet's Black Wall Street and join a thriving marketplace built for Black entrepreneurs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/vendor-apply">
              <Button className="bg-[#C5A14E] text-black hover:bg-opacity-90 hover:shadow-2xl rounded-full px-10 py-6 text-xl font-semibold shadow-lg transition-all">
                Start Selling
              </Button>
            </Link>
            <Button 
              onClick={scrollToTerms}
              className="bg-transparent border-2 border-[#C5A14E] text-[#C5A14E] hover:bg-[#C5A14E] hover:text-black rounded-full px-10 py-6 text-xl font-semibold transition-all"
            >
              View Vendor Agreement
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Revenue Model Card */}
        <Card className="mb-16 bg-gradient-to-br from-[#012B1A] to-[#013D25] border-2 border-[#C5A14E] rounded-2xl shadow-lg">
          <CardContent className="p-8 md:p-12">
            <div className="text-center mb-8">
              <h2 className="text-4xl font-heading font-bold text-white mb-4">
                Our Transparent 85/12/3 Model
              </h2>
              <p className="text-xl text-gray-300">
                We believe in transparency — your success fuels our shared growth.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="bg-[#012B1A] rounded-xl p-6 border-2 border-[#C5A14E]">
                <div className="text-5xl font-bold text-[#C5A14E] mb-2">85%</div>
                <div className="text-xl font-semibold text-white mb-2">Vendor Share</div>
                <div className="h-3 bg-[#C5A14E] rounded-full mb-3"></div>
                <p className="text-gray-300 text-sm">
                  The majority goes directly to you, supporting your business, family, and community.
                </p>
              </div>

              <div className="bg-[#012B1A] rounded-xl p-6 border-2 border-[#C5A14E]">
                <div className="text-5xl font-bold text-[#C5A14E] mb-2">12%</div>
                <div className="text-xl font-semibold text-white mb-2">Platform Operations</div>
                <div className="h-3 bg-[#C5A14E] rounded-full mb-3"></div>
                <p className="text-gray-300 text-sm">
                  Covers platform maintenance, secure payment processing, and continuous improvement.
                </p>
              </div>

              <div className="bg-[#012B1A] rounded-xl p-6 border-2 border-[#C5A14E]">
                <div className="text-5xl font-bold text-[#C5A14E] mb-2">3%</div>
                <div className="text-xl font-semibold text-white mb-2">Community Impact Fund</div>
                <div className="h-3 bg-[#C5A14E] rounded-full mb-3"></div>
                <p className="text-gray-300 text-sm">
                  Directly supports HBCUs, scholarships, and nonprofit partners.
                </p>
              </div>
            </div>

            <div className="text-center">
              <p className="text-2xl font-semibold text-white">
                Total Platform Fee: <span className="text-[#C5A14E]">15%</span> per transaction
              </p>
              <p className="text-gray-300 mt-2">No monthly subscription required</p>
            </div>
          </CardContent>
        </Card>

        {/* Why Sell on BlkXchange */}
        <div className="mb-16">
          <h2 className="text-4xl font-heading font-bold text-center mb-12 text-brand-black">
            Why Sell on BlkXchange™
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-2 border-[#C5A14E] hover:shadow-xl transition-shadow rounded-2xl">
              <CardContent className="p-8 text-center">
                <Users className="w-16 h-16 text-[#C5A14E] mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-brand-black mb-4">
                  Reach Conscious Consumers
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  Connect with customers actively seeking Black-owned businesses and products that align with their values.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-[#C5A14E] hover:shadow-xl transition-shadow rounded-2xl">
              <CardContent className="p-8 text-center">
                <TrendingUp className="w-16 h-16 text-[#C5A14E] mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-brand-black mb-4">
                  Build Without Barriers
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  No upfront listing fees or monthly subscriptions. Only pay when you make a sale — we succeed when you succeed.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-[#C5A14E] hover:shadow-xl transition-shadow rounded-2xl">
              <CardContent className="p-8 text-center">
                <Heart className="w-16 h-16 text-[#C5A14E] mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-brand-black mb-4">
                  Empower the Culture
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  3% of all sales are reinvested into HBCUs, scholarships, and community programs that uplift Black communities.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Terms of Service Section */}
        <div id="terms-section" className="mb-16">
          <h2 className="text-4xl font-heading font-bold text-center mb-12 text-brand-black">
            Vendor Agreement Summary
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="border-2 border-gray-300 rounded-xl">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <Shield className="w-8 h-8 text-[#C5A14E] flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-xl font-bold text-brand-black mb-2">
                      Authenticity & Compliance
                    </h3>
                    <p className="text-gray-700">
                      Products must be genuine, legal, and align with community standards. We maintain a trusted marketplace for all.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-gray-300 rounded-xl">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <TrendingUp className="w-8 h-8 text-[#C5A14E] flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-xl font-bold text-brand-black mb-2">
                      Revenue Share
                    </h3>
                    <p className="text-gray-700">
                      15% platform fee per transaction (85% vendor / 12% ops / 3% impact). No monthly subscription required.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-gray-300 rounded-xl">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <CreditCard className="w-8 h-8 text-[#C5A14E] flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-xl font-bold text-brand-black mb-2">
                      Payment Processing
                    </h3>
                    <p className="text-gray-700">
                      Stripe payout to vendor in 3–5 business days post-sale. Secure, reliable, and transparent payment processing.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-gray-300 rounded-xl">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <FileText className="w-8 h-8 text-[#C5A14E] flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-xl font-bold text-brand-black mb-2">
                      Intellectual Property
                    </h3>
                    <p className="text-gray-700">
                      Vendors retain ownership of logos, brand names, and images. Your brand is yours — always.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-gray-300 rounded-xl">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <Scale className="w-8 h-8 text-[#C5A14E] flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-xl font-bold text-brand-black mb-2">
                      Termination & Dispute
                    </h3>
                    <p className="text-gray-700">
                      BlkXchange™ reserves the right to remove listings violating policy. Fair dispute resolution process in place.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-gray-300 rounded-xl">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <GraduationCap className="w-8 h-8 text-[#C5A14E] flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-xl font-bold text-brand-black mb-2">
                      Community Impact Clause
                    </h3>
                    <p className="text-gray-700">
                      3% of every sale funds scholarships, HBCUs, and nonprofit programs that empower Black communities.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-8">
            <Button 
              onClick={() => setShowTermsModal(true)}
              className="bg-brand-black text-white hover:bg-opacity-90 rounded-full px-8 py-4 text-lg font-semibold"
            >
              Read Full Vendor Terms
            </Button>
          </div>
        </div>

        {/* Final CTA */}
        <Card className="bg-gradient-to-br from-[#C5A14E] to-[#b39145] border-0 rounded-2xl shadow-xl">
          <CardContent className="p-12 text-center">
            <h2 className="text-4xl font-heading font-bold text-black mb-4">
              Ready to Start Selling?
            </h2>
            <p className="text-xl text-brand-charcoal mb-8">
              Join hundreds of Black entrepreneurs building their legacy on BlkXchange™
            </p>
            <Link to="/vendor-apply">
              <Button className="bg-black text-white hover:bg-opacity-90 hover:shadow-2xl rounded-full px-12 py-6 text-xl font-semibold shadow-lg transition-all">
                Apply Now
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Terms Modal */}
      {showTermsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-4xl max-h-[80vh] overflow-y-auto p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-heading font-bold text-brand-black">
                Full Vendor Agreement
              </h2>
              <Button 
                onClick={() => setShowTermsModal(false)}
                className="bg-gray-200 hover:bg-gray-300 text-black rounded-full px-4 py-2"
              >
                Close
              </Button>
            </div>
            <div className="prose max-w-none">
              <p className="text-gray-700 mb-4">
                For the complete Vendor Agreement with all terms, conditions, and legal details, please visit:
              </p>
              <Link to="/vendor-agreement" className="text-[#C5A14E] hover:underline text-lg font-semibold">
                View Complete Vendor Agreement →
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
