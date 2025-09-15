'use client';

import { useState } from 'react';
import { Container, Title, Text, Stack, Paper, Group, Badge } from '@mantine/core';
import { IconMapPin } from '@tabler/icons-react';
import Map from '@/components/Map/Map';
import { LocationResult } from '@/lib/locationSearch';

interface MapWithSearchProps {
  title?: string;
  description?: string;
  height?: string;
  defaultCenter?: [number, number];
  defaultZoom?: number;
}

export function MapWithSearch({
  title = "Location Search",
  description = "Search for any city, state, or country and explore it on the map",
  height = "500px",
  defaultCenter = [45.6427, 25.5887], // Brașov, Romania
  defaultZoom = 8
}: MapWithSearchProps) {
  const [selectedLocation, setSelectedLocation] = useState<LocationResult | null>(null);
  const [markers, setMarkers] = useState<Array<{
    id: string;
    position: [number, number];
    title: string;
    description?: string;
  }>>([]);

  const handleLocationSelect = (location: LocationResult) => {
    setSelectedLocation(location);
    
    // Add marker for the selected location
    if (location.latitude && location.longitude) {
      const newMarker = {
        id: location.id,
        position: [location.latitude, location.longitude] as [number, number],
        title: location.name,
        description: location.parent || `${location.type.charAt(0).toUpperCase() + location.type.slice(1)}`
      };
      
      // Replace existing markers with the new one
      setMarkers([newMarker]);
    }
  };

  const getLocationTypeColor = (type: string) => {
    switch (type) {
      case 'country':
        return 'blue';
      case 'state':
        return 'green';
      case 'city':
        return 'orange';
      default:
        return 'gray';
    }
  };

  const getLocationTypeLabel = (type: string) => {
    switch (type) {
      case 'country':
        return 'Country';
      case 'state':
        return 'State/Province';
      case 'city':
        return 'City';
      default:
        return 'Location';
    }
  };

  return (
    <Container size="xl">
      <Stack gap="lg">
        <div>
          <Title order={2} mb="xs">{title}</Title>
          <Text c="dimmed" size="sm">{description}</Text>
        </div>

        {selectedLocation && (
          <Paper p="md" withBorder radius="md">
            <Group gap="sm">
              <IconMapPin size={20} color="var(--mantine-color-blue-6)" />
              <div>
                <Group gap="xs" align="center">
                  <Text fw={500} size="sm">{selectedLocation.name}</Text>
                  <Badge 
                    size="xs" 
                    color={getLocationTypeColor(selectedLocation.type)}
                    variant="light"
                  >
                    {getLocationTypeLabel(selectedLocation.type)}
                  </Badge>
                </Group>
                {selectedLocation.parent && (
                  <Text size="xs" c="dimmed">{selectedLocation.parent}</Text>
                )}
                {selectedLocation.latitude && selectedLocation.longitude && (
                  <Text size="xs" c="dimmed">
                    Coordinates: {selectedLocation.latitude.toFixed(4)}, {selectedLocation.longitude.toFixed(4)}
                  </Text>
                )}
              </div>
            </Group>
          </Paper>
        )}

        <Map
          center={defaultCenter}
          zoom={defaultZoom}
          height={height}
          markers={markers}
          showSearch={true}
          onLocationSelect={handleLocationSelect}
          onMarkerClick={(markerId) => {
            console.log('Marker clicked:', markerId);
          }}
        />
      </Stack>
    </Container>
  );
}