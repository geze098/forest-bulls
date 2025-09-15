'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  Container,
  Paper,
  Title,
  Text,
  TextInput,
  PasswordInput,
  Button,
  Group,
  Anchor,
  Stack,
  Alert,
  Divider,
  Center,
  Box,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconAlertCircle, IconMail, IconLock, IconBrandGoogle, IconBrandFacebook } from '@tabler/icons-react';
import { useAuth } from '@/contexts/AuthContext';
import { useThemeStyles } from '@/contexts/ThemeContext';
import { notifications } from '@mantine/notifications';

interface LoginFormData {
  email: string;
  password: string;
}

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { signIn, user } = useAuth();
  const themeStyles = useThemeStyles();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/dashboard';

  const form = useForm<LoginFormData>({
    initialValues: {
      email: '',
      password: '',
    },
    validate: {
      email: (value) => {
        if (!value) return 'Email is required';
        if (!/^\S+@\S+\.\S+$/.test(value)) return 'Invalid email format';
        return null;
      },
      password: (value) => {
        if (!value) return 'Password is required';
        if (value.length < 6) return 'Password must be at least 6 characters';
        return null;
      },
    },
  });

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      router.push(redirectTo);
    }
  }, [user, router, redirectTo]);

  const handleSubmit = async (values: LoginFormData) => {
    setLoading(true);
    setError(null);

    try {
      const { user: signedInUser, error: signInError } = await signIn(values.email, values.password);

      if (signInError) {
        setError(signInError.message);
        return;
      }

      if (signedInUser) {
        notifications.show({
          title: 'Welcome back!',
          message: 'You have been successfully signed in.',
          color: 'green',
        });
        router.push(redirectTo);
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (provider: 'google' | 'facebook') => {
    setLoading(true);
    setError(null);

    try {
      // TODO: Implement social login with Supabase
      notifications.show({
        title: 'Coming Soon',
        message: `${provider} login will be available soon.`,
        color: 'blue',
      });
    } catch (err) {
      setError('Social login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container size={420} my={40}>
      <Title ta="center" className="font-bold text-2xl mb-2">
        Welcome back!
      </Title>
      <Text c="dimmed" size="sm" ta="center" mt={5}>
        Don't have an account yet?{' '}
        <Anchor size="sm" component={Link} href="/auth/register">
          Create account
        </Anchor>
      </Text>

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
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack gap="md">
            {error && (
              <Alert icon={<IconAlertCircle size={16} />} color="red" variant="light">
                {error}
              </Alert>
            )}

            <TextInput
              label="Email"
              placeholder="your@email.com"
              leftSection={<IconMail size={16} />}
              required
              {...form.getInputProps('email')}
            />

            <PasswordInput
              label="Password"
              placeholder="Your password"
              leftSection={<IconLock size={16} />}
              required
              {...form.getInputProps('password')}
            />

            <Group justify="space-between" mt="lg">
              <Anchor
                component={Link}
                href="/auth/forgot-password"
                size="sm"
                c="dimmed"
              >
                Forgot password?
              </Anchor>
            </Group>

            <Button
              type="submit"
              fullWidth
              mt="xl"
              loading={loading}
              size="md"
            >
              Sign in
            </Button>

            <Divider label="Or continue with" labelPosition="center" my="lg" />

            <Group grow mb="md" mt="md">
              <Button
                variant="default"
                leftSection={<IconBrandGoogle size={16} />}
                onClick={() => handleSocialLogin('google')}
                disabled={loading}
              >
                Google
              </Button>
              <Button
                variant="default"
                leftSection={<IconBrandFacebook size={16} />}
                onClick={() => handleSocialLogin('facebook')}
                disabled={loading}
              >
                Facebook
              </Button>
            </Group>
          </Stack>
        </form>
      </Paper>

      <Center mt="xl">
        <Text size="sm" c="dimmed">
          By signing in, you agree to our{' '}
          <Anchor component={Link} href="/terms" size="sm">
            Terms of Service
          </Anchor>{' '}
          and{' '}
          <Anchor component={Link} href="/privacy" size="sm">
            Privacy Policy
          </Anchor>
        </Text>
      </Center>
    </Container>
  );
}