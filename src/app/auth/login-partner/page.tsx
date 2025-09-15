'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Container,
  Paper,
  Title,
  Text,
  TextInput,
  PasswordInput,
  Button,
  Stack,
  Alert,
  Anchor,
  Checkbox,
  Divider,
  Badge,
  Group,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconAlertCircle, IconMail, IconLock, IconBuilding, IconArrowLeft } from '@tabler/icons-react';
import { useAuth } from '@/contexts/AuthContext';
import { useThemeStyles } from '@/contexts/ThemeContext';
import { notifications } from '@mantine/notifications';

interface PartnerLoginFormData {
  email: string;
  password: string;
  remember_me: boolean;
}

export default function LoginPartnerPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { signIn } = useAuth();
  const themeStyles = useThemeStyles();

  const form = useForm<PartnerLoginFormData>({
    initialValues: {
      email: '',
      password: '',
      remember_me: false,
    },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
      password: (value) => (value.length < 1 ? 'Password is required' : null),
    },
  });

  const handleSubmit = async (values: PartnerLoginFormData) => {
    setLoading(true);
    setError(null);

    try {
      const { error } = await signIn(values.email, values.password);
      
      if (error) {
        setError(error.message);
      } else {
        // Redirect to partner dashboard
        router.push('/dashboard');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container size={420} my={40}>
      <Paper 
        withBorder 
        shadow="md" 
        p={30} 
        mt={30} 
        radius="md"
        style={{
          backgroundColor: themeStyles.cardBg,
          borderColor: themeStyles.borderColor,
        }}
      >
        <Stack gap="lg">
          <div style={{ textAlign: 'center' }}>
            <Badge size="lg" variant="gradient" gradient={{ from: 'blue', to: 'cyan' }} mb="md">
              Partner Portal
            </Badge>
            <Group justify="center" mb="xs">
              <IconBuilding size={24} color="blue" />
              <Title order={2}>Partner Login</Title>
            </Group>
            <Text c="dimmed" size="sm">
              Access your business partner dashboard
            </Text>
          </div>

          {error && (
            <Alert icon={<IconAlertCircle size={16} />} color="red">
              {error}
            </Alert>
          )}

          <form onSubmit={form.onSubmit(handleSubmit)}>
            <Stack gap="md">
              <TextInput
                label="Business Email"
                placeholder="your-business@company.com"
                required
                leftSection={<IconMail size={16} />}
                {...form.getInputProps('email')}
              />
              
              <PasswordInput
                label="Password"
                placeholder="Your password"
                required
                leftSection={<IconLock size={16} />}
                {...form.getInputProps('password')}
              />
              
              <Group justify="space-between">
                <Checkbox
                  label="Remember me"
                  {...form.getInputProps('remember_me', { type: 'checkbox' })}
                />
                <Anchor
                  component={Link}
                  href="/auth/forgot-password-partner"
                  size="sm"
                >
                  Forgot password?
                </Anchor>
              </Group>
              
              <Button type="submit" fullWidth loading={loading} size="md">
                Sign In to Partner Portal
              </Button>
            </Stack>
          </form>

          <Divider label="New to our platform?" labelPosition="center" />

          <Stack gap="sm">
            <Button
              component={Link}
              href="/auth/register-partner"
              variant="light"
              fullWidth
            >
              Register as Business Partner
            </Button>
            
            <Text c="dimmed" size="sm" ta="center">
              Looking for individual account?{' '}
              <Anchor size="sm" component={Link} href="/auth/login">
                Login here
              </Anchor>
            </Text>
          </Stack>

          <Divider />

          <Group justify="center">
            <Button
              component={Link}
              href="/"
              variant="subtle"
              leftSection={<IconArrowLeft size={16} />}
              size="sm"
            >
              Back to Home
            </Button>
          </Group>

          <div style={{ textAlign: 'center' }}>
            <Text size="xs" c="dimmed">
              Partner Portal Features:
            </Text>
            <Text size="xs" c="dimmed">
              • Advanced Analytics Dashboard
            </Text>
            <Text size="xs" c="dimmed">
              • Lead Management System
            </Text>
            <Text size="xs" c="dimmed">
              • Priority Customer Support
            </Text>
            <Text size="xs" c="dimmed">
              • Exclusive Business Tools
            </Text>
          </div>
        </Stack>
      </Paper>
    </Container>
  );
}