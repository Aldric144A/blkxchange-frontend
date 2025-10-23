import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Star, Calendar, CheckCircle, Briefcase, MapPin, Navigation, Map } from 'lucide-react';
import { api } from '../api';
import { Professional } from '../types';
import { SidebarAd } from '../components/ads';

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
  const [zipCode, setZipCode] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [radius, setRadius] = useState(25);
  const [showMap, setShowMap] = useState(false);
  const [nearbyResults, setNearbyResults] = useState<any[]>([]);

  useEffect(() => {
    if (searchMode === 'all') {
      setLoading(true);
      const category = selectedCategory === 'all' ? undefined : selectedCategory;
      api.getProfessionals(category)
        .then(setProfessionals)
        .finally(() => setLoading(false));
    }
  }, [selectedCategory, searchMode]);

  const handleLocationSearch = async () => {
    if (!zipCode && !city) {
      alert('Please enter a ZIP code or city name');
      return;
    }

    setLoading(true);
    setSearchMode('nearby');
    
    try {
      const params: any = {
        radius,
        category: selectedCategory === 'all' ? undefined : selectedCategory
      };

      if (zipCode) {
        params.zip = zipCode;
      } else if (city) {
        params.city = city;
        if (state) params.state = state;
      }

      const results = await api.getProfessionalsNearby(params);
      if (Array.isArray(results)) {
        setNearbyResults(results);
      } else {
        console.error('Invalid response format:', results);
        alert('ZIP/City search requires geocoding API keys. Please use "Use My Location" button instead.');
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

  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }

    setLoading(true);
    setSearchMode('nearby');

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const params: any = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            radius,
            category: selectedCategory === 'all' ? undefined : selectedCategory
          };

          const results = await api.getProfessionalsNearby(params);
          if (Array.isArray(results)) {
            setNearbyResults(results);
          } else {
            console.error('Invalid response format:', results);
            alert('Failed to search by GPS location. Please try again.');
            setSearchMode('all');
          }
        } catch (error) {
          console.error('GPS search error:', error);
          alert('Failed to search by GPS location. Please try again.');
          setSearchMode('all');
        } finally {
          setLoading(false);
        }
      },
      (error) => {
        console.error('Geolocation error:', error);
        alert('Failed to get your location. Please enable location services.');
        setSearchMode('all');
        setLoading(false);
      }
    );
  };

  const handleClearSearch = () => {
    setSearchMode('all');
    setZipCode('');
    setCity('');
    setState('');
    setNearbyResults([]);
    setShowMap(false);
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
            <Card className="mb-8 border-2 border-brand-gold">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <MapPin className="w-5 h-5 text-brand-gold" />
                  <h3 className="text-xl font-semibold text-brand-black">Find Professionals Near You</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">ZIP Code</label>
                    <Input
                      type="text"
                      placeholder="e.g., 33401"
                      value={zipCode}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '').slice(0, 5);
                        setZipCode(value);
                        if (value) {
                          setCity('');
                          setState('');
                        }
                      }}
                      maxLength={5}
                      className="border-gray-300"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">City</label>
                    <Input
                      type="text"
                      placeholder="e.g., Miami"
                      value={city}
                      onChange={(e) => {
                        setCity(e.target.value);
                        if (e.target.value) setZipCode('');
                      }}
                      disabled={!!zipCode}
                      className="border-gray-300"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">State (Optional)</label>
                    <Input
                      type="text"
                      placeholder="e.g., FL"
                      value={state}
                      onChange={(e) => setState(e.target.value.toUpperCase().slice(0, 2))}
                      maxLength={2}
                      disabled={!!zipCode}
                      className="border-gray-300"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">Distance</label>
                    <Select value={radius.toString()} onValueChange={(val) => setRadius(Number(val))}>
                      <SelectTrigger className="border-gray-300">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="10">10 miles</SelectItem>
                        <SelectItem value="25">25 miles</SelectItem>
                        <SelectItem value="50">50 miles</SelectItem>
                        <SelectItem value="100">100 miles</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  <Button 
                    onClick={handleLocationSearch}
                    className="bg-brand-gold text-brand-black hover:bg-opacity-90"
                    disabled={!zipCode && !city}
                  >
                    <MapPin className="w-4 h-4 mr-2" />
                    Search by Location
                  </Button>

                  <Button 
                    onClick={handleUseMyLocation}
                    variant="outline"
                    className="border-brand-gold text-brand-gold hover:bg-brand-gold hover:text-brand-black"
                  >
                    <Navigation className="w-4 h-4 mr-2" />
                    Use My Location
                  </Button>

                  {searchMode === 'nearby' && (
                    <>
                      <Button 
                        onClick={handleClearSearch}
                        variant="outline"
                        className="border-gray-400 text-gray-700 hover:bg-gray-100"
                      >
                        Clear Search
                      </Button>

                      <Button 
                        onClick={() => setShowMap(!showMap)}
                        variant="outline"
                        className="border-brand-gold text-brand-gold hover:bg-brand-gold hover:text-brand-black"
                      >
                        <Map className="w-4 h-4 mr-2" />
                        {showMap ? 'Hide Map' : 'Show Map'}
                      </Button>
                    </>
                  )}
                </div>

                {searchMode === 'nearby' && nearbyResults.length > 0 && (
                  <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm text-green-800">
                      ✓ Found {nearbyResults.length} professional{nearbyResults.length !== 1 ? 's' : ''} within {radius} miles
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

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
