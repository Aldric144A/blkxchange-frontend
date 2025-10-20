import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Heart, Users, TrendingUp, Target, Eye, Zap } from 'lucide-react';

export default function About() {
  return (
    <div className="min-h-screen bg-brand-ivory">
      <div className="bg-gradient-to-br from-brand-black to-brand-charcoal text-brand-ivory py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-heading font-bold mb-6">
            About <span className="text-brand-gold">BlkXchange™</span>
          </h1>
          <p className="text-xl text-gray-300">
            Building the digital economy our community deserves
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="prose prose-lg max-w-none mb-12">
          <h2 className="text-3xl font-heading font-bold mb-6 text-brand-black">Our Story</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            Born from the legacy of Black Wall Street, BlkXchange™ represents a new digital economy 
            built on unity, excellence, and reinvestment. In the early 1900s, the Greenwood District 
            of Tulsa, Oklahoma, known as Black Wall Street, was a thriving hub of Black entrepreneurship 
            and economic independence. It demonstrated what our community could achieve when we support 
            one another.
          </p>
          <p className="text-gray-700 leading-relaxed mb-4">
            Today, BlkXchange™ carries that torch forward into the digital age. We are creating a 
            self-sustaining marketplace where Black and BIPOC entrepreneurs can thrive, where customers 
            can easily discover and support Black-owned businesses, and where every transaction 
            contributes to building a stronger community for future generations.
          </p>
          <p className="text-gray-700 leading-relaxed">
            Founded by Dr. Aldric Marshall, BlkXchange™ is more than a marketplace. It is a movement 
            to reclaim economic power, celebrate Black excellence, and invest in our collective future. 
            Every purchase builds our future. Every vendor strengthens our network. Every professional 
            expands our capabilities.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="border-2 border-brand-gold">
            <CardContent className="p-6 text-center">
              <Target className="w-12 h-12 text-brand-gold mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-brand-black">Mission</h3>
              <p className="text-gray-700">
                To empower Black and BIPOC entrepreneurs by providing a platform that celebrates 
                their excellence while reinvesting in community growth.
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-brand-gold">
            <CardContent className="p-6 text-center">
              <Eye className="w-12 h-12 text-brand-gold mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-brand-black">Vision</h3>
              <p className="text-gray-700">
                A thriving digital economy where Black businesses flourish, professionals connect, 
                and every transaction builds generational wealth.
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-brand-gold">
            <CardContent className="p-6 text-center">
              <Zap className="w-12 h-12 text-brand-gold mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-brand-black">Values</h3>
              <p className="text-gray-700">
                Unity, Excellence, Empowerment, Transparency, and Community Investment guide 
                everything we do.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="bg-brand-charcoal text-brand-ivory rounded-lg p-8 mb-12">
          <h2 className="text-3xl font-heading font-bold mb-6 text-center">
            Why BlkXchange™ is Different
          </h2>
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-full bg-brand-gold flex items-center justify-center">
                  <Heart className="w-6 h-6 text-brand-black" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2 text-brand-gold">No Upfront Fees</h3>
                <p className="text-gray-300">
                  Unlike other platforms, we do not charge vendors subscription fees or listing costs. 
                  We only succeed when you succeed, taking a small percentage of each sale.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-full bg-brand-gold flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-brand-black" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2 text-brand-gold">Community Reinvestment</h3>
                <p className="text-gray-300">
                  3% of every sale automatically goes to HBCUs, scholarships, and nonprofit partners. 
                  Your purchases directly fund the next generation of Black leaders.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-full bg-brand-gold flex items-center justify-center">
                  <Users className="w-6 h-6 text-brand-black" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2 text-brand-gold">Comprehensive Platform</h3>
                <p className="text-gray-300">
                  More than just products, we connect you with Black professionals across health, 
                  legal, finance, and more. One platform for all your needs.
                </p>
              </div>
            </div>
          </div>
        </div>

        <Card className="bg-brand-gold border-0">
          <CardContent className="p-8 text-center">
            <h2 className="text-3xl font-heading font-bold mb-4 text-brand-black">
              Join the Movement
            </h2>
            <p className="text-lg text-brand-charcoal mb-6 max-w-2xl mx-auto">
              Whether you are a customer looking to support Black businesses, an entrepreneur ready 
              to grow your brand, or a professional seeking to expand your practice, BlkXchange™ 
              welcomes you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/marketplace">
                <Button className="bg-brand-black text-brand-gold hover:bg-brand-charcoal text-lg px-8 py-6">
                  Start Shopping
                </Button>
              </Link>
              <Link to="/vendor/register">
                <Button variant="outline" className="border-brand-black text-brand-black hover:bg-brand-black hover:text-brand-gold text-lg px-8 py-6">
                  Become a Vendor
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
