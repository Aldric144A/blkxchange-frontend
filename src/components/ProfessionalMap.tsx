import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { ExternalLink, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Professional } from '../types';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const goldIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-gold.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

interface ProfessionalMapProps {
  professionals: Professional[];
  center: [number, number];
  onProfessionalClick: (professional: Professional) => void;
}

function MapUpdater({ center }: { center: [number, number] }) {
  const map = useMap();
  
  useEffect(() => {
    map.setView(center, 10);
  }, [center, map]);
  
  return null;
}

export function ProfessionalMap({ professionals, center, onProfessionalClick }: ProfessionalMapProps) {
  const getDirectionsUrl = (professional: Professional) => {
    if (professional.latitude && professional.longitude) {
      return `https://www.google.com/maps/dir/?api=1&destination=${professional.latitude},${professional.longitude}`;
    }
    return '#';
  };

  return (
    <div className="rounded-2xl overflow-hidden shadow-lg border-2 border-brand-gold/30">
      <MapContainer
        center={center}
        zoom={10}
        style={{ height: '500px', width: '100%' }}
        className="z-0"
      >
        <MapUpdater center={center} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {professionals.map((professional) => {
          if (!professional.latitude || !professional.longitude) return null;
          
          return (
            <Marker
              key={professional.id}
              position={[professional.latitude, professional.longitude]}
              icon={goldIcon}
            >
              <Popup>
                <div className="p-2 min-w-[200px]">
                  <h3 className="font-bold text-lg text-brand-black mb-1">
                    {professional.name}
                  </h3>
                  <p className="text-sm text-gray-700 mb-1">{professional.title}</p>
                  <p className="text-xs text-gray-600 mb-2">
                    {professional.city}, {professional.state}
                  </p>
                  <p className="text-sm font-semibold text-brand-gold mb-3">
                    {professional.distance_miles?.toFixed(1) || '0.0'} miles away
                  </p>
                  
                  <div className="flex flex-col gap-2">
                    <Button
                      onClick={() => onProfessionalClick(professional)}
                      className="w-full bg-brand-gold hover:bg-brand-gold/90 text-black text-sm py-1"
                      size="sm"
                    >
                      View Profile
                    </Button>
                    <a
                      href={getDirectionsUrl(professional)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-1 w-full bg-emerald-600 hover:bg-emerald-700 text-white text-sm py-1 px-3 rounded-md transition-colors"
                    >
                      <MapPin className="w-3 h-3" />
                      Get Directions
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
