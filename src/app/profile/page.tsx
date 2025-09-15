'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Container,
  Paper,
  Title,
  Text,
  TextInput,
  Button,
  Stack,
  Group,
  Avatar,
  Badge,
  Divider,
  Alert,
  LoadingOverlay,
  Grid,
  Card,
  ActionIcon,
  FileInput,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconUser, IconMail, IconPhone, IconMapPin, IconEdit, IconCheck, IconAlertCircle, IconUpload } from '@tabler/icons-react';
import { useAuth } from '@/contexts/AuthContext';
import { useThemeStyles } from '@/contexts/ThemeContext';
import { notifications } from '@mantine/notifications';

interface ProfileFormData {
  full_name: string;
  email: string;
  phone?: string;
  address?: string;
  bio?: string;
}

export default function ProfilePage() {
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user, profile, updateProfile, loading: authLoading } = useAuth();
  const themeStyles = useThemeStyles();
  const router = useRouter();

  const form = useForm<ProfileFormData>({
    initialValues: {
      full_name: '',
      email: '',
      phone: '',
      address: '',
      bio: '',
    },
    validate: {
      full_name: (value) => (value.length < 2 ? 'Name must have at least 2 characters' : null),
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
    },
  });

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login');
      return;
    }

    if (profile) {
      form.setValues({
        full_name: profile.full_name || '',
        email: user?.email || '',
        phone: profile.phone || '',
        address: profile.address || '',
        bio: profile.bio || '',
      });
    }
  }, [user, profile, authLoading, router]);

  const handleSubmit = async (values: ProfileFormData) => {
    setLoading(true);
    setError(null);

    try {
      const { error } = await updateProfile({
        full_name: values.full_name,
        phone: values.phone,
        address: values.address,
        bio: values.bio,
      });

      if (error) {
        setError(error.message);
      } else {
        setEditing(false);
        notifications.show({
          title: 'Profile updated',
          message: 'Your profile has been successfully updated.',
          color: 'green',
          icon: <IconCheck size={16} />,
        });
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (profile) {
      form.setValues({
        full_name: profile.full_name || '',
        email: user?.email || '',
        phone: profile.phone || '',
        address: profile.address || '',
        bio: profile.bio || '',
      });
    }
    setEditing(false);
    setError(null);
  };

  if (authLoading) {
    return (
      <Container size="md" my={40}>
        <LoadingOverlay visible />
      </Container>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <Container size="md" my={40}>
      <Paper 
        withBorder 
        shadow="md" 
        p={30} 
        radius="md" 
        pos="relative"
        style={{
          backgroundColor: themeStyles.cardBg,
          borderColor: themeStyles.borderColor,
        }}
      >
        <LoadingOverlay visible={loading} />
        
        <Group justify="space-between" mb="xl">
          <Group>
            <Avatar size={80} radius="xl">
              <IconUser size={40} />
            </Avatar>
            <div>
              <Title order={2}>{profile?.full_name || 'User Profile'}</Title>
              <Text c="dimmed" size="sm">{user.email}</Text>
              <Badge color="green" variant="light" size="sm" mt={4}>
                {profile?.role || 'User'}
              </Badge>
            </div>
          </Group>
          
          {!editing && (
            <ActionIcon
              variant="light"
              size="lg"
              onClick={() => setEditing(true)}
            >
              <IconEdit size={18} />
            </ActionIcon>
          )}
        </Group>

        <Divider mb="xl" />

        {error && (
          <Alert icon={<IconAlertCircle size={16} />} color="red" mb="md">
            {error}
          </Alert>
        )}

        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Grid>
            <Grid.Col span={12}>
              <Card withBorder p="md" mb="md">
                <Title order={4} mb="md">Personal Information</Title>
                <Stack gap="md">
                  <TextInput
                    label="Full Name"
                    placeholder="Enter your full name"
                    leftSection={<IconUser size={16} />}
                    disabled={!editing}
                    {...form.getInputProps('full_name')}
                  />
                  
                  <TextInput
                    label="Email"
                    placeholder="your@email.com"
                    leftSection={<IconMail size={16} />}
                    disabled
                    {...form.getInputProps('email')}
                  />
                  
                  <TextInput
                    label="Phone Number"
                    placeholder="Enter your phone number"
                    leftSection={<IconPhone size={16} />}
                    disabled={!editing}
                    {...form.getInputProps('phone')}
                  />
                  
                  <TextInput
                    label="Address"
                    placeholder="Enter your address"
                    leftSection={<IconMapPin size={16} />}
                    disabled={!editing}
                    {...form.getInputProps('address')}
                  />
                </Stack>
              </Card>
            </Grid.Col>
            
            <Grid.Col span={12}>
              <Card withBorder p="md">
                <Title order={4} mb="md">About</Title>
                <TextInput
                  label="Bio"
                  placeholder="Tell us about yourself"
                  disabled={!editing}
                  {...form.getInputProps('bio')}
                />
              </Card>
            </Grid.Col>
          </Grid>

          {editing && (
            <Group justify="flex-end" mt="xl">
              <Button variant="light" onClick={handleCancel}>
                Cancel
              </Button>
              <Button type="submit" loading={loading}>
                Save Changes
              </Button>
            </Group>
          )}
        </form>

        {!editing && (
          <Group justify="center" mt="xl">
            <Text c="dimmed" size="sm">
              Last updated: {profile?.updated_at ? new Date(profile.updated_at).toLocaleDateString() : 'Never'}
            </Text>
          </Group>
        )}
      </Paper>
    </Container>
  );
}