'use client';

import { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Stack } from '@mantine/core';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { LocationSearchInput } from '@/components/LocationSearchInput';
import { LocationResult } from '@/lib/locationSearch';

// Fix for default markers in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

export interface MapProps {
  center?: [number, number];
  zoom?: number;
  markers?: {
    id: string;
    position: [number, number];
    title: string;
    description?: string;
  }[];
  height?: string;
  width?: string;
  className?: string;
  onMarkerClick?: (markerId: string) => void;
  showSearch?: boolean;
  onLocationSelect?: (location: LocationResult) => void;
}

// Component to handle map center changes
function MapController({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  
  useEffect(() => {
    map.setView(center, zoom);
  }, [map, center, zoom]);
  
  return null;
}

const Map: React.FC<MapProps> = ({
  center = [45.6427, 25.5887], // Default to Brașov, Romania
  zoom = 13,
  markers = [],
  height = '400px',
  width = '100%',
  className = '',
  onMarkerClick,
  showSearch = true,
  onLocationSelect,
}) => {
  const mapRef = useRef<L.Map | null>(null);
  const [mapCenter, setMapCenter] = useState<[number, number]>(center);
  const [mapZoom, setMapZoom] = useState(zoom);
  const [searchQuery, setSearchQuery] = useState('');
  
  const handleLocationSelect = (location: LocationResult) => {
    if (location.latitude && location.longitude) {
      const newCenter: [number, number] = [location.latitude, location.longitude];
      setMapCenter(newCenter);
      
      // Set zoom level based on location type
      let newZoom = 10;
      switch (location.type) {
        case 'country':
          newZoom = 6;
          break;
        case 'state':
          newZoom = 8;
          break;
        case 'city':
          newZoom = 12;
          break;
        default:
          newZoom = 10;
      }
      setMapZoom(newZoom);
      
      // Add a marker for the selected location
      const newMarker = {
        id: location.id,
        position: newCenter,
        title: location.name,
        description: location.parent || `${location.type.charAt(0).toUpperCase() + location.type.slice(1)}`
      };
      
      // Call the parent callback if provided
      onLocationSelect?.(location);
    }
  };

  useEffect(() => {
    // Ensure Leaflet is properly initialized on client side
    if (typeof window !== 'undefined') {
      // Any additional client-side initialization can go here
    }
  }, []);

  return (
    <Stack gap="md" style={{ width }}>
      {showSearch && (
        <LocationSearchInput
          onLocationSelect={handleLocationSelect}
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search for cities, states, or countries..."
        />
      )}
      
      <div className={`map-container ${className}`} style={{ height, width: '100%', zIndex: 1 }}>
        <MapContainer
          center={mapCenter}
          zoom={mapZoom}
          style={{ height: '100%', width: '100%', zIndex: 1 }}
          className={className}
          attributionControl={false}
          scrollWheelZoom={true}
          touchZoom={true}
          doubleClickZoom={true}
        >
          <MapController center={mapCenter} zoom={mapZoom} />
          <TileLayer
            attribution=''
            url="https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png"
          />
          {markers.map((marker) => (
            <Marker
              key={marker.id}
              position={marker.position}
              eventHandlers={{
                click: () => onMarkerClick?.(marker.id),
              }}
            >
              <Popup>
                <div>
                  <h3 className="font-semibold text-lg">{marker.title}</h3>
                  {marker.description && (
                    <p className="text-sm text-gray-600 mt-1">{marker.description}</p>
                  )}
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </Stack>
  );
};

export default Map;