import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShoppingBag, Users, Heart, TrendingUp, Newspaper } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { api } from '../api';
import { ImpactStats } from '../types';

interface Article {
  id: string;
  title: string;
  author: string;
  category: string;
  excerpt: string;
  image_url: string | null;
  slug: string;
  created_at: string;
}

const categories = [
  { label: 'Apparel & Accessories', value: 'apparel_accessories' },
  { label: 'Art & Collectibles', value: 'art_collectibles' },
  { label: 'Automotive & Transportation', value: 'automotive_transportation' },
  { label: 'Beauty & Wellness', value: 'beauty_wellness' },
  { label: 'Books & Stationery', value: 'books_stationery' },
  { label: 'Food & Beverage', value: 'food_beverage' },
  { label: 'Health & Pharmacy', value: 'health_pharmacy' },
  { label: 'Home & Living', value: 'home_living' },
  { label: 'Trades & Manufacturing', value: 'manufacturing_trades' },
  { label: 'Technology & Gadgets', value: 'technology_gadgets' }
];

export default function Landing() {
  const [impactStats, setImpactStats] = useState<ImpactStats | null>(null);
  const [articles, setArticles] = useState<Article[]>([]);

  useEffect(() => {
    api.getImpactStats().then(setImpactStats);
    loadArticles();
  }, []);

  const loadArticles = async () => {
    try {
      const articles = await api.get('/api/articles?status=published');
      setArticles(articles.slice(0, 4));
    } catch (error) {
      console.error('Error loading articles:', error);
    }
  };

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
              <Link to="/vendor-apply">
                <Button variant="outline" className="border-brand-gold text-brand-gold hover:bg-brand-gold hover:text-brand-black text-lg px-8 py-6">
                  <TrendingUp className="w-5 h-5 mr-2" />
                  Sell on BlkXchange
                </Button>
              </Link>
              <Link to="/professionals">
                <Button variant="outline" className="border-white text-[#C5A14E] hover:bg-white hover:text-brand-black text-lg px-8 py-6">
                  <Users className="w-5 h-5 mr-2" />
                  Explore Professionals
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#1A1A1A] py-12 px-4 flex flex-col items-center justify-center">
        <h2 className="text-3xl md:text-4xl font-bold text-[#C5A14E] mb-6 text-center">
          Legacy of Black Wall Street
        </h2>
        <div className="relative w-full max-w-2xl aspect-video border-2 border-[#C5A14E] rounded-xl overflow-hidden shadow-lg mx-auto">
          <iframe
            className="w-full h-full"
            src="https://www.youtube.com/embed/AMZ9kvXPGb8?autoplay=1&mute=1&loop=1&playlist=AMZ9kvXPGb8"
            title="Legacy of Black Wall Street"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
        <p className="mt-6 text-[#C5A14E] text-lg md:text-xl text-center max-w-2xl">
          Honoring the resilience and entrepreneurial spirit of Black Wall Street, 
          we continue the legacy of economic empowerment and community building.
        </p>
      </section>

      {articles.length > 0 && (
        <section className="py-16 bg-gradient-to-b from-[#0b1c0e] to-[#000000]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <Newspaper className="w-8 h-8 text-[#C5A14E]" />
                <h2 className="text-3xl md:text-4xl font-bold text-[#C5A14E]">
                  From The Black Chronicle
                </h2>
              </div>
              <Link to="/news">
                <Button className="bg-[#C5A14E] hover:bg-[#b39145] text-black">
                  View All Stories
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
            <p className="text-white/80 text-lg mb-8 text-center">
              Latest in Black Excellence, Innovation, and Achievement
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {articles.map((article) => (
                <Link key={article.id} to={`/news/${article.slug}`}>
                  <Card className="bg-[#1A1A1A] border-[#C5A14E]/20 hover:border-[#C5A14E] transition-all h-full">
                    <CardContent className="p-0">
                      {article.image_url && (
                        <img
                          src={article.image_url}
                          alt={article.title}
                          className="w-full h-40 object-cover"
                        />
                      )}
                      <div className="p-4">
                        <h3 className="text-white font-semibold mb-2 line-clamp-2 hover:text-[#C5A14E]">
                          {article.title}
                        </h3>
                        <p className="text-white/60 text-sm line-clamp-2 mb-3">
                          {article.excerpt}
                        </p>
                        <p className="text-[#C5A14E] text-xs">
                          By {article.author}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-heading font-bold text-center mb-12 text-brand-black">
            Shop by Category
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-6">
            {categories.map((cat) => (
              <Link key={cat.value} to={`/marketplace?category=${cat.value}`}>
                <button
                  className="
                    p-4 rounded-lg border-2 transition-all duration-200
                    border-gray-300 hover:border-[#C5A14E] hover:shadow-[0_0_15px_rgba(197,161,78,0.5)]
                    flex flex-col items-center justify-center gap-2 min-h-[100px] w-full
                  "
                >
                  <span className="text-sm font-medium text-center text-brand-black">
                    {cat.label}
                  </span>
                </button>
              </Link>
            ))}
          </div>
          <div className="flex justify-center">
            <Link to="/marketplace">
              <Button
                variant="outline"
                className="border-brand-gold text-brand-gold hover:bg-brand-gold hover:text-brand-black"
              >
                View All Products
              </Button>
            </Link>
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
            <Link to="/vendor-apply">
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
