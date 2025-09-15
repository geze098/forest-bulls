'use client';

import { DynamicMap } from './index';
import { MapProps } from './Map';

interface Property {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  price?: number;
  type?: string;
  rating?: number;
}

interface PropertyMapProps extends Omit<MapProps, 'markers' | 'onMarkerClick'> {
  properties: Property[];
  onPropertyClick?: (property: Property) => void;
  selectedPropertyId?: string;
}

const PropertyMap: React.FC<PropertyMapProps> = ({
  properties,
  onPropertyClick,
  selectedPropertyId,
  center,
  zoom = 12,
  ...mapProps
}) => {
  // Convert properties to map markers
  const markers = properties.map((property) => ({
    id: property.id,
    position: [property.latitude, property.longitude] as [number, number],
    title: property.name,
    description: `${property.address}${property.price ? ` • $${property.price}/night` : ''}${property.rating ? ` • ⭐ ${property.rating}` : ''}`,
  }));

  // Calculate center from properties if not provided
  const mapCenter = center || (
    properties.length > 0
      ? [
          properties.reduce((sum, p) => sum + p.latitude, 0) / properties.length,
          properties.reduce((sum, p) => sum + p.longitude, 0) / properties.length,
        ] as [number, number]
      : [45.6427, 25.5887] as [number, number] // Default to Brașov
  );

  const handleMarkerClick = (markerId: string) => {
    const property = properties.find(p => p.id === markerId);
    if (property && onPropertyClick) {
      onPropertyClick(property);
    }
  };

  return (
    <DynamicMap
      center={mapCenter}
      zoom={zoom}
      markers={markers}
      onMarkerClick={handleMarkerClick}
      {...mapProps}
    />
  );
};

export default PropertyMap;
export type { Property, PropertyMapProps };