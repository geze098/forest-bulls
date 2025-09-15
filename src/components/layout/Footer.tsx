'use client';

import Link from 'next/link';
import {
  Container,
  Group,
  Text,
  Anchor,
  Stack,
  SimpleGrid,
  ActionIcon,
  Divider,
  useMantineTheme,
  Paper,
} from '@mantine/core';
import { useThemeStyles } from '@/contexts/ThemeContext';
import {
  IconBrandFacebook,
  IconBrandTwitter,
  IconBrandInstagram,
  IconBrandLinkedin,
  IconMail,
  IconPhone,
  IconMapPin,
} from '@tabler/icons-react';

interface FooterProps {
  height?: number;
}

const footerLinks = {
  company: {
    title: 'Company',
    links: [
      { label: 'About Us', href: '/about' },
      { label: 'Careers', href: '/careers' },
      { label: 'Press', href: '/press' },
      { label: 'Blog', href: '/blog' },
    ],
  },
  support: {
    title: 'Support',
    links: [
      { label: 'Help Center', href: '/help' },
      { label: 'Contact Us', href: '/contact' },
      { label: 'Safety', href: '/safety' },
      { label: 'Accessibility', href: '/accessibility' },
    ],
  },
  hosting: {
    title: 'Hosting',
    links: [
      { label: 'List Your Property', href: '/host' },
      { label: 'Host Resources', href: '/host/resources' },
      { label: 'Community Forum', href: '/community' },
      { label: 'Host Guarantee', href: '/host/guarantee' },
    ],
  },
  legal: {
    title: 'Legal',
    links: [
      { label: 'Terms of Service', href: '/terms' },
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Cookie Policy', href: '/cookies' },
      { label: 'GDPR', href: '/gdpr' },
    ],
  },
};

const socialLinks = [
  { icon: IconBrandFacebook, href: 'https://facebook.com', label: 'Facebook' },
  { icon: IconBrandTwitter, href: 'https://twitter.com', label: 'Twitter' },
  { icon: IconBrandInstagram, href: 'https://instagram.com', label: 'Instagram' },
  { icon: IconBrandLinkedin, href: 'https://linkedin.com', label: 'LinkedIn' },
];

const contactInfo = [
  { icon: IconMail, text: 'contact@vamabuzau.com', href: 'mailto:contact@vamabuzau.com' },
  { icon: IconPhone, text: '+40 123 456 789', href: 'tel:+40123456789' },
  { icon: IconMapPin, text: 'Buzău, Romania', href: '#' },
];

export default function Footer({ height = 60 }: FooterProps) {
  const theme = useMantineTheme();
  const themeStyles = useThemeStyles();
  const currentYear = new Date().getFullYear();

  return (
    <Paper
      style={{
        borderTop: `1px solid ${themeStyles.borderColor}`,
        backgroundColor: themeStyles.bg,
        marginTop: 'auto',
      }}
    >
      <Container size={1200} py={{ base: 'md', sm: 'lg', md: 'xl' }} px={{ base: 'md', sm: 'xl' }}>
        <SimpleGrid cols={{ base: 1, xs: 2, sm: 2, md: 5 }} spacing={{ base: 'lg', sm: 'xl' }}>
          {/* Brand Section */}
          <div>
            <Group mb="md" justify={{ base: 'center', sm: 'flex-start' }}>
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: theme.radius.sm,
                  background: `linear-gradient(45deg, ${theme.colors.blue[6]}, ${theme.colors.cyan[6]})`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: 700,
                  fontSize: '14px',
                }}
              >
                VB
              </div>
              <Text fw={700} size="lg" c="blue">
                Vama Buzau
              </Text>
            </Group>
            <Text size="sm" c="dimmed" mb="md" ta={{ base: 'center', sm: 'left' }}>
              Discover unique accommodations and create unforgettable experiences in Buzău and beyond.
            </Text>
            <Stack gap="xs">
              {contactInfo.map((contact, index) => {
                const Icon = contact.icon;
                return (
                  <Group key={index} gap="xs" justify={{ base: 'center', sm: 'flex-start' }}>
                    <Icon size={16} color={themeStyles.mutedTextColor} />
                    <Anchor
                      href={contact.href}
                      size="sm"
                      c="dimmed"
                      style={{ textDecoration: 'none' }}
                    >
                      {contact.text}
                    </Anchor>
                  </Group>
                );
              })}
            </Stack>
          </div>

          {/* Footer Links */}
          {Object.entries(footerLinks).map(([key, section]) => (
            <div key={key}>
              <Text fw={600} mb={{ base: 'sm', sm: 'md' }} size="sm" ta={{ base: 'center', xs: 'left' }}>
                {section.title}
              </Text>
              <Stack gap="xs">
                {section.links.map((link, index) => (
                  <Anchor
                    key={index}
                    component={Link}
                    href={link.href}
                    size="sm"
                    c="dimmed"
                    ta={{ base: 'center', xs: 'left' }}
                    style={{ textDecoration: 'none' }}
                  >
                    {link.label}
                  </Anchor>
                ))}
              </Stack>
            </div>
          ))}
        </SimpleGrid>

        <Divider my={{ base: 'md', sm: 'xl' }} />

        {/* Bottom Section */}
        <Group justify={{ base: 'center', sm: 'space-between' }} align="center">
          <Group>
            <Text size="sm" c="dimmed" ta={{ base: 'center', sm: 'left' }}>
              © {currentYear} Vama Buzau. All rights reserved.
            </Text>
            <Group gap="xs" visibleFrom="sm">
              <Anchor
                component={Link}
                href="/terms"
                size="sm"
                c="dimmed"
                style={{ textDecoration: 'none' }}
              >
                Terms
              </Anchor>
              <Text size="sm" c="dimmed">
                •
              </Text>
              <Anchor
                component={Link}
                href="/privacy"
                size="sm"
                c="dimmed"
                style={{ textDecoration: 'none' }}
              >
                Privacy
              </Anchor>
              <Text size="sm" c="dimmed">
                •
              </Text>
              <Anchor
                component={Link}
                href="/cookies"
                size="sm"
                c="dimmed"
                style={{ textDecoration: 'none' }}
              >
                Cookies
              </Anchor>
            </Group>
          </Group>

          {/* Social Links */}
          <Group gap="xs" justify={{ base: 'center', sm: 'flex-end' }}>
            {socialLinks.map((social, index) => {
              const Icon = social.icon;
              return (
                <ActionIcon
                  key={index}
                  component="a"
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="subtle"
                  size="sm"
                  aria-label={social.label}
                >
                  <Icon size={16} />
                </ActionIcon>
              );
            })}
          </Group>
        </Group>

        {/* Mobile Links */}
        <Group justify="center" gap={{ base: 'sm', xs: 'xs' }} hiddenFrom="sm" mt="md">
          <Anchor
            component={Link}
            href="/terms"
            size="xs"
            c="dimmed"
            style={{ textDecoration: 'none' }}
          >
            Terms
          </Anchor>
          <Text size="xs" c="dimmed">
            •
          </Text>
          <Anchor
            component={Link}
            href="/privacy"
            size="xs"
            c="dimmed"
            style={{ textDecoration: 'none' }}
          >
            Privacy
          </Anchor>
          <Text size="xs" c="dimmed">
            •
          </Text>
          <Anchor
            component={Link}
            href="/cookies"
            size="xs"
            c="dimmed"
            style={{ textDecoration: 'none' }}
          >
            Cookies
          </Anchor>
        </Group>
      </Container>
    </Paper>
  );
}