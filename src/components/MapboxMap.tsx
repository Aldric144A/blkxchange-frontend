import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Professional } from '../types';

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN || '';

interface MapboxMapProps {
  professionals: Professional[];
  onProfessionalClick?: (professional: Professional) => void;
  center?: [number, number];
  zoom?: number;
}

export function MapboxMap({ professionals, onProfessionalClick, center = [-98.5795, 39.8283], zoom = 4 }: MapboxMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: center,
      zoom: zoom
    });

    map.current.on('load', () => {
      setMapLoaded(true);
    });

    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!map.current || !mapLoaded) return;

    const professionalsWithCoords = professionals.filter(
      p => p.latitude !== null && p.latitude !== undefined && 
           p.longitude !== null && p.longitude !== undefined
    );

    const existingMarkers = document.querySelectorAll('.mapbox-marker');
    existingMarkers.forEach(marker => marker.remove());

    const geojsonData: GeoJSON.FeatureCollection = {
      type: 'FeatureCollection',
      features: professionalsWithCoords.map(prof => ({
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [prof.longitude!, prof.latitude!]
        },
        properties: {
          id: prof.id,
          name: prof.name,
          title: prof.title,
          category: prof.category,
          verified: prof.verified,
          membership_tier: prof.membership_tier,
          image_url: prof.image_url,
          hourly_rate: prof.hourly_rate
        }
      }))
    };

    if (map.current.getSource('professionals')) {
      (map.current.getSource('professionals') as mapboxgl.GeoJSONSource).setData(geojsonData);
    } else {
      map.current.addSource('professionals', {
        type: 'geojson',
        data: geojsonData,
        cluster: true,
        clusterMaxZoom: 14,
        clusterRadius: 50
      });

      map.current.addLayer({
        id: 'clusters',
        type: 'circle',
        source: 'professionals',
        filter: ['has', 'point_count'],
        paint: {
          'circle-color': [
            'step',
            ['get', 'point_count'],
            '#C5A14E',
            10,
            '#00A86B',
            30,
            '#1A1A1A'
          ],
          'circle-radius': [
            'step',
            ['get', 'point_count'],
            20,
            10,
            30,
            30,
            40
          ]
        }
      });

      map.current.addLayer({
        id: 'cluster-count',
        type: 'symbol',
        source: 'professionals',
        filter: ['has', 'point_count'],
        layout: {
          'text-field': '{point_count_abbreviated}',
          'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
          'text-size': 12
        },
        paint: {
          'text-color': '#ffffff'
        }
      });

      map.current.addLayer({
        id: 'unclustered-point',
        type: 'circle',
        source: 'professionals',
        filter: ['!', ['has', 'point_count']],
        paint: {
          'circle-color': [
            'match',
            ['get', 'verified'],
            true, '#C5A14E',
            '#00A86B'
          ],
          'circle-radius': 8,
          'circle-stroke-width': 2,
          'circle-stroke-color': '#ffffff'
        }
      });

      map.current.on('click', 'clusters', (e) => {
        if (!map.current) return;
        const features = map.current.queryRenderedFeatures(e.point, {
          layers: ['clusters']
        });
        const clusterId = features[0].properties?.cluster_id;
        const source = map.current.getSource('professionals') as mapboxgl.GeoJSONSource;
        
        source.getClusterExpansionZoom(clusterId, (err, zoom) => {
          if (err || !map.current || zoom === null || zoom === undefined) return;

          const coordinates = (features[0].geometry as GeoJSON.Point).coordinates;
          map.current.easeTo({
            center: [coordinates[0], coordinates[1]],
            zoom: zoom
          });
        });
      });

      map.current.on('click', 'unclustered-point', (e) => {
        if (!e.features || !e.features[0]) return;
        
        const coordinates = (e.features[0].geometry as GeoJSON.Point).coordinates.slice() as [number, number];
        const properties = e.features[0].properties;

        const professional = professionalsWithCoords.find(p => p.id === properties?.id);
        
        if (professional && onProfessionalClick) {
          onProfessionalClick(professional);
        }

        const popupContent = `
          <div class="p-3 min-w-[200px]">
            <div class="flex items-center gap-2 mb-2">
              <h3 class="font-bold text-base">${properties?.name || 'Unknown'}</h3>
              ${properties?.verified ? '<span class="text-yellow-500">✓</span>' : ''}
            </div>
            <p class="text-sm text-gray-600 mb-1">${properties?.title || ''}</p>
            <p class="text-xs text-gray-500 capitalize mb-2">${properties?.category || ''}</p>
            ${properties?.hourly_rate ? `<p class="text-sm font-semibold text-green-600">$${properties.hourly_rate}/hr</p>` : ''}
            <button 
              onclick="window.location.href='#professional-${properties?.id}'" 
              class="mt-2 w-full bg-[#C5A14E] text-white px-3 py-1 rounded text-sm hover:bg-[#C5A14E]/90"
            >
              View Profile
            </button>
          </div>
        `;

        new mapboxgl.Popup()
          .setLngLat([coordinates[0], coordinates[1]])
          .setHTML(popupContent)
          .addTo(map.current!);
      });

      map.current.on('mouseenter', 'clusters', () => {
        if (map.current) map.current.getCanvas().style.cursor = 'pointer';
      });
      map.current.on('mouseleave', 'clusters', () => {
        if (map.current) map.current.getCanvas().style.cursor = '';
      });
      map.current.on('mouseenter', 'unclustered-point', () => {
        if (map.current) map.current.getCanvas().style.cursor = 'pointer';
      });
      map.current.on('mouseleave', 'unclustered-point', () => {
        if (map.current) map.current.getCanvas().style.cursor = '';
      });
    }

    if (professionalsWithCoords.length > 0) {
      const bounds = new mapboxgl.LngLatBounds();
      professionalsWithCoords.forEach(prof => {
        if (prof.longitude && prof.latitude) {
          bounds.extend([prof.longitude, prof.latitude]);
        }
      });
      
      map.current.fitBounds(bounds, {
        padding: 50,
        maxZoom: 12
      });
    }
  }, [professionals, mapLoaded, onProfessionalClick]);

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainer} className="w-full h-full rounded-lg" style={{ minHeight: '500px' }} />
      {!mapLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-gold mx-auto mb-2"></div>
            <p className="text-gray-600">Loading map...</p>
          </div>
        </div>
      )}
    </div>
  );
}
