'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  Container,
  Paper,
  Title,
  Text,
  Button,
  Stack,
  Alert,
  Center,
  Anchor,
  Group,
  Loader,
} from '@mantine/core';
import { IconMail, IconCheck, IconAlertCircle, IconRefresh } from '@tabler/icons-react';
import { useAuth } from '@/contexts/AuthContext';
import { notifications } from '@mantine/notifications';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export default function VerifyEmailPage() {
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email');
  const supabase = createClientComponentClient();

  // Handle email verification from URL
  useEffect(() => {
    const handleEmailVerification = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      
      if (user?.email_confirmed_at) {
        setSuccess(true);
        notifications.show({
          title: 'Email verified successfully!',
          message: 'Your account is now active. Redirecting to dashboard...',
          color: 'green',
        });
        
        setTimeout(() => {
          router.push('/dashboard');
        }, 2000);
      }
    };

    handleEmailVerification();
  }, [supabase.auth, router]);

  // Redirect if already logged in and verified
  useEffect(() => {
    if (user?.email_confirmed_at) {
      router.push('/dashboard');
    }
  }, [user, router]);

  // Cooldown timer
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => {
        setResendCooldown(resendCooldown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleResendVerification = async () => {
    if (!email) {
      setError('Email address not found. Please try registering again.');
      return;
    }

    setResendLoading(true);
    setError(null);

    try {
      const { error: resendError } = await supabase.auth.resend({
        type: 'signup',
        email: email,
      });

      if (resendError) {
        setError(resendError.message);
      } else {
        notifications.show({
          title: 'Verification email sent!',
          message: 'Please check your email for the verification link.',
          color: 'blue',
        });
        setResendCooldown(60); // 60 second cooldown
      }
    } catch (err) {
      setError('Failed to resend verification email. Please try again.');
    } finally {
      setResendLoading(false);
    }
  };

  const handleBackToLogin = () => {
    router.push('/auth/login');
  };

  if (success) {
    return (
      <Container size={480} my={40}>
        <Paper withBorder shadow="md" p={30} radius="md">
          <Center>
            <Stack align="center" gap="md">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <IconCheck size={32} color="green" />
              </div>
              <Title order={2} ta="center" c="green">
                Email Verified!
              </Title>
              <Text ta="center" c="dimmed">
                Your email has been successfully verified. You will be redirected to your dashboard shortly.
              </Text>
              <Loader color="green" size="sm" />
            </Stack>
          </Center>
        </Paper>
      </Container>
    );
  }

  return (
    <Container size={480} my={40}>
      <Title ta="center" className="font-bold text-2xl mb-2">
        Verify your email
      </Title>
      <Text c="dimmed" size="sm" ta="center" mt={5}>
        We've sent a verification link to your email address
      </Text>

      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <Center>
          <Stack align="center" gap="md">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <IconMail size={32} color="blue" />
            </div>
            
            <Title order={3} ta="center">
              Check your email
            </Title>
            
            {email && (
              <Text ta="center" size="sm" c="dimmed">
                We sent a verification link to:
                <br />
                <strong>{email}</strong>
              </Text>
            )}
            
            <Text ta="center" size="sm" c="dimmed">
              Click the link in the email to verify your account. If you don't see the email,
              check your spam folder.
            </Text>

            {error && (
              <Alert icon={<IconAlertCircle size={16} />} color="red" variant="light">
                {error}
              </Alert>
            )}

            <Stack gap="sm" w="100%">
              <Button
                variant="light"
                leftSection={<IconRefresh size={16} />}
                onClick={handleResendVerification}
                loading={resendLoading}
                disabled={resendCooldown > 0}
                fullWidth
              >
                {resendCooldown > 0 
                  ? `Resend in ${resendCooldown}s` 
                  : 'Resend verification email'
                }
              </Button>
              
              <Button
                variant="outline"
                onClick={handleBackToLogin}
                fullWidth
              >
                Back to login
              </Button>
            </Stack>
          </Stack>
        </Center>
      </Paper>

      <Center mt="xl">
        <Text size="sm" c="dimmed" ta="center">
          Having trouble?{' '}
          <Anchor component={Link} href="/support" size="sm">
            Contact support
          </Anchor>
        </Text>
      </Center>
    </Container>
  );
}