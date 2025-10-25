import { useState } from 'react';
import { MapPin, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface LocationSearchBarProps {
  onLocationChange: (latitude: number, longitude: number, radius: number) => void;
  onLoading: (loading: boolean) => void;
}

export function LocationSearchBar({ onLocationChange, onLoading }: LocationSearchBarProps) {
  const [zipCode, setZipCode] = useState('');
  const [radius, setRadius] = useState(25);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [error, setError] = useState('');

  const handleUseMyLocation = () => {
    setError('');
    setIsGettingLocation(true);
    onLoading(true);

    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      setIsGettingLocation(false);
      onLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        onLocationChange(latitude, longitude, radius);
        setIsGettingLocation(false);
        onLoading(false);
      },
      (error) => {
        console.error('Error getting location:', error);
        setError('Unable to get your location. Please enter a ZIP code instead.');
        setIsGettingLocation(false);
        onLoading(false);
      }
    );
  };

  const handleZipCodeSearch = async () => {
    if (!zipCode.trim()) {
      setError('Please enter a ZIP code');
      return;
    }

    setError('');
    onLoading(true);

    try {
      const zipToCoords: { [key: string]: [number, number] } = {
        '10001': [40.7506, -73.9971],
        '90001': [33.9731, -118.2479],
        '60601': [41.8858, -87.6229],
        '77001': [29.7499, -95.3585],
        '85001': [33.4484, -112.0740],
        '19101': [39.9526, -75.1652],
        '78201': [29.4241, -98.4936],
        '92101': [32.7157, -117.1611],
        '75201': [32.7767, -96.7970],
        '95101': [37.3382, -121.8863],
        '33101': [25.7617, -80.1918],
        '30301': [33.7490, -84.3880],
      };

      const coords = zipToCoords[zipCode];
      
      if (coords) {
        onLocationChange(coords[0], coords[1], radius);
      } else {
        setError('ZIP code not found. Please use "Use My Location" or try: 10001 (NYC), 90001 (LA), 60601 (Chicago), 33101 (Miami)');
      }
    } catch (error) {
      console.error('Error geocoding ZIP code:', error);
      setError('Unable to find location for this ZIP code');
    } finally {
      onLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-r from-brand-black to-brand-charcoal rounded-2xl p-6 shadow-lg border border-brand-gold/20">
      <div className="flex items-center gap-2 mb-4">
        <MapPin className="w-6 h-6 text-brand-gold" />
        <h2 className="text-2xl font-bold text-white">Find Professionals Near You</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* ZIP Code Input */}
        <div className="flex flex-col gap-2">
          <label htmlFor="zipCode" className="text-sm font-medium text-brand-gold">
            ZIP Code or City
          </label>
          <Input
            id="zipCode"
            type="text"
            placeholder="Enter ZIP code"
            value={zipCode}
            onChange={(e) => setZipCode(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleZipCodeSearch()}
            className="bg-white/10 border-brand-gold/30 text-white placeholder:text-gray-400"
          />
        </div>

        {/* Radius Selector */}
        <div className="flex flex-col gap-2">
          <label htmlFor="radius" className="text-sm font-medium text-brand-gold">
            Search Radius
          </label>
          <select
            id="radius"
            value={radius}
            onChange={(e) => setRadius(Number(e.target.value))}
            className="bg-white/10 border border-brand-gold/30 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-gold"
          >
            <option value={10}>10 miles</option>
            <option value={25}>25 miles</option>
            <option value={50}>50 miles</option>
            <option value={100}>100 miles</option>
          </select>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2 justify-end">
          <Button
            onClick={handleZipCodeSearch}
            className="bg-brand-gold hover:bg-brand-gold/90 text-black font-semibold"
          >
            Search
          </Button>
          <Button
            onClick={handleUseMyLocation}
            disabled={isGettingLocation}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
          >
            {isGettingLocation ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Getting Location...
              </>
            ) : (
              <>
                <MapPin className="w-4 h-4 mr-2" />
                Use My Location
              </>
            )}
          </Button>
        </div>
      </div>

      {error && (
        <div className="mt-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg">
          <p className="text-sm text-red-200">{error}</p>
        </div>
      )}
    </div>
  );
}
