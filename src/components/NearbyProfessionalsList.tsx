import { MapPin, Star, CheckCircle, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Professional } from '../types';

interface NearbyProfessionalsListProps {
  professionals: Professional[];
  onProfessionalClick: (professional: Professional) => void;
}

export function NearbyProfessionalsList({ professionals, onProfessionalClick }: NearbyProfessionalsListProps) {
  if (professionals.length === 0) {
    return (
      <div className="text-center py-12">
        <MapPin className="w-16 h-16 text-brand-gold mx-auto mb-4 opacity-50" />
        <h3 className="text-xl font-semibold text-white mb-2">No professionals found nearby</h3>
        <p className="text-gray-400">Try expanding your search radius or using a different location</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-2xl font-bold text-white mb-4">
        {professionals.length} Professional{professionals.length !== 1 ? 's' : ''} Found
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {professionals.map((professional) => (
          <div
            key={professional.id}
            className="bg-gradient-to-br from-brand-black to-brand-charcoal rounded-xl overflow-hidden shadow-lg border border-brand-gold/20 hover:border-brand-gold/50 transition-all duration-300 hover:shadow-xl hover:shadow-brand-gold/10"
          >
            {/* Professional Image */}
            <div className="relative h-48 bg-gradient-to-br from-brand-gold/20 to-emerald-600/20">
              {professional.image_url ? (
                <img
                  src={professional.image_url}
                  alt={professional.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="w-24 h-24 rounded-full bg-brand-gold/30 flex items-center justify-center">
                    <span className="text-4xl font-bold text-brand-gold">
                      {professional.name.charAt(0)}
                    </span>
                  </div>
                </div>
              )}
              
              {/* Distance Badge */}
              <div className="absolute top-3 right-3 bg-brand-gold text-black px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                {professional.distance_miles?.toFixed(1) || '0.0'} mi
              </div>
              
              {/* Verified Badge */}
              {professional.verified && (
                <div className="absolute top-3 left-3 bg-emerald-600 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1 shadow-lg">
                  <CheckCircle className="w-3 h-3" />
                  Verified
                </div>
              )}
            </div>

            {/* Professional Info */}
            <div className="p-5">
              <h4 className="text-xl font-bold text-white mb-1 line-clamp-1">
                {professional.name}
              </h4>
              <p className="text-brand-gold text-sm font-medium mb-2 line-clamp-1">
                {professional.title}
              </p>

              {/* Location */}
              <div className="flex items-center gap-1 text-gray-400 text-sm mb-3">
                <MapPin className="w-4 h-4" />
                <span className="line-clamp-1">
                  {professional.city}, {professional.state}
                </span>
              </div>

              {/* Rating and Hourly Rate */}
              <div className="flex items-center justify-between mb-4">
                {professional.rating > 0 && (
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    <span className="text-white font-semibold">{professional.rating.toFixed(1)}</span>
                  </div>
                )}
                
                {professional.hourly_rate && (
                  <div className="flex items-center gap-1 text-brand-gold font-semibold">
                    <DollarSign className="w-4 h-4" />
                    <span>{professional.hourly_rate}/hr</span>
                  </div>
                )}
              </div>

              {/* View Profile Button */}
              <Button
                onClick={() => onProfessionalClick(professional)}
                className="w-full bg-brand-gold hover:bg-brand-gold/90 text-black font-semibold"
              >
                View Profile
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
