import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ColorSchemeScript, MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { ModalsProvider } from '@mantine/modals';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { theme } from '@/lib/theme';
import { Providers } from '@/components/providers/Providers';
import { AuthProvider } from '@/contexts/AuthContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import Layout from '@/components/layout/Layout';

// Import Mantine styles
import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import '@mantine/notifications/styles.css';
import '@mantine/spotlight/styles.css';
import '@mantine/carousel/styles.css';
import '@mantine/dropzone/styles.css';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'Vama Buzau - Premium Accommodation Booking Platform',
  description: 'Discover and book unique accommodations in Buzău and beyond. From cozy apartments to luxury villas, find your perfect stay with Vama Buzau.',
  keywords: 'accommodation, booking, Buzău, Romania, hotels, apartments, vacation rentals',
  authors: [{ name: 'Vama Buzau Team' }],
  creator: 'Vama Buzau',
  publisher: 'Vama Buzau',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://vamabuzau.com'),
  alternates: {
    canonical: '/',
    languages: {
      'en-US': '/en-US',
      'ro-RO': '/ro-RO',
    },
  },
  openGraph: {
    title: 'Vama Buzau - Premium Accommodation Booking Platform',
    description: 'Discover and book unique accommodations in Buzău and beyond. From cozy apartments to luxury villas, find your perfect stay with Vama Buzau.',
    url: 'https://vamabuzau.com',
    siteName: 'Vama Buzau',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Vama Buzau - Premium Accommodation Booking Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Vama Buzau - Premium Accommodation Booking Platform',
    description: 'Discover and book unique accommodations in Buzău and beyond. From cozy apartments to luxury villas, find your perfect stay with Vama Buzau.',
    images: ['/og-image.jpg'],
    creator: '@vamabuzau',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'google-site-verification-code',
    yandex: 'yandex-verification-code',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <head>
        <ColorSchemeScript />
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>
        <MantineProvider theme={theme} defaultColorScheme="auto">
          <ThemeProvider>
            <ModalsProvider>
              <Notifications position="top-right" zIndex={1000} />
              <Providers>
                <AuthProvider>
                  <Layout>
                    {children}
                  </Layout>
                </AuthProvider>
              </Providers>
            </ModalsProvider>
          </ThemeProvider>
        </MantineProvider>
      </body>
    </html>
  );
}
