import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShoppingBag, Users, Heart, TrendingUp } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { api } from '../api';
import { ImpactStats } from '../types';

const categories = [
  { name: 'Apparel', value: 'apparel', icon: '👔' },
  { name: 'Beauty', value: 'beauty', icon: '💄' },
  { name: 'Books', value: 'books', icon: '📚' },
  { name: 'Art', value: 'art', icon: '🎨' },
  { name: 'Tech', value: 'tech', icon: '💻' },
  { name: 'Food', value: 'food', icon: '🍽️' },
  { name: 'Wellness', value: 'wellness', icon: '🧘' },
  { name: 'Home', value: 'home', icon: '🏠' }
];

export default function Landing() {
  const [impactStats, setImpactStats] = useState<ImpactStats | null>(null);

  useEffect(() => {
    api.getImpactStats().then(setImpactStats);
  }, []);

  return (
    <div className="min-h-screen bg-brand-ivory">
      <section className="bg-gradient-to-br from-brand-black to-brand-charcoal text-brand-ivory py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-heading font-bold mb-6">
              Welcome to <span className="text-brand-gold">BlkXchange™</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-300">
              The Internet's Black Wall Street
            </p>
            <p className="text-lg md:text-xl mb-12 max-w-3xl mx-auto text-gray-400">
              Empowering Black and BIPOC entrepreneurs, professionals, and creators to sell products, 
              offer services, and give back to their communities.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/marketplace">
                <Button className="bg-brand-gold text-brand-black hover:bg-opacity-90 text-lg px-8 py-6">
                  <ShoppingBag className="w-5 h-5 mr-2" />
                  Shop Marketplace
                </Button>
              </Link>
              <Link to="/vendor/register">
                <Button variant="outline" className="border-brand-gold text-brand-gold hover:bg-brand-gold hover:text-brand-black text-lg px-8 py-6">
                  <TrendingUp className="w-5 h-5 mr-2" />
                  Sell on BlkXchange
                </Button>
              </Link>
              <Link to="/professionals">
                <Button variant="outline" className="border-brand-ivory text-brand-ivory hover:bg-brand-ivory hover:text-brand-black text-lg px-8 py-6">
                  <Users className="w-5 h-5 mr-2" />
                  Explore Professionals
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-heading font-bold text-center mb-12 text-brand-black">
            Shop by Category
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories.map((category) => (
              <Link key={category.value} to={`/marketplace?category=${category.value}`}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-brand-gold">
                  <CardContent className="p-6 text-center">
                    <div className="text-4xl mb-3">{category.icon}</div>
                    <h3 className="font-semibold text-lg text-brand-black">{category.name}</h3>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-brand-charcoal text-brand-ivory">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-heading font-bold mb-4">
              Our Mission
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Born from the legacy of Black Wall Street, BlkXchange™ represents a new digital economy 
              built on unity, excellence, and reinvestment. Every purchase builds our future.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-brand-black border-brand-gold">
              <CardContent className="p-6 text-center">
                <ShoppingBag className="w-12 h-12 text-brand-gold mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2 text-brand-gold">Empower</h3>
                <p className="text-gray-300">
                  Support Black-owned businesses and BIPOC entrepreneurs in building sustainable enterprises.
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-brand-black border-brand-gold">
              <CardContent className="p-6 text-center">
                <Users className="w-12 h-12 text-brand-gold mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2 text-brand-gold">Exchange</h3>
                <p className="text-gray-300">
                  Connect customers with quality products and professional services from our community.
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-brand-black border-brand-gold">
              <CardContent className="p-6 text-center">
                <Heart className="w-12 h-12 text-brand-gold mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2 text-brand-gold">Elevate</h3>
                <p className="text-gray-300">
                  Every purchase contributes to scholarships, HBCUs, and community initiatives.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {impactStats && (
        <section className="py-16 bg-brand-gold">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-heading font-bold text-center mb-12 text-brand-black">
              Community Impact
            </h2>
            <div className="grid md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-4xl font-bold text-brand-black mb-2">
                  ${impactStats.total_donations.toFixed(2)}
                </div>
                <div className="text-brand-charcoal font-semibold">Total Donations</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-brand-black mb-2">
                  {impactStats.total_vendors}
                </div>
                <div className="text-brand-charcoal font-semibold">Active Vendors</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-brand-black mb-2">
                  {impactStats.total_professionals}
                </div>
                <div className="text-brand-charcoal font-semibold">Professionals</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-brand-black mb-2">
                  {impactStats.total_orders}
                </div>
                <div className="text-brand-charcoal font-semibold">Orders Completed</div>
              </div>
            </div>
            <div className="text-center mt-8">
              <Link to="/impact">
                <Button className="bg-brand-black text-brand-gold hover:bg-brand-charcoal">
                  View Full Impact Report
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-heading font-bold mb-6 text-brand-black">
            Join the Movement
          </h2>
          <p className="text-xl text-gray-700 mb-8">
            Be part of building a sustainable digital economy that reinvests in our community.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/vendor/register">
              <Button className="bg-brand-black text-brand-gold hover:bg-brand-charcoal text-lg px-8 py-6">
                Become a Vendor
              </Button>
            </Link>
            <Link to="/about">
              <Button variant="outline" className="border-brand-black text-brand-black hover:bg-brand-black hover:text-brand-gold text-lg px-8 py-6">
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
