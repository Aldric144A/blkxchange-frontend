import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Star, ShoppingCart } from 'lucide-react';
import { api } from '../api';
import { Product } from '../types';

const categories = [
  { label: 'All Categories', value: 'all' },
  { label: 'Apparel', value: 'apparel' },
  { label: 'Beauty', value: 'beauty' },
  { label: 'Books', value: 'books' },
  { label: 'Art', value: 'art' },
  { label: 'Tech', value: 'tech' },
  { label: 'Food', value: 'food' },
  { label: 'Wellness', value: 'wellness' },
  { label: 'Home', value: 'home' },
  { label: 'Jewelry', value: 'jewelry' }
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
        <div className="mb-8 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex items-center gap-4">
            <label className="font-semibold text-brand-black">Filter by:</label>
            <Select value={selectedCategory} onValueChange={handleCategoryChange}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
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
                    <h3 className="font-semibold text-lg mb-2 text-brand-black line-clamp-2">
                      {product.name}
                    </h3>
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
                <CardFooter className="p-4 pt-0">
                  <Button className="w-full bg-brand-gold text-brand-black hover:bg-opacity-90">
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Add to Cart
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
