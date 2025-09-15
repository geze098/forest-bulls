'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Container,
  Paper,
  Title,
  Text,
  Button,
  Stack,
  Group,
  Card,
  Image,
  Badge,
  ActionIcon,
  Grid,
  LoadingOverlay,
  Alert,
  Center,
  Divider,
} from '@mantine/core';
import { IconHeart, IconTrash, IconEye, IconMapPin, IconCurrencyDollar, IconHeartOff } from '@tabler/icons-react';
import { useAuth } from '@/contexts/AuthContext';
import { useThemeStyles } from '@/contexts/ThemeContext';
import { notifications } from '@mantine/notifications';
import Link from 'next/link';

interface WishlistItem {
  id: string;
  title: string;
  description: string;
  price: number;
  location: string;
  image_url?: string;
  category: string;
  created_at: string;
}

export default function WishlistPage() {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, loading: authLoading } = useAuth();
  const themeStyles = useThemeStyles();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login');
      return;
    }

    if (user) {
      fetchWishlistItems();
    }
  }, [user, authLoading, router]);

  const fetchWishlistItems = async () => {
    try {
      setLoading(true);
      // Simulate API call - replace with actual implementation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data - replace with actual API call
      const mockItems: WishlistItem[] = [
        {
          id: '1',
          title: 'Beautiful Apartment in City Center',
          description: 'Modern 2-bedroom apartment with great amenities',
          price: 150000,
          location: 'Buzau, Romania',
          image_url: '/api/placeholder/300/200',
          category: 'Apartment',
          created_at: new Date().toISOString(),
        },
        {
          id: '2',
          title: 'Cozy House with Garden',
          description: 'Charming house with a beautiful garden and parking',
          price: 200000,
          location: 'Buzau, Romania',
          image_url: '/api/placeholder/300/200',
          category: 'House',
          created_at: new Date().toISOString(),
        },
      ];
      
      setWishlistItems(mockItems);
    } catch (err) {
      setError('Failed to load wishlist items');
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (itemId: string) => {
    try {
      // Simulate API call - replace with actual implementation
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setWishlistItems(prev => prev.filter(item => item.id !== itemId));
      
      notifications.show({
        title: 'Removed from wishlist',
        message: 'Item has been removed from your wishlist.',
        color: 'blue',
        icon: <IconHeartOff size={16} />,
      });
    } catch (err) {
      notifications.show({
        title: 'Error',
        message: 'Failed to remove item from wishlist.',
        color: 'red',
      });
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ro-RO', {
      style: 'currency',
      currency: 'RON',
    }).format(price);
  };

  if (authLoading || loading) {
    return (
      <Container size="lg" my={40}>
        <LoadingOverlay visible />
      </Container>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <Container size="lg" my={40}>
      <Paper withBorder shadow="md" p={30} radius="md">
        <Group justify="space-between" mb="xl">
          <div>
            <Title order={2} mb="xs">
              <Group>
                <IconHeart size={28} color="red" />
                My Wishlist
              </Group>
            </Title>
            <Text c="dimmed" size="sm">
              {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'} saved
            </Text>
          </div>
          
          <Button
            component={Link}
            href="/search"
            variant="light"
          >
            Browse Properties
          </Button>
        </Group>

        <Divider mb="xl" />

        {error && (
          <Alert color="red" mb="md">
            {error}
          </Alert>
        )}

        {wishlistItems.length === 0 ? (
          <Center py={60}>
            <Stack align="center" gap="md">
              <IconHeartOff size={64} color="gray" />
              <Title order={3} c="dimmed">
                Your wishlist is empty
              </Title>
              <Text c="dimmed" ta="center" size="sm">
                Start browsing properties and save your favorites here
              </Text>
              <Button
                component={Link}
                href="/search"
                leftSection={<IconEye size={16} />}
              >
                Browse Properties
              </Button>
            </Stack>
          </Center>
        ) : (
          <Grid>
            {wishlistItems.map((item) => (
              <Grid.Col key={item.id} span={{ base: 12, sm: 6, lg: 4 }}>
                <Card 
                  withBorder 
                  shadow="sm" 
                  radius="md" 
                  h="100%"
                  style={{
                    backgroundColor: themeStyles.cardBg,
                    borderColor: themeStyles.borderColor,
                  }}
                >
                  <Card.Section>
                    <Image
                      src={item.image_url}
                      height={200}
                      alt={item.title}
                      fallbackSrc="https://via.placeholder.com/300x200?text=Property+Image"
                    />
                  </Card.Section>

                  <Stack gap="sm" p="md">
                    <Group justify="space-between" align="flex-start">
                      <div style={{ flex: 1 }}>
                        <Text fw={600} size="sm" lineClamp={2}>
                          {item.title}
                        </Text>
                        <Text size="xs" c="dimmed" mt={4}>
                          <IconMapPin size={12} style={{ marginRight: 4 }} />
                          {item.location}
                        </Text>
                      </div>
                      
                      <ActionIcon
                        color="red"
                        variant="light"
                        size="sm"
                        onClick={() => removeFromWishlist(item.id)}
                      >
                        <IconTrash size={14} />
                      </ActionIcon>
                    </Group>

                    <Text size="xs" c="dimmed" lineClamp={2}>
                      {item.description}
                    </Text>

                    <Group justify="space-between" align="center">
                      <Badge variant="light" size="sm">
                        {item.category}
                      </Badge>
                      
                      <Text fw={700} c="blue" size="sm">
                        <IconCurrencyDollar size={14} style={{ marginRight: 2 }} />
                        {formatPrice(item.price)}
                      </Text>
                    </Group>

                    <Button
                      variant="light"
                      size="sm"
                      leftSection={<IconEye size={14} />}
                      component={Link}
                      href={`/properties/${item.id}`}
                    >
                      View Details
                    </Button>
                  </Stack>
                </Card>
              </Grid.Col>
            ))}
          </Grid>
        )}

        {wishlistItems.length > 0 && (
          <Group justify="center" mt="xl">
            <Text c="dimmed" size="sm">
              Last updated: {new Date().toLocaleDateString()}
            </Text>
          </Group>
        )}
      </Paper>
    </Container>
  );
}