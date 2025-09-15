'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { MantineColorScheme, useMantineColorScheme } from '@mantine/core';

interface ThemeContextType {
  colorScheme: MantineColorScheme;
  toggleColorScheme: () => void;
  setColorScheme: (scheme: MantineColorScheme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { colorScheme, setColorScheme: mantineSetColorScheme } = useMantineColorScheme();
  const [mounted, setMounted] = useState(false);

  // Handle hydration
  useEffect(() => {
    setMounted(true);
    
    // Load saved theme from localStorage
    const savedTheme = localStorage.getItem('mantine-color-scheme') as MantineColorScheme;
    if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
      mantineSetColorScheme(savedTheme);
    } else {
      // Check system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      mantineSetColorScheme(prefersDark ? 'dark' : 'light');
    }
  }, []);

  // Save theme to localStorage whenever it changes
  useEffect(() => {
    if (mounted) {
      localStorage.setItem('mantine-color-scheme', colorScheme);
    }
  }, [colorScheme, mounted]);

  const toggleColorScheme = () => {
    const newScheme = colorScheme === 'dark' ? 'light' : 'dark';
    mantineSetColorScheme(newScheme);
  };

  const setColorScheme = (scheme: MantineColorScheme) => {
    mantineSetColorScheme(scheme);
  };

  // Listen for system theme changes
  useEffect(() => {
    if (!mounted) return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      // Only auto-switch if user hasn't manually set a preference
      const savedTheme = localStorage.getItem('mantine-color-scheme');
      if (!savedTheme) {
        mantineSetColorScheme(e.matches ? 'dark' : 'light');
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [mounted, mantineSetColorScheme]);

  const value = {
    colorScheme: mounted ? colorScheme : 'light', // Prevent hydration mismatch
    toggleColorScheme,
    setColorScheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

// Hook for theme-aware styling
export function useThemeStyles() {
  const { colorScheme } = useTheme();
  
  return {
    isDark: colorScheme === 'dark',
    isLight: colorScheme === 'light',
    
    // Common theme-aware styles
    bg: colorScheme === 'dark' ? '#25262b' : '#ffffff',
    cardBg: colorScheme === 'dark' ? '#2c2e33' : '#ffffff',
    borderColor: colorScheme === 'dark' ? '#373a40' : 'rgba(0, 0, 0, 0.08)',
    textColor: colorScheme === 'dark' ? '#c1c2c5' : '#000000',
    mutedTextColor: colorScheme === 'dark' ? '#909296' : '#6b7280',
    
    // Shadows
    shadow: colorScheme === 'dark' 
      ? '0 4px 6px rgba(0, 0, 0, 0.3)' 
      : '0 4px 6px rgba(0, 0, 0, 0.07)',
    shadowHover: colorScheme === 'dark'
      ? '0 10px 25px rgba(0, 0, 0, 0.4)'
      : '0 10px 25px rgba(0, 0, 0, 0.12)',
  };
}