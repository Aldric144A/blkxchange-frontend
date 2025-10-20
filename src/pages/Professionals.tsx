import { useEffect, useState } from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Star, Calendar, CheckCircle } from 'lucide-react';
import { api } from '../api';
import { Professional } from '../types';

const categories = [
  { label: 'All Categories', value: 'all' },
  { label: 'Health', value: 'health' },
  { label: 'Legal', value: 'legal' },
  { label: 'Finance', value: 'finance' },
  { label: 'Coaching', value: 'coaching' },
  { label: 'Consulting', value: 'consulting' },
  { label: 'Education', value: 'education' }
];

export default function Professionals() {
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    setLoading(true);
    const category = selectedCategory === 'all' ? undefined : selectedCategory;
    api.getProfessionals(category)
      .then(setProfessionals)
      .finally(() => setLoading(false));
  }, [selectedCategory]);

  return (
    <div className="min-h-screen bg-brand-ivory">
      <div className="bg-brand-black text-brand-ivory py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">
            Professional Services
          </h1>
          <p className="text-xl text-gray-300">
            Connect with verified Black professionals across various fields
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex items-center gap-4">
            <label className="font-semibold text-brand-black">Filter by:</label>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
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
            {professionals.length} {professionals.length === 1 ? 'professional' : 'professionals'} found
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="text-xl text-gray-600">Loading professionals...</div>
          </div>
        ) : professionals.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-xl text-gray-600">No professionals found in this category.</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {professionals.map((professional) => (
              <Card key={professional.id} className="hover:shadow-lg transition-shadow border-2 hover:border-brand-gold">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-20 h-20 rounded-full bg-gray-200 flex-shrink-0 overflow-hidden">
                      {professional.image_url ? (
                        <img 
                          src={professional.image_url} 
                          alt={professional.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-2xl">
                          {professional.name.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-lg text-brand-black">
                            {professional.name}
                          </h3>
                          <p className="text-sm text-gray-600">{professional.title}</p>
                        </div>
                        {professional.verified && (
                          <CheckCircle className="w-5 h-5 text-brand-gold flex-shrink-0" />
                        )}
                      </div>
                    </div>
                  </div>

                  <Badge className="mb-3 capitalize bg-brand-charcoal text-brand-gold">
                    {professional.category}
                  </Badge>

                  <p className="text-gray-700 text-sm mb-4 line-clamp-3">
                    {professional.bio}
                  </p>

                  <div className="mb-4">
                    <p className="text-xs text-gray-600 font-semibold mb-1">Credentials:</p>
                    <p className="text-sm text-gray-700">{professional.credentials}</p>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <Star className="w-4 h-4 fill-brand-gold text-brand-gold" />
                      <span className="ml-1 text-sm text-gray-600">
                        {professional.rating.toFixed(1)} ({professional.reviews_count})
                      </span>
                    </div>
                    {professional.hourly_rate && (
                      <div className="text-lg font-bold text-brand-black">
                        ${professional.hourly_rate}/hr
                      </div>
                    )}
                  </div>

                  {professional.phone && (
                    <p className="text-sm text-gray-600 mb-4">
                      📞 {professional.phone}
                    </p>
                  )}
                </CardContent>
                <CardFooter className="p-6 pt-0">
                  <Button className="w-full bg-brand-gold text-brand-black hover:bg-opacity-90">
                    <Calendar className="w-4 h-4 mr-2" />
                    Book Consultation
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
