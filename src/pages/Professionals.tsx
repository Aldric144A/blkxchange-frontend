import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Star, Calendar, CheckCircle, Briefcase, MapPin } from 'lucide-react';
import { api } from '../api';
import { Professional } from '../types';
import { SidebarAd } from '../components/ads';
import { LocationSearchBar } from '../components/LocationSearchBar';
import { ProfessionalMap } from '../components/ProfessionalMap';
import { NearbyProfessionalsList } from '../components/NearbyProfessionalsList';

const categories = [
  { label: 'All Categories', value: 'all', group: '' },
  { label: '💼 Service Industries', value: 'header-services', group: 'header', disabled: true },
  { label: 'Coaching & Consulting', value: 'coaching_consulting', group: 'services' },
  { label: 'Education & Tutoring', value: 'education_tutoring', group: 'services' },
  { label: 'Event & Hospitality Services', value: 'event_hospitality', group: 'services' },
  { label: 'Finance & Insurance', value: 'finance_insurance', group: 'services' },
  { label: 'Health & Medical', value: 'health_medical', group: 'services' },
  { label: 'Legal & Advocacy', value: 'legal_advocacy', group: 'services' },
  { label: 'Media & Marketing', value: 'media_marketing', group: 'services' },
  { label: 'Nonprofits & Community Services', value: 'nonprofits_community', group: 'services' },
  { label: 'Real Estate & Wealth Advisors', value: 'real_estate_wealth', group: 'services' },
  { label: 'Technology & Innovation', value: 'technology_innovation', group: 'services' },
  { label: 'Trades & Home Services', value: 'trades_home', group: 'services' },
  { label: 'Transportation & Logistics', value: 'transportation_logistics', group: 'services' },
  { label: '🌍 Cultural & Community', value: 'header-cultural', group: 'header', disabled: true },
  { label: 'Arts & Culture Education', value: 'arts_culture', group: 'cultural' },
  { label: 'Black Media & Publications', value: 'black_media', group: 'cultural' },
  { label: 'Faith & Resilience', value: 'faith_resilience', group: 'cultural' },
  { label: 'HBCUs & Educational Partners', value: 'hbcus_education', group: 'cultural' },
  { label: 'Travel & Heritage Experiences', value: 'travel_heritage', group: 'cultural' }
];

export default function Professionals() {
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchMode, setSearchMode] = useState<'all' | 'nearby'>('all');
  const [showMap, setShowMap] = useState(false);
  const [nearbyResults, setNearbyResults] = useState<any[]>([]);
  const [mapCenter, setMapCenter] = useState<[number, number]>([39.8283, -98.5795]);
  const [selectedProfessional, setSelectedProfessional] = useState<Professional | null>(null);

  useEffect(() => {
    if (searchMode === 'all') {
      setLoading(true);
      const category = selectedCategory === 'all' ? undefined : selectedCategory;
      api.getProfessionals(category)
        .then(setProfessionals)
        .finally(() => setLoading(false));
    }
  }, [selectedCategory, searchMode]);

  const handleLocationChange = async (latitude: number, longitude: number, searchRadius: number) => {
    setLoading(true);
    setSearchMode('nearby');
    setShowMap(true);
    setMapCenter([latitude, longitude]);
    
    try {
      const params: any = {
        lat: latitude,
        lng: longitude,
        radius: searchRadius,
        category: selectedCategory === 'all' ? undefined : selectedCategory
      };

      const results = await api.getProfessionalsNearby(params);
      if (Array.isArray(results)) {
        setNearbyResults(results);
      } else {
        console.error('Invalid response format:', results);
        alert('Failed to search by location. Please try again.');
        setSearchMode('all');
      }
    } catch (error) {
      console.error('Location search error:', error);
      alert('Failed to search by location. Please try again.');
      setSearchMode('all');
    } finally {
      setLoading(false);
    }
  };

  const handleProfessionalClick = (professional: Professional) => {
    setSelectedProfessional(professional);
    const element = document.getElementById(`professional-${professional.id}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const displayedProfessionals = searchMode === 'nearby' ? nearbyResults : professionals;

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
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1">
            {/* Partner CTA Card */}
            <div className="border-t-2 border-[#C5A14E] mb-8">
              <Card className="mt-6 bg-[#012B1A] border-2 border-[#C5A14E] rounded-xl shadow-md">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row items-center gap-6">
                    <div className="flex-shrink-0">
                      <Briefcase className="w-16 h-16 text-[#C5A14E]" />
                    </div>
                    <div className="flex-1 text-center md:text-left">
                      <h3 className="text-2xl font-heading font-bold text-white mb-2">
                        Join Our Professional Network
                      </h3>
                      <p className="text-gray-300 mb-4">
                        Feature your business or service on BlkXchange™ and grow your visibility nationwide.
                      </p>
                      <Link to="/partner">
                        <Button className="bg-[#C5A14E] text-white hover:bg-opacity-90 hover:shadow-2xl rounded-full px-8 py-3 text-lg font-semibold shadow-lg transition-all">
                          Become a Partner
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Location Search Section */}
            <div className="mb-8">
              <LocationSearchBar 
                onLocationChange={handleLocationChange}
                onLoading={setLoading}
              />
            </div>

            {/* Map Section */}
            {searchMode === 'nearby' && showMap && nearbyResults.length > 0 && (
              <div className="mb-8">
                <ProfessionalMap
                  professionals={nearbyResults}
                  center={mapCenter}
                  onProfessionalClick={handleProfessionalClick}
                />
              </div>
            )}

            {/* Nearby Professionals List */}
            {searchMode === 'nearby' && !loading && (
              <div className="mb-8">
                <NearbyProfessionalsList
                  professionals={nearbyResults}
                  onProfessionalClick={handleProfessionalClick}
                />
              </div>
            )}

            <div className="mb-8 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex items-center gap-4">
            <label className="font-semibold text-brand-black">Filter by:</label>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
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
            {displayedProfessionals.length} {displayedProfessionals.length === 1 ? 'professional' : 'professionals'} found
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="text-xl text-gray-600">Loading professionals...</div>
          </div>
        ) : displayedProfessionals.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-xl text-gray-600">No professionals found{searchMode === 'nearby' ? ' in this area' : ' in this category'}.</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedProfessionals.map((professional) => (
              <Card 
                key={professional.id} 
                id={`professional-${professional.id}`}
                className={`hover:shadow-lg transition-shadow border-2 hover:border-brand-gold ${
                  selectedProfessional?.id === professional.id ? 'border-brand-gold shadow-xl' : ''
                }`}
              >
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

                  <div className="flex items-center gap-2 mb-3">
                    <Badge className="capitalize bg-brand-charcoal text-brand-gold">
                      {professional.category}
                    </Badge>
                    {searchMode === 'nearby' && professional.distance_miles !== undefined && (
                      <Badge className="bg-green-100 text-green-800 border-green-300">
                        <MapPin className="w-3 h-3 mr-1" />
                        {professional.distance_miles} mi
                      </Badge>
                    )}
                  </div>

                  {searchMode === 'nearby' && (professional.city || professional.state) && (
                    <p className="text-sm text-gray-600 mb-2">
                      📍 {professional.city}{professional.city && professional.state ? ', ' : ''}{professional.state}
                    </p>
                  )}

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
          <aside className="hidden md:block">
            <SidebarAd page="professionals" />
          </aside>
        </div>
      </div>
    </div>
  );
}
