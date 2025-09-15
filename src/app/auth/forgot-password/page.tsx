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
  Stack,
  Alert,
  Anchor,
  Progress,
  Group,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconAlertCircle, IconMail, IconLock, IconCheck, IconArrowLeft } from '@tabler/icons-react';
import { useAuth } from '@/contexts/AuthContext';
import { useThemeStyles } from '@/contexts/ThemeContext';
import { notifications } from '@mantine/notifications';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

interface ResetPasswordFormData {
  email?: string;
  password?: string;
  confirmPassword?: string;
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

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isPasswordReset, setIsPasswordReset] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { resetPassword, updatePassword } = useAuth();
  const themeStyles = useThemeStyles();
  const supabase = createClientComponentClient();

  // Check if user is in password reset mode
  useEffect(() => {
    const checkResetMode = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      
      if (user && !error) {
        setIsPasswordReset(true);
      }
    };

    checkResetMode();
  }, [supabase.auth]);

  const emailForm = useForm<ResetPasswordFormData>({
    initialValues: {
      email: '',
    },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value || '') ? null : 'Invalid email'),
    },
  });

  const passwordForm = useForm<ResetPasswordFormData>({
    initialValues: {
      password: '',
      confirmPassword: '',
    },
    validate: {
      password: (value) => {
        if (!value || value.length < 8) {
          return 'Password must be at least 8 characters long';
        }
        return null;
      },
      confirmPassword: (value, values) => {
        if (value !== values.password) {
          return 'Passwords do not match';
        }
        return null;
      },
    },
  });

  const handleEmailSubmit = async (values: ResetPasswordFormData) => {
    if (!values.email) return;
    
    setLoading(true);
    setError(null);

    try {
      const { error } = await resetPassword(values.email);
      
      if (error) {
        setError(error.message);
      } else {
        setSuccess(true);
        notifications.show({
          title: 'Reset email sent',
          message: 'Check your email for password reset instructions.',
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

  const handlePasswordSubmit = async (values: ResetPasswordFormData) => {
    if (!values.password) return;
    
    setLoading(true);
    setError(null);

    try {
      const { error } = await updatePassword(values.password);
      
      if (error) {
        setError(error.message);
      } else {
        notifications.show({
          title: 'Password updated',
          message: 'Your password has been successfully updated.',
          color: 'green',
          icon: <IconCheck size={16} />,
        });
        router.push('/dashboard');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const passwordStrength = passwordForm.values.password 
    ? getPasswordStrength(passwordForm.values.password)
    : { score: 0, label: '', color: 'gray' };

  if (success && !isPasswordReset) {
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
              <IconCheck size={48} color="green" style={{ margin: '0 auto 16px' }} />
              <Title order={2} ta="center" mb="md">
                Check your email
              </Title>
              <Text c="dimmed" size="sm" ta="center">
                We've sent a password reset link to your email address.
                Click the link in the email to reset your password.
              </Text>
            </div>
            
            <Button
              component={Link}
              href="/auth/login"
              variant="light"
              leftSection={<IconArrowLeft size={16} />}
            >
              Back to login
            </Button>
          </Stack>
        </Paper>
      </Container>
    );
  }

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
        <Title order={2} ta="center" mb="md">
          {isPasswordReset ? 'Set New Password' : 'Forgot Password'}
        </Title>
        
        <Text c="dimmed" size="sm" ta="center" mb="lg">
          {isPasswordReset 
            ? 'Enter your new password below'
            : 'Enter your email address and we\'ll send you a link to reset your password'
          }
        </Text>

        {error && (
          <Alert icon={<IconAlertCircle size={16} />} color="red" mb="md">
            {error}
          </Alert>
        )}

        {isPasswordReset ? (
          <form onSubmit={passwordForm.onSubmit(handlePasswordSubmit)}>
            <Stack gap="md">
              <PasswordInput
                label="New Password"
                placeholder="Enter your new password"
                required
                leftSection={<IconLock size={16} />}
                {...passwordForm.getInputProps('password')}
              />
              
              {passwordForm.values.password && (
                <div>
                  <Group justify="space-between" mb={5}>
                    <Text size="sm">Password strength</Text>
                    <Text size="sm" c={passwordStrength.color}>
                      {passwordStrength.label}
                    </Text>
                  </Group>
                  <Progress
                    value={passwordStrength.score}
                    color={passwordStrength.color}
                    size="sm"
                  />
                </div>
              )}
              
              <PasswordInput
                label="Confirm New Password"
                placeholder="Confirm your new password"
                required
                leftSection={<IconLock size={16} />}
                {...passwordForm.getInputProps('confirmPassword')}
              />
              
              <Button type="submit" fullWidth loading={loading}>
                Update Password
              </Button>
            </Stack>
          </form>
        ) : (
          <form onSubmit={emailForm.onSubmit(handleEmailSubmit)}>
            <Stack gap="md">
              <TextInput
                label="Email"
                placeholder="your@email.com"
                required
                leftSection={<IconMail size={16} />}
                {...emailForm.getInputProps('email')}
              />
              
              <Button type="submit" fullWidth loading={loading}>
                Send Reset Link
              </Button>
            </Stack>
          </form>
        )}

        <Text c="dimmed" size="sm" ta="center" mt="md">
          Remember your password?{' '}
          <Anchor size="sm" component={Link} href="/auth/login">
            Back to login
          </Anchor>
        </Text>
      </Paper>
    </Container>
  );
}