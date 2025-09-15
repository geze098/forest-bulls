'use client';

import { useAuth, withAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { 
  Container, 
  Title, 
  Grid, 
  Card, 
  Text, 
  Group, 
  Badge, 
  Stack,
  SimpleGrid,
  Paper,
  ThemeIcon,
  Progress,
  ActionIcon,
  Menu,
  Button,
  Divider,
  Avatar,
  Loader,
  Center
} from '@mantine/core';
import { 
  IconHome, 
  IconUsers, 
  IconCalendar, 
  IconCurrencyDollar,
  IconTrendingUp,
  IconStar,
  IconDots,
  IconEye,
  IconEdit,
  IconTrash,
  IconPlus,
  IconChartBar,
  IconBell,
  IconSettings
} from '@tabler/icons-react';
import { useState, useEffect } from 'react';
import type { DashboardStats } from '@/types';

function DashboardContent() {
  const { profile, user } = useAuth();
  const { t } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats | null>(null);

  // Mock data for demonstration - replace with actual API calls
  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock dashboard stats
      const mockStats: DashboardStats = {
        total_properties: user?.role === 'administrator' ? 156 : 12,
        total_bookings: user?.role === 'administrator' ? 2847 : 89,
        total_revenue: user?.role === 'administrator' ? 125000 : 15600,
        average_rating: 4.7,
        occupancy_rate: 78,
        recent_bookings: [],
        recent_reviews: []
      };
      
      setStats(mockStats);
      setLoading(false);
    };

    fetchDashboardData();
  }, [user?.role]);

  if (loading) {
    return (
      <Center h={400}>
        <Loader size="lg" />
      </Center>
    );
  }

  const isAdmin = user?.role === 'administrator';
  const isOwner = user?.role === 'owner';

  return (
    <Container size="xl" py="xl">
      <Stack gap="xl">
        {/* Header */}
        <Group justify="space-between">
          <div>
            <Title order={1} mb="xs">
              {isAdmin ? 'Admin Dashboard' : 'Property Owner Dashboard'}
            </Title>
            <Text c="dimmed" size="lg">
              Welcome back, {user?.user_metadata?.full_name || user?.email}
            </Text>
          </div>
          <Group>
            <ActionIcon variant="light" size="lg">
              <IconBell size={20} />
            </ActionIcon>
            <ActionIcon variant="light" size="lg">
              <IconSettings size={20} />
            </ActionIcon>
          </Group>
        </Group>

        {/* Stats Grid */}
        <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="lg">
          <Paper withBorder p="md" radius="md">
            <Group justify="space-between">
              <div>
                <Text c="dimmed" size="sm" tt="uppercase" fw={700}>
                  {isAdmin ? 'Total Properties' : 'My Properties'}
                </Text>
                <Text fw={700} size="xl">
                  {stats?.total_properties}
                </Text>
              </div>
              <ThemeIcon color="blue" variant="light" size={38} radius="md">
                <IconHome size={20} />
              </ThemeIcon>
            </Group>
          </Paper>

          <Paper withBorder p="md" radius="md">
            <Group justify="space-between">
              <div>
                <Text c="dimmed" size="sm" tt="uppercase" fw={700}>
                  Total Bookings
                </Text>
                <Text fw={700} size="xl">
                  {stats?.total_bookings}
                </Text>
              </div>
              <ThemeIcon color="green" variant="light" size={38} radius="md">
                <IconCalendar size={20} />
              </ThemeIcon>
            </Group>
          </Paper>

          <Paper withBorder p="md" radius="md">
            <Group justify="space-between">
              <div>
                <Text c="dimmed" size="sm" tt="uppercase" fw={700}>
                  Total Revenue
                </Text>
                <Text fw={700} size="xl">
                  ${stats?.total_revenue?.toLocaleString()}
                </Text>
              </div>
              <ThemeIcon color="yellow" variant="light" size={38} radius="md">
                <IconCurrencyDollar size={20} />
              </ThemeIcon>
            </Group>
          </Paper>

          <Paper withBorder p="md" radius="md">
            <Group justify="space-between">
              <div>
                <Text c="dimmed" size="sm" tt="uppercase" fw={700}>
                  Average Rating
                </Text>
                <Text fw={700} size="xl">
                  {stats?.average_rating}
                </Text>
              </div>
              <ThemeIcon color="orange" variant="light" size={38} radius="md">
                <IconStar size={20} />
              </ThemeIcon>
            </Group>
          </Paper>
        </SimpleGrid>

        {/* Main Content Grid */}
        <Grid>
          <Grid.Col span={{ base: 12, md: 8 }}>
            <Stack gap="lg">
              {/* Occupancy Rate */}
              <Paper withBorder p="md" radius="md">
                <Group justify="space-between" mb="md">
                  <Text fw={500} size="lg">Occupancy Rate</Text>
                  <Badge color="green" variant="light">
                    {stats?.occupancy_rate}%
                  </Badge>
                </Group>
                <Progress value={stats?.occupancy_rate || 0} size="lg" radius="xl" />
                <Text size="sm" c="dimmed" mt="sm">
                  Current month occupancy rate
                </Text>
              </Paper>

              {/* Recent Activity */}
              <Paper withBorder p="md" radius="md">
                <Group justify="space-between" mb="md">
                  <Text fw={500} size="lg">Recent Activity</Text>
                  <Button variant="light" size="sm" leftSection={<IconEye size={16} />}>
                    View All
                  </Button>
                </Group>
                <Stack gap="sm">
                  <Group justify="space-between" p="sm" style={{ borderRadius: 8, backgroundColor: 'var(--mantine-color-gray-0)' }}>
                    <Group>
                      <Avatar size="sm" color="blue">JD</Avatar>
                      <div>
                        <Text size="sm" fw={500}>New booking received</Text>
                        <Text size="xs" c="dimmed">John Doe booked Mountain View Suite</Text>
                      </div>
                    </Group>
                    <Text size="xs" c="dimmed">2 hours ago</Text>
                  </Group>
                  
                  <Group justify="space-between" p="sm" style={{ borderRadius: 8, backgroundColor: 'var(--mantine-color-gray-0)' }}>
                    <Group>
                      <Avatar size="sm" color="green">SM</Avatar>
                      <div>
                        <Text size="sm" fw={500}>New review posted</Text>
                        <Text size="xs" c="dimmed">Sarah Miller left a 5-star review</Text>
                      </div>
                    </Group>
                    <Text size="xs" c="dimmed">5 hours ago</Text>
                  </Group>

                  <Group justify="space-between" p="sm" style={{ borderRadius: 8, backgroundColor: 'var(--mantine-color-gray-0)' }}>
                    <Group>
                      <Avatar size="sm" color="orange">RJ</Avatar>
                      <div>
                        <Text size="sm" fw={500}>Payment received</Text>
                        <Text size="xs" c="dimmed">Robert Johnson - $450.00</Text>
                      </div>
                    </Group>
                    <Text size="xs" c="dimmed">1 day ago</Text>
                  </Group>
                </Stack>
              </Paper>
            </Stack>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 4 }}>
            <Stack gap="lg">
              {/* Quick Actions */}
              <Paper withBorder p="md" radius="md">
                <Text fw={500} size="lg" mb="md">Quick Actions</Text>
                <Stack gap="sm">
                  <Button 
                    variant="light" 
                    leftSection={<IconPlus size={16} />}
                    fullWidth
                  >
                    Add New Property
                  </Button>
                  <Button 
                    variant="light" 
                    leftSection={<IconCalendar size={16} />}
                    fullWidth
                  >
                    Manage Bookings
                  </Button>
                  <Button 
                    variant="light" 
                    leftSection={<IconChartBar size={16} />}
                    fullWidth
                  >
                    View Analytics
                  </Button>
                  {isAdmin && (
                    <Button 
                      variant="light" 
                      leftSection={<IconUsers size={16} />}
                      fullWidth
                    >
                      Manage Users
                    </Button>
                  )}
                </Stack>
              </Paper>

              {/* Performance Summary */}
              <Paper withBorder p="md" radius="md">
                <Text fw={500} size="lg" mb="md">This Month</Text>
                <Stack gap="sm">
                  <Group justify="space-between">
                    <Text size="sm">New Bookings</Text>
                    <Badge color="green" variant="light">+12</Badge>
                  </Group>
                  <Group justify="space-between">
                    <Text size="sm">Revenue Growth</Text>
                    <Badge color="blue" variant="light">+8.5%</Badge>
                  </Group>
                  <Group justify="space-between">
                    <Text size="sm">New Reviews</Text>
                    <Badge color="yellow" variant="light">+5</Badge>
                  </Group>
                  {isAdmin && (
                    <Group justify="space-between">
                      <Text size="sm">New Properties</Text>
                      <Badge color="purple" variant="light">+3</Badge>
                    </Group>
                  )}
                </Stack>
              </Paper>
            </Stack>
          </Grid.Col>
        </Grid>
      </Stack>
    </Container>
  );
}

// Export the protected component
export default withAuth(DashboardContent, ['administrator', 'owner']);