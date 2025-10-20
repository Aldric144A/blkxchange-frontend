import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, TrendingUp, Users, ShoppingBag, GraduationCap, Building, HandHeart } from 'lucide-react';
import { api } from '../api';
import { ImpactStats } from '../types';

export default function Impact() {
  const [stats, setStats] = useState<ImpactStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getImpactStats()
      .then(setStats)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-ivory flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading impact data...</div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="min-h-screen bg-brand-ivory flex items-center justify-center">
        <div className="text-xl text-gray-600">Unable to load impact data.</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-ivory">
      <div className="bg-gradient-to-br from-brand-black to-brand-charcoal text-brand-ivory py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Heart className="w-16 h-16 text-brand-gold mx-auto mb-4" />
            <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">
              Community Impact
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Every purchase on BlkXchange™ contributes to building a stronger community. 
              3% of every sale goes directly to scholarships, HBCUs, and nonprofit partners.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="border-2 border-brand-gold">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-brand-black">
                <TrendingUp className="w-5 h-5 text-brand-gold" />
                Total Impact
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-brand-gold">
                ${stats.total_donations.toFixed(2)}
              </div>
              <p className="text-sm text-gray-600 mt-2">
                Total donated to community causes
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-brand-gold">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-brand-black">
                <ShoppingBag className="w-5 h-5 text-brand-gold" />
                Orders
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-brand-black">
                {stats.total_orders}
              </div>
              <p className="text-sm text-gray-600 mt-2">
                Orders completed on platform
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-brand-gold">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-brand-black">
                <Users className="w-5 h-5 text-brand-gold" />
                Vendors
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-brand-black">
                {stats.total_vendors}
              </div>
              <p className="text-sm text-gray-600 mt-2">
                Active Black-owned businesses
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-brand-gold">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-brand-black">
                <Users className="w-5 h-5 text-brand-gold" />
                Professionals
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-brand-black">
                {stats.total_professionals}
              </div>
              <p className="text-sm text-gray-600 mt-2">
                Verified professionals on platform
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="mb-12">
          <h2 className="text-3xl font-heading font-bold text-center mb-8 text-brand-black">
            Where Your Contributions Go
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="bg-brand-charcoal text-brand-ivory border-brand-gold">
              <CardContent className="p-6">
                <GraduationCap className="w-12 h-12 text-brand-gold mb-4" />
                <h3 className="text-2xl font-bold mb-2 text-brand-gold">
                  ${stats.hbcu_donations.toFixed(2)}
                </h3>
                <h4 className="text-lg font-semibold mb-2">HBCU Support</h4>
                <p className="text-gray-300 text-sm">
                  50% of community funds support Historically Black Colleges and Universities, 
                  investing in the next generation of Black leaders and innovators.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-brand-charcoal text-brand-ivory border-brand-gold">
              <CardContent className="p-6">
                <Building className="w-12 h-12 text-brand-gold mb-4" />
                <h3 className="text-2xl font-bold mb-2 text-brand-gold">
                  ${stats.scholarship_donations.toFixed(2)}
                </h3>
                <h4 className="text-lg font-semibold mb-2">Scholarships</h4>
                <p className="text-gray-300 text-sm">
                  30% funds scholarships for Black students pursuing higher education, 
                  helping to break down financial barriers to success.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-brand-charcoal text-brand-ivory border-brand-gold">
              <CardContent className="p-6">
                <HandHeart className="w-12 h-12 text-brand-gold mb-4" />
                <h3 className="text-2xl font-bold mb-2 text-brand-gold">
                  ${stats.nonprofit_donations.toFixed(2)}
                </h3>
                <h4 className="text-lg font-semibold mb-2">Nonprofit Partners</h4>
                <p className="text-gray-300 text-sm">
                  20% supports nonprofit organizations working to uplift Black communities 
                  through various social justice and empowerment initiatives.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        <Card className="bg-brand-gold">
          <CardContent className="p-8 text-center">
            <h2 className="text-3xl font-heading font-bold mb-4 text-brand-black">
              The BlkXchange™ Model
            </h2>
            <div className="max-w-3xl mx-auto">
              <p className="text-lg text-brand-charcoal mb-6">
                Unlike traditional marketplaces that charge vendors upfront fees, BlkXchange™ operates 
                on a revenue-sharing model that aligns our success with yours.
              </p>
              <div className="grid md:grid-cols-3 gap-6 text-left">
                <div>
                  <div className="text-4xl font-bold text-brand-black mb-2">90%</div>
                  <div className="font-semibold text-brand-charcoal mb-1">To Vendors</div>
                  <p className="text-sm text-brand-charcoal">
                    The majority goes directly to our vendors, supporting their businesses and families.
                  </p>
                </div>
                <div>
                  <div className="text-4xl font-bold text-brand-black mb-2">7%</div>
                  <div className="font-semibold text-brand-charcoal mb-1">Platform Operations</div>
                  <p className="text-sm text-brand-charcoal">
                    Keeps BlkXchange™ running, improving, and growing to serve you better.
                  </p>
                </div>
                <div>
                  <div className="text-4xl font-bold text-brand-black mb-2">3%</div>
                  <div className="font-semibold text-brand-charcoal mb-1">Community Impact</div>
                  <p className="text-sm text-brand-charcoal">
                    Automatically distributed to HBCUs, scholarships, and nonprofit partners.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
