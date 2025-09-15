'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Container,
  Title,
  Text,
  Button,
  Group,
  Stack,
  Card,
  SimpleGrid,
  ThemeIcon,
  Badge,
  Image,
  Overlay,
  Center,
  Box,
} from '@mantine/core';
import {
  IconHome,
  IconStar,
  IconShield,
  IconClock,
  IconMapPin,
  IconSearch,
  IconHeart,
  IconUsers,
} from '@tabler/icons-react';
import { useAuth } from '@/contexts/AuthContext';
import { useThemeStyles } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Hero } from '@/components/Hero';
import { CardsCarousel } from '@/components/CardsCarousel';
import { MapWithSearch } from '@/components/MapWithSearch';

const getFeatures = (t: any) => [
  {
    icon: IconHome,
    title: t.homepage.uniqueProperties,
    description: t.homepage.uniquePropertiesDesc,
    color: 'blue',
  },
  {
    icon: IconShield,
    title: t.homepage.secureBooking,
    description: t.homepage.secureBookingDesc,
    color: 'green',
  },
  {
    icon: IconClock,
    title: t.homepage.support247,
    description: t.homepage.support247Desc,
    color: 'orange',
  },
  {
    icon: IconStar,
    title: t.homepage.topRated,
    description: t.homepage.topRatedDesc,
    color: 'yellow',
  },
];

const getStats = (t: any) => [
  { label: t.homepage.properties, value: '500+' },
  { label: t.homepage.happyGuests, value: '10K+' },
  { label: t.homepage.cities, value: '25+' },
  { label: t.homepage.countries, value: '5+' },
];

const getPopularDestinations = (t: any) => [
  {
    name: t.homepage.buzauCenter,
    properties: 45,
    image: '/images/buzau-center.jpg',
    description: t.homepage.buzauCenterDesc,
  },
  {
    name: t.homepage.carpathianMountains,
    properties: 28,
    image: '/images/carpathians.jpg',
    description: t.homepage.carpathianMountainsDesc,
  },
  {
    name: t.homepage.muddyVolcanoes,
    properties: 12,
    image: '/images/muddy-volcanoes.jpg',
    description: t.homepage.muddyVolcanoesDesc,
  },
  {
    name: t.homepage.siriuLake,
    properties: 18,
    image: '/images/siriu-lake.jpg',
    description: t.homepage.siriuLakeDesc,
  },
];

export default function HomePage() {
  const router = useRouter();
  const { user } = useAuth();
  const themeStyles = useThemeStyles();
  const { t } = useLanguage();

  const features = getFeatures(t);
  const stats = getStats(t);
  const popularDestinations = getPopularDestinations(t);

  // Redirect authenticated users to dashboard
  useEffect(() => {
    if (user) {
      router.push('/dashboard');
    }
  }, [user, router]);

  // Don't render home page if user is authenticated
  if (user) {
    return null;
  }

  return (
    <div>
      {/* Hero Section */}
      <Hero />

      {/* Stats Section */}
      <Container size={1200} py={{ base: 'lg', sm: 'xl' }} px={{ base: 'md', sm: 'xl' }}>
        <SimpleGrid cols={{ base: 2, md: 4 }} spacing={{ base: 'md', sm: 'xl' }}>
          {stats.map((stat, index) => (
            <Center key={index}>
              <Stack align="center" gap="xs">
                <Text size="2.5rem" fw={900} c="blue">
                  {stat.value}
                </Text>
                <Text size="lg" c="dimmed" fw={500} ta="center">
                  {stat.label}
                </Text>
              </Stack>
            </Center>
          ))}
        </SimpleGrid>
      </Container>

      {/* Features Section */}
      <Box bg="gray.0" py={{ base: 'lg', sm: 'xl' }}>
        <Container size={1200} px={{ base: 'md', sm: 'xl' }}>
          <Stack align="center" gap={{ base: 'lg', sm: 'xl' }}>
            <div style={{ textAlign: 'center' }}>
              <Title order={2} size="2.5rem" mb={{ base: 'sm', sm: 'md' }}>
                {t.homepage.whyChooseTitle}
              </Title>
              <Text size="lg" c="dimmed" maw={600} px={{ base: 'sm', sm: 0 }}>
                {t.homepage.whyChooseSubtitle}
              </Text>
            </div>
            <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing={{ base: 'md', sm: 'lg', md: 'xl' }}>
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <Card key={index} shadow="sm" padding={{ base: 'md', sm: 'lg', md: 'xl' }} radius="md" withBorder>
                    <Stack align="center" ta="center" gap={{ base: 'sm', sm: 'md' }}>
                      <ThemeIcon size={60} radius="md" color={feature.color}>
                        <Icon size={30} />
                      </ThemeIcon>
                      <Title order={3} size="h4">
                        {feature.title}
                      </Title>
                      <Text c="dimmed" size="md">
                        {feature.description}
                      </Text>
                    </Stack>
                  </Card>
                );
              })}
            </SimpleGrid>
          </Stack>
        </Container>
      </Box>

      {/* Popular Destinations */}
      <Container size={1200} py="xl">
        <Stack gap="xl">
          <div style={{ textAlign: 'center' }}>
            <Title order={2} size="2.5rem" mb="md">
              {t.homepage.popularDestinations}
            </Title>
            <Text size="lg" c="dimmed" maw={600} mx="auto">
              {t.homepage.exploreMore}
            </Text>
          </div>
          <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="xl">
            {popularDestinations.map((destination, index) => (
              <Card key={index} shadow="sm" radius="md" withBorder style={{ overflow: 'hidden' }}>
                <Card.Section>
                  <Box style={{ position: 'relative', height: 200 }}>
                    <div
                      style={{
                        width: '100%',
                        height: '100%',
                        background: `linear-gradient(45deg, #667eea 0%, #764ba2 100%)`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: '3rem',
                      }}
                    >
                      <IconMapPin size={60} />
                    </div>
                    <Overlay
                      gradient="linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, .85) 90%)"
                      opacity={0.4}
                    />
                  </Box>
                </Card.Section>
                <Stack gap="xs" mt="md" pb="md">
                  <Group justify="space-between">
                    <Title order={4}>{destination.name}</Title>
                    <Badge color="blue" variant="light">
                      {destination.properties} {t.homepage.properties.toLowerCase()}
                    </Badge>
                  </Group>
                  <Text size="sm" c="dimmed">
                    {destination.description}
                  </Text>
                </Stack>
              </Card>
            ))}
          </SimpleGrid>
        </Stack>
      </Container>

      {/* Property Types Carousel */}
      <Container size={1200} py="xl">
        <Stack gap="xl">
          <div style={{ textAlign: 'center' }}>
            <Title order={2} size="2.5rem" mb="md">
              Browse by Property Type
            </Title>
            <Text size="lg" c="dimmed" maw={600} mx="auto">
              Find the perfect accommodation for your stay
            </Text>
          </div>
          <CardsCarousel />
        </Stack>
      </Container>

      {/* Map Search Section */}
      <Container size={1200} py={{ base: 'lg', sm: 'xl' }}>
        <MapWithSearch
          title={t.homepage.exploreLocations || "Explore Locations"}
          description={t.homepage.exploreLocationsDesc || "Search for any city, state, or country and discover amazing properties in that area"}
          height="600px"
          defaultCenter={[45.6427, 25.5887]} // Brașov, Romania
          defaultZoom={8}
        />
      </Container>

      {/* CTA Section */}
      <Box
        style={{
          background: themeStyles.isDark 
            ? 'linear-gradient(135deg, #4c1d95 0%, #5b21b6 100%)'
            : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
        }}
        py="xl"
      >
        <Container size={1200}>
          <Stack align="center" gap="xl" ta="center">
            <Title order={2} size="2.5rem">
              {t.homepage.ctaTitle}
            </Title>
            <Text size="lg" maw={600} c="gray.2">
              {t.homepage.ctaDescription}
            </Text>
            <Group gap="md">
              <Button
                size="lg"
                leftSection={<IconSearch size={18} />}
                component={Link}
                href="/search"
                variant="white"
                color="dark"
              >
                {t.homepage.browseProperties}
              </Button>
              <Button
                size="lg"
                leftSection={<IconUsers size={18} />}
                variant="outline"
                color="white"
                component={Link}
                href="/auth/register?role=owner"
              >
                {t.homepage.becomeHost}
              </Button>
            </Group>
          </Stack>
        </Container>
      </Box>
    </div>
  );
}
