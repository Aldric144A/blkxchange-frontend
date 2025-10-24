import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Star, ShoppingCart, Store, Mail } from 'lucide-react';
import { api } from '../api';
import { Product } from '../types';
import { SidebarAd } from '../components/ads';
import { addToCart } from '../utils/cart';
import FloatingCart from '../components/FloatingCart';

const categories = [
  { label: 'All Categories', value: 'all', group: '' },
  { label: '🛍️ Product Industries', value: 'header-products', group: 'header', disabled: true },
  { label: 'Apparel & Accessories', value: 'apparel_accessories', group: 'products' },
  { label: 'Art & Collectibles', value: 'art_collectibles', group: 'products' },
  { label: 'Automotive & Transportation', value: 'automotive_transportation', group: 'products' },
  { label: 'Beauty & Wellness', value: 'beauty_wellness', group: 'products' },
  { label: 'Books & Stationery', value: 'books_stationery', group: 'products' },
  { label: 'Food & Beverage', value: 'food_beverage', group: 'products' },
  { label: 'Health & Pharmacy', value: 'health_pharmacy', group: 'products' },
  { label: 'Home & Living', value: 'home_living', group: 'products' },
  { label: 'Trades & Manufacturing', value: 'manufacturing_trades', group: 'products' },
  { label: 'Technology & Gadgets', value: 'technology_gadgets', group: 'products' }
];

export default function Marketplace() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all');

  useEffect(() => {
    setLoading(true);
    const category = selectedCategory === 'all' ? undefined : selectedCategory;
    api.getProducts(category)
      .then(setProducts)
      .finally(() => setLoading(false));
  }, [selectedCategory]);

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
    if (value && value !== 'all') {
      setSearchParams({ category: value });
    } else {
      setSearchParams({});
    }
  };

  const handleAddToCart = (product: Product) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image_url: product.image_url,
      vendor_name: product.vendor_name,
    });
  };

  const handleContactVendor = (product: Product) => {
    alert(`Contact ${product.vendor_name || 'Vendor'}\n\nNote: Vendor contact information will be available soon. This feature requires vendor email/website to be added to the product data.`);
  };

  return (
    <div className="min-h-screen bg-brand-ivory">
      <div className="bg-brand-black text-brand-ivory py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">
            Marketplace
          </h1>
          <p className="text-xl text-gray-300">
            Discover products from Black-owned businesses
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1">
            {/* Partner CTA Card */}
            <Card className="mb-8 bg-[#012B1A] border-2 border-[#C5A14E] rounded-xl shadow-md">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row items-center gap-6">
                  <div className="flex-shrink-0">
                    <Store className="w-16 h-16 text-[#C5A14E]" />
                  </div>
                  <div className="flex-1 text-center md:text-left">
                    <h3 className="text-2xl font-heading font-bold text-white mb-2">
                      Become a Vendor on BlkXchange™
                    </h3>
                    <p className="text-gray-300 mb-4">
                      Showcase your products, gain exposure, and join the movement supporting Black entrepreneurship.
                    </p>
                    <Link to="/vendor-partner">
                      <Button className="bg-[#C5A14E] text-white hover:bg-opacity-90 hover:shadow-2xl rounded-full px-8 py-3 text-lg font-semibold shadow-lg transition-all">
                        Learn More
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Shop by Category Grid */}
            <div className="mb-8">
              <h2 className="text-2xl font-heading font-bold text-brand-black mb-6">Shop by Category</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-6">
                {categories.filter(cat => cat.group === 'products').map((cat) => (
                  <button
                    key={cat.value}
                    onClick={() => handleCategoryChange(cat.value)}
                    className={`
                      p-4 rounded-lg border-2 transition-all duration-200
                      ${selectedCategory === cat.value 
                        ? 'border-[#00A86B] bg-[#00A86B]/10 shadow-lg' 
                        : 'border-gray-300 hover:border-[#C5A14E] hover:shadow-[0_0_15px_rgba(197,161,78,0.5)]'
                      }
                      flex flex-col items-center justify-center gap-2 min-h-[100px]
                    `}
                  >
                    <span className="text-3xl">{cat.label.split(' ')[0]}</span>
                    <span className="text-sm font-medium text-center text-brand-black">
                      {cat.label.replace(/^[^\s]+\s/, '')}
                    </span>
                  </button>
                ))}
              </div>
              <div className="flex justify-center">
                <Button
                  onClick={() => handleCategoryChange('all')}
                  variant="outline"
                  className="border-brand-gold text-brand-gold hover:bg-brand-gold hover:text-brand-black"
                >
                  View All Products
                </Button>
              </div>
            </div>

            <div className="mb-8 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex items-center gap-4">
            <label className="font-semibold text-brand-black">Filter by:</label>
            <Select value={selectedCategory} onValueChange={handleCategoryChange}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem 
                    key={cat.value} 
                    value={cat.value}
                    disabled={cat.disabled}
                    className={cat.group === 'header' ? 'font-semibold text-[#C5A14E] cursor-default' : 'text-brand-black hover:text-[#C5A14E] transition'}
                  >
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="text-gray-600">
            {products.length} {products.length === 1 ? 'product' : 'products'} found
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="text-xl text-gray-600">Loading products...</div>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-xl text-gray-600">No products found in this category.</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <Card key={product.id} className="hover:shadow-lg transition-shadow border-2 hover:border-brand-gold">
                <CardContent className="p-0">
                  <div className="aspect-square bg-gray-200 relative overflow-hidden">
                    {product.image_url ? (
                      <img 
                        src={product.image_url} 
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        No Image
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-1 text-brand-black line-clamp-2">
                      {product.name}
                    </h3>
                    {product.vendor_name && (
                      <p className="text-brand-gold text-sm mb-2 font-medium">
                        by {product.vendor_name}
                      </p>
                    )}
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {product.description}
                    </p>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex items-center">
                        <Star className="w-4 h-4 fill-brand-gold text-brand-gold" />
                        <span className="ml-1 text-sm text-gray-600">
                          {product.rating.toFixed(1)} ({product.reviews_count})
                        </span>
                      </div>
                      <span className="text-xs text-gray-500 capitalize">
                        {product.category}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-2xl font-bold text-brand-black">
                        ${product.price.toFixed(2)}
                      </div>
                      <div className="text-sm text-gray-600">
                        Stock: {product.stock}
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="p-4 pt-0 flex gap-2">
                  <Button 
                    onClick={() => handleAddToCart(product)}
                    className="flex-1 bg-brand-gold text-brand-black hover:bg-opacity-90"
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Add to Cart
                  </Button>
                  <Button 
                    onClick={() => handleContactVendor(product)}
                    variant="outline"
                    className="border-brand-gold text-brand-gold hover:bg-brand-gold hover:text-brand-black"
                  >
                    <Mail className="w-4 h-4" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
          </div>
          <aside className="hidden md:block">
            <SidebarAd page="marketplace" />
          </aside>
        </div>
      </div>

      <FloatingCart />
    </div>
  );
}
