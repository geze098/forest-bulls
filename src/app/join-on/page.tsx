'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Container,
  Paper,
  Title,
  Text,
  TextInput,
  Textarea,
  Button,
  Stack,
  Group,
  Card,
  Grid,
  Badge,
  Alert,
  Select,
  Checkbox,
  Divider,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconUsers, IconCheck, IconAlertCircle, IconMail, IconUser, IconPhone, IconBriefcase } from '@tabler/icons-react';
import { useThemeStyles } from '@/contexts/ThemeContext';
import { notifications } from '@mantine/notifications';
import Link from 'next/link';

interface JoinFormData {
  full_name: string;
  email: string;
  phone: string;
  profession: string;
  experience: string;
  motivation: string;
  terms_accepted: boolean;
  newsletter_subscription: boolean;
}

const professionOptions = [
  { value: 'real_estate_agent', label: 'Real Estate Agent' },
  { value: 'property_developer', label: 'Property Developer' },
  { value: 'architect', label: 'Architect' },
  { value: 'contractor', label: 'Contractor' },
  { value: 'interior_designer', label: 'Interior Designer' },
  { value: 'property_manager', label: 'Property Manager' },
  { value: 'investor', label: 'Investor' },
  { value: 'other', label: 'Other' },
];

const experienceOptions = [
  { value: 'beginner', label: 'Beginner (0-1 years)' },
  { value: 'intermediate', label: 'Intermediate (2-5 years)' },
  { value: 'experienced', label: 'Experienced (5-10 years)' },
  { value: 'expert', label: 'Expert (10+ years)' },
];

export default function JoinOnPage() {
  const themeStyles = useThemeStyles();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const form = useForm<JoinFormData>({
    initialValues: {
      full_name: '',
      email: '',
      phone: '',
      profession: '',
      experience: '',
      motivation: '',
      terms_accepted: false,
      newsletter_subscription: false,
    },
    validate: {
      full_name: (value) => (value.length < 2 ? 'Name must have at least 2 characters' : null),
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
      phone: (value) => (value.length < 10 ? 'Please enter a valid phone number' : null),
      profession: (value) => (!value ? 'Please select your profession' : null),
      experience: (value) => (!value ? 'Please select your experience level' : null),
      motivation: (value) => (value.length < 50 ? 'Please provide at least 50 characters' : null),
      terms_accepted: (value) => (!value ? 'You must accept the terms and conditions' : null),
    },
  });

  const handleSubmit = async (values: JoinFormData) => {
    setLoading(true);
    setError(null);

    try {
      // Simulate API call - replace with actual implementation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock successful submission
      console.log('Join application submitted:', values);
      
      setSubmitted(true);
      notifications.show({
        title: 'Application submitted!',
        message: 'Thank you for your interest. We will review your application and get back to you soon.',
        color: 'green',
        icon: <IconCheck size={16} />,
      });
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <Container size={600} my={40}>
        <Paper 
          withBorder 
          shadow="md" 
          p={40} 
          radius="md"
          style={{
            backgroundColor: themeStyles.cardBg,
            borderColor: themeStyles.borderColor,
          }}
        >
          <Stack align="center" gap="lg">
            <IconCheck size={64} color="green" />
            <Title order={2} ta="center">
              Application Submitted Successfully!
            </Title>
            <Text c="dimmed" ta="center" size="lg">
              Thank you for your interest in joining our platform. We have received your application and will review it within 2-3 business days.
            </Text>
            <Text c="dimmed" ta="center" size="sm">
              You will receive an email confirmation shortly with next steps.
            </Text>
            <Group>
              <Button
                component={Link}
                href="/"
                variant="light"
              >
                Back to Home
              </Button>
              <Button
                component={Link}
                href="/auth/login"
              >
                Login to Account
              </Button>
            </Group>
          </Stack>
        </Paper>
      </Container>
    );
  }

  return (
    <Container size={800} my={40}>
      <Paper 
        withBorder 
        shadow="md" 
        p={40} 
        radius="md"
        style={{
          backgroundColor: themeStyles.cardBg,
          borderColor: themeStyles.borderColor,
        }}
      >
        <Stack gap="xl">
          <div>
            <Group mb="md">
              <IconUsers size={32} color="blue" />
              <Title order={1}>Join Our Platform</Title>
            </Group>
            <Text c="dimmed" size="lg">
              Become part of our growing community of real estate professionals and unlock new opportunities.
            </Text>
          </div>

          <Grid>
            <Grid.Col span={{ base: 12, md: 4 }}>
              <Card withBorder p="lg" h="100%">
                <Stack align="center" gap="sm">
                  <Badge size="lg" variant="light" color="blue">
                    Network
                  </Badge>
                  <Text fw={600} ta="center">Connect with Professionals</Text>
                  <Text size="sm" c="dimmed" ta="center">
                    Build relationships with other real estate professionals in your area.
                  </Text>
                </Stack>
              </Card>
            </Grid.Col>
            
            <Grid.Col span={{ base: 12, md: 4 }}>
              <Card withBorder p="lg" h="100%">
                <Stack align="center" gap="sm">
                  <Badge size="lg" variant="light" color="green">
                    Opportunities
                  </Badge>
                  <Text fw={600} ta="center">Access Exclusive Listings</Text>
                  <Text size="sm" c="dimmed" ta="center">
                    Get early access to new properties and investment opportunities.
                  </Text>
                </Stack>
              </Card>
            </Grid.Col>
            
            <Grid.Col span={{ base: 12, md: 4 }}>
              <Card withBorder p="lg" h="100%">
                <Stack align="center" gap="sm">
                  <Badge size="lg" variant="light" color="orange">
                    Growth
                  </Badge>
                  <Text fw={600} ta="center">Professional Development</Text>
                  <Text size="sm" c="dimmed" ta="center">
                    Access training resources and industry insights to grow your business.
                  </Text>
                </Stack>
              </Card>
            </Grid.Col>
          </Grid>

          <Divider />

          <div>
            <Title order={2} mb="md">Application Form</Title>
            <Text c="dimmed" mb="lg">
              Please fill out the form below to apply for membership. All fields are required.
            </Text>

            {error && (
              <Alert icon={<IconAlertCircle size={16} />} color="red" mb="md">
                {error}
              </Alert>
            )}

            <form onSubmit={form.onSubmit(handleSubmit)}>
              <Stack gap="md">
                <Grid>
                  <Grid.Col span={{ base: 12, sm: 6 }}>
                    <TextInput
                      label="Full Name"
                      placeholder="Enter your full name"
                      required
                      leftSection={<IconUser size={16} />}
                      {...form.getInputProps('full_name')}
                    />
                  </Grid.Col>
                  
                  <Grid.Col span={{ base: 12, sm: 6 }}>
                    <TextInput
                      label="Email Address"
                      placeholder="your@email.com"
                      required
                      leftSection={<IconMail size={16} />}
                      {...form.getInputProps('email')}
                    />
                  </Grid.Col>
                </Grid>

                <Grid>
                  <Grid.Col span={{ base: 12, sm: 6 }}>
                    <TextInput
                      label="Phone Number"
                      placeholder="Enter your phone number"
                      required
                      leftSection={<IconPhone size={16} />}
                      {...form.getInputProps('phone')}
                    />
                  </Grid.Col>
                  
                  <Grid.Col span={{ base: 12, sm: 6 }}>
                    <Select
                      label="Profession"
                      placeholder="Select your profession"
                      required
                      leftSection={<IconBriefcase size={16} />}
                      data={professionOptions}
                      {...form.getInputProps('profession')}
                    />
                  </Grid.Col>
                </Grid>

                <Select
                  label="Experience Level"
                  placeholder="Select your experience level"
                  required
                  data={experienceOptions}
                  {...form.getInputProps('experience')}
                />

                <Textarea
                  label="Motivation"
                  placeholder="Tell us why you want to join our platform and what you hope to achieve..."
                  required
                  minRows={4}
                  {...form.getInputProps('motivation')}
                />

                <Stack gap="sm">
                  <Checkbox
                    label="I accept the terms and conditions and privacy policy"
                    required
                    {...form.getInputProps('terms_accepted', { type: 'checkbox' })}
                  />
                  
                  <Checkbox
                    label="I would like to receive newsletters and updates about new opportunities"
                    {...form.getInputProps('newsletter_subscription', { type: 'checkbox' })}
                  />
                </Stack>

                <Group justify="flex-end" mt="xl">
                  <Button
                    variant="light"
                    component={Link}
                    href="/"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    loading={loading}
                    leftSection={<IconCheck size={16} />}
                  >
                    Submit Application
                  </Button>
                </Group>
              </Stack>
            </form>
          </div>
        </Stack>
      </Paper>
    </Container>
  );
}