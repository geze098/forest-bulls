'use client';

import { ReactNode } from 'react';
import { AppShell, Container } from '@mantine/core';
import { HeaderMegaMenu } from './Header';
import Footer from './Footer';
import { useAuth } from '@/contexts/AuthContext';
import { LanguageProvider } from '@/contexts/LanguageContext';

interface LayoutProps {
  children: ReactNode;
  withContainer?: boolean;
  containerSize?: string | number;
  withFooter?: boolean;
  headerHeight?: number;
}

export default function Layout({
  children,
  withContainer = true,
  containerSize = 'xl',
  withFooter = true,
  headerHeight = 60,
}: LayoutProps) {
  const { loading } = useAuth();

  if (loading) {
    return (
      <LanguageProvider>
        <AppShell
          header={{ height: headerHeight }}
          padding={{ base: 'xs', sm: 'md' }}
        >
          <AppShell.Header>
            <HeaderMegaMenu />
          </AppShell.Header>
          <AppShell.Main>
            <div className="flex items-center justify-center min-h-screen">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
            
            {withFooter && (
              <Footer />
            )}
          </AppShell.Main>
        </AppShell>
      </LanguageProvider>
    );
  }

  return (
    <LanguageProvider>
      <AppShell
        header={{ height: headerHeight }}
        padding={{ base: 'xs', sm: 'md' }}
      >
        <AppShell.Header>
          <HeaderMegaMenu />
        </AppShell.Header>
        
        <AppShell.Main>
          {withContainer ? (
            <Container 
              size={containerSize === 'xl' ? 1200 : containerSize} 
              py={{ base: 'sm', sm: 'md', md: 'lg' }}
              px={{ base: 'xs', sm: 'md' }}
            >
              {children}
            </Container>
          ) : (
            children
          )}
          
          {withFooter && (
            <Footer />
          )}
        </AppShell.Main>
      </AppShell>
    </LanguageProvider>
  );
}