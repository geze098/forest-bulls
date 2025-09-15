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
  Progress,
  Group,
  Select,
  Textarea,
  Checkbox,
  Divider,
  Badge,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconAlertCircle, IconMail, IconLock, IconUser, IconBuilding, IconPhone, IconMapPin, IconCheck } from '@tabler/icons-react';
import { useAuth } from '@/contexts/AuthContext';
import { useThemeStyles } from '@/contexts/ThemeContext';
import { notifications } from '@mantine/notifications';

interface PartnerRegistrationFormData {
  email: string;
  password: string;
  confirmPassword: string;
  company_name: string;
  contact_person: string;
  phone: string;
  address: string;
  business_type: string;
  license_number: string;
  description: string;
  terms_accepted: boolean;
  marketing_consent: boolean;
}

const businessTypes = [
  { value: 'real_estate_agency', label: 'Real Estate Agency' },
  { value: 'property_developer', label: 'Property Developer' },
  { value: 'construction_company', label: 'Construction Company' },
  { value: 'property_management', label: 'Property Management' },
  { value: 'investment_firm', label: 'Investment Firm' },
  { value: 'consulting', label: 'Real Estate Consulting' },
  { value: 'other', label: 'Other' },
];

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

export default function RegisterPartnerPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { signUp } = useAuth();
  const themeStyles = useThemeStyles();

  const form = useForm<PartnerRegistrationFormData>({
    initialValues: {
      email: '',
      password: '',
      confirmPassword: '',
      company_name: '',
      contact_person: '',
      phone: '',
      address: '',
      business_type: '',
      license_number: '',
      description: '',
      terms_accepted: false,
      marketing_consent: false,
    },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
      password: (value) => {
        if (value.length < 8) {
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
      company_name: (value) => (value.length < 2 ? 'Company name must have at least 2 characters' : null),
      contact_person: (value) => (value.length < 2 ? 'Contact person name must have at least 2 characters' : null),
      phone: (value) => (value.length < 10 ? 'Please enter a valid phone number' : null),
      address: (value) => (value.length < 10 ? 'Please enter a complete address' : null),
      business_type: (value) => (!value ? 'Please select your business type' : null),
      license_number: (value) => (value.length < 3 ? 'Please enter a valid license number' : null),
      description: (value) => (value.length < 50 ? 'Please provide at least 50 characters' : null),
      terms_accepted: (value) => (!value ? 'You must accept the terms and conditions' : null),
    },
  });

  const handleSubmit = async (values: PartnerRegistrationFormData) => {
    setLoading(true);
    setError(null);

    try {
      const { error } = await signUp(
        values.email,
        values.password,
        {
          full_name: values.contact_person,
          role: 'partner',
          company_name: values.company_name,
          phone: values.phone,
          address: values.address,
          business_type: values.business_type,
          license_number: values.license_number,
          description: values.description,
          marketing_consent: values.marketing_consent,
        }
      );

      if (error) {
        setError(error.message);
      } else {
        notifications.show({
          title: 'Registration successful!',
          message: 'Please check your email to verify your account.',
          color: 'green',
          icon: <IconCheck size={16} />,
        });
        router.push('/auth/verify-email');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const passwordStrength = form.values.password 
    ? getPasswordStrength(form.values.password)
    : { score: 0, label: '', color: 'gray' };

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
        <Stack gap="lg">
          <div style={{ textAlign: 'center' }}>
            <Badge size="lg" variant="gradient" gradient={{ from: 'blue', to: 'cyan' }} mb="md">
              Partner Registration
            </Badge>
            <Title order={2} mb="xs">
              Join as a Business Partner
            </Title>
            <Text c="dimmed" size="sm">
              Register your business to access our partner platform and exclusive opportunities
            </Text>
          </div>

          {error && (
            <Alert icon={<IconAlertCircle size={16} />} color="red">
              {error}
            </Alert>
          )}

          <form onSubmit={form.onSubmit(handleSubmit)}>
            <Stack gap="md">
              <div>
                <Text fw={600} mb="md">Account Information</Text>
                <Stack gap="sm">
                  <TextInput
                    label="Email Address"
                    placeholder="business@company.com"
                    required
                    leftSection={<IconMail size={16} />}
                    {...form.getInputProps('email')}
                  />
                  
                  <PasswordInput
                    label="Password"
                    placeholder="Create a strong password"
                    required
                    leftSection={<IconLock size={16} />}
                    {...form.getInputProps('password')}
                  />
                  
                  {form.values.password && (
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
                    label="Confirm Password"
                    placeholder="Confirm your password"
                    required
                    leftSection={<IconLock size={16} />}
                    {...form.getInputProps('confirmPassword')}
                  />
                </Stack>
              </div>

              <Divider />

              <div>
                <Text fw={600} mb="md">Business Information</Text>
                <Stack gap="sm">
                  <TextInput
                    label="Company Name"
                    placeholder="Your Company Ltd."
                    required
                    leftSection={<IconBuilding size={16} />}
                    {...form.getInputProps('company_name')}
                  />
                  
                  <TextInput
                    label="Contact Person"
                    placeholder="Full name of primary contact"
                    required
                    leftSection={<IconUser size={16} />}
                    {...form.getInputProps('contact_person')}
                  />
                  
                  <TextInput
                    label="Phone Number"
                    placeholder="Business phone number"
                    required
                    leftSection={<IconPhone size={16} />}
                    {...form.getInputProps('phone')}
                  />
                  
                  <TextInput
                    label="Business Address"
                    placeholder="Complete business address"
                    required
                    leftSection={<IconMapPin size={16} />}
                    {...form.getInputProps('address')}
                  />
                  
                  <Select
                    label="Business Type"
                    placeholder="Select your business type"
                    required
                    data={businessTypes}
                    {...form.getInputProps('business_type')}
                  />
                  
                  <TextInput
                    label="License Number"
                    placeholder="Business license or registration number"
                    required
                    {...form.getInputProps('license_number')}
                  />
                  
                  <Textarea
                    label="Business Description"
                    placeholder="Describe your business, services, and experience..."
                    required
                    minRows={3}
                    {...form.getInputProps('description')}
                  />
                </Stack>
              </div>

              <Divider />

              <Stack gap="sm">
                <Checkbox
                  label="I accept the terms and conditions and privacy policy for business partners"
                  required
                  {...form.getInputProps('terms_accepted', { type: 'checkbox' })}
                />
                
                <Checkbox
                  label="I consent to receive marketing communications and business updates"
                  {...form.getInputProps('marketing_consent', { type: 'checkbox' })}
                />
              </Stack>

              <Button type="submit" fullWidth loading={loading} size="md">
                Register as Partner
              </Button>
            </Stack>
          </form>

          <Text c="dimmed" size="sm" ta="center">
            Already have a partner account?{' '}
            <Anchor size="sm" component={Link} href="/auth/login-partner">
              Sign in here
            </Anchor>
          </Text>
          
          <Text c="dimmed" size="sm" ta="center">
            Looking for a regular account?{' '}
            <Anchor size="sm" component={Link} href="/auth/register">
              Register as individual
            </Anchor>
          </Text>
        </Stack>
      </Paper>
    </Container>
  );
}