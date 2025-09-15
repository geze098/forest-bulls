'use client';

import { useState, useEffect } from 'react';
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
  Group,
  Anchor,
  Stack,
  Alert,
  Divider,
  Center,
  Select,
  Checkbox,
  Progress,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconAlertCircle, IconMail, IconLock, IconUser, IconPhone, IconCheck, IconX } from '@tabler/icons-react';
import { useAuth } from '@/contexts/AuthContext';
import { useThemeStyles } from '@/contexts/ThemeContext';
import { notifications } from '@mantine/notifications';
import type { UserRole } from '@/types';

interface RegisterFormData {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  phone: string;
  role: UserRole;
  agreeToTerms: boolean;
  marketingConsent: boolean;
}

function getPasswordStrength(password: string): { score: number; label: string; color: string } {
  let score = 0;
  
  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;
  if (/[a-z]/.test(password)) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;
  
  if (score < 2) return { score: score * 16.67, label: 'Weak', color: 'red' };
  if (score < 4) return { score: score * 16.67, label: 'Fair', color: 'yellow' };
  if (score < 6) return { score: score * 16.67, label: 'Good', color: 'blue' };
  return { score: 100, label: 'Strong', color: 'green' };
}

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [passwordStrength, setPasswordStrength] = useState({ score: 0, label: 'Weak', color: 'red' });
  const { signUp, user } = useAuth();
  const router = useRouter();
  const themeStyles = useThemeStyles();

  const form = useForm<RegisterFormData>({
    initialValues: {
      email: '',
      password: '',
      confirmPassword: '',
      firstName: '',
      lastName: '',
      phone: '',
      role: 'client',
      agreeToTerms: false,
      marketingConsent: false,
    },
    validate: {
      email: (value) => {
        if (!value) return 'Email is required';
        if (!/^\S+@\S+\.\S+$/.test(value)) return 'Invalid email format';
        return null;
      },
      password: (value) => {
        if (!value) return 'Password is required';
        if (value.length < 8) return 'Password must be at least 8 characters';
        if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])/.test(value)) {
          return 'Password must contain at least one lowercase letter, one uppercase letter, and one number';
        }
        return null;
      },
      confirmPassword: (value, values) => {
        if (!value) return 'Please confirm your password';
        if (value !== values.password) return 'Passwords do not match';
        return null;
      },
      firstName: (value) => {
        if (!value) return 'First name is required';
        if (value.length < 2) return 'First name must be at least 2 characters';
        return null;
      },
      lastName: (value) => {
        if (!value) return 'Last name is required';
        if (value.length < 2) return 'Last name must be at least 2 characters';
        return null;
      },
      phone: (value) => {
        if (!value) return 'Phone number is required';
        if (!/^[+]?[1-9]\d{1,14}$/.test(value.replace(/\s/g, ''))) {
          return 'Invalid phone number format';
        }
        return null;
      },
      agreeToTerms: (value) => {
        if (!value) return 'You must agree to the terms and conditions';
        return null;
      },
    },
  });

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      router.push('/dashboard');
    }
  }, [user, router]);

  // Update password strength when password changes
  useEffect(() => {
    if (form.values.password) {
      setPasswordStrength(getPasswordStrength(form.values.password));
    } else {
      setPasswordStrength({ score: 0, label: 'Weak', color: 'red' });
    }
  }, [form.values.password]);

  const handleSubmit = async (values: RegisterFormData) => {
    setLoading(true);
    setError(null);

    try {
      const { user: newUser, error: signUpError } = await signUp(
        values.email,
        values.password,
        {
          first_name: values.firstName,
          last_name: values.lastName,
          phone: values.phone,
          role: values.role,
          marketing_consent: values.marketingConsent,
          preferred_language: 'en',
          preferred_currency: 'RON',
        }
      );

      if (signUpError) {
        setError(signUpError.message);
        return;
      }

      if (newUser) {
        notifications.show({
          title: 'Account created successfully!',
          message: 'Please check your email to verify your account.',
          color: 'green',
        });
        router.push('/auth/verify-email?email=' + encodeURIComponent(values.email));
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const roleOptions = [
    { value: 'client', label: 'Guest - I want to book accommodations' },
    { value: 'owner', label: 'Property Owner - I want to list my properties' },
  ];

  return (
    <Container size={480} my={40}>
      <Title ta="center" className="font-bold text-2xl mb-2">
        Create your account
      </Title>
      <Text c="dimmed" size="sm" ta="center" mt={5}>
        Already have an account?{' '}
        <Anchor size="sm" component={Link} href="/auth/login">
          Sign in
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

            <Group grow>
              <TextInput
                label="First Name"
                placeholder="John"
                leftSection={<IconUser size={16} />}
                required
                {...form.getInputProps('firstName')}
              />
              <TextInput
                label="Last Name"
                placeholder="Doe"
                leftSection={<IconUser size={16} />}
                required
                {...form.getInputProps('lastName')}
              />
            </Group>

            <TextInput
              label="Email"
              placeholder="your@email.com"
              leftSection={<IconMail size={16} />}
              required
              {...form.getInputProps('email')}
            />

            <TextInput
              label="Phone Number"
              placeholder="+40 123 456 789"
              leftSection={<IconPhone size={16} />}
              required
              {...form.getInputProps('phone')}
            />

            <Select
              label="Account Type"
              placeholder="Select your account type"
              data={roleOptions}
              required
              {...form.getInputProps('role')}
            />

            <div>
              <PasswordInput
                label="Password"
                placeholder="Your password"
                leftSection={<IconLock size={16} />}
                required
                {...form.getInputProps('password')}
              />
              {form.values.password && (
                <div className="mt-2">
                  <Group justify="space-between" mb={5}>
                    <Text size="sm" c="dimmed">
                      Password strength: {passwordStrength.label}
                    </Text>
                    {passwordStrength.score === 100 && (
                      <IconCheck size={16} color="green" />
                    )}
                  </Group>
                  <Progress
                    value={passwordStrength.score}
                    color={passwordStrength.color}
                    size="sm"
                  />
                </div>
              )}
            </div>

            <PasswordInput
              label="Confirm Password"
              placeholder="Confirm your password"
              leftSection={<IconLock size={16} />}
              required
              {...form.getInputProps('confirmPassword')}
            />

            <Stack gap="xs" mt="md">
              <Checkbox
                label={
                  <Text size="sm">
                    I agree to the{' '}
                    <Anchor component={Link} href="/terms" size="sm">
                      Terms of Service
                    </Anchor>{' '}
                    and{' '}
                    <Anchor component={Link} href="/privacy" size="sm">
                      Privacy Policy
                    </Anchor>
                  </Text>
                }
                required
                {...form.getInputProps('agreeToTerms', { type: 'checkbox' })}
              />
              
              <Checkbox
                label="I would like to receive marketing emails and updates"
                {...form.getInputProps('marketingConsent', { type: 'checkbox' })}
              />
            </Stack>

            <Button
              type="submit"
              fullWidth
              mt="xl"
              loading={loading}
              size="md"
            >
              Create account
            </Button>
          </Stack>
        </form>
      </Paper>

      <Center mt="xl">
        <Text size="sm" c="dimmed" ta="center">
          By creating an account, you agree to our Terms of Service and Privacy Policy.
          We'll send you a verification email to confirm your account.
        </Text>
      </Center>
    </Container>
  );
}