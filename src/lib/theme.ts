import { createTheme, MantineColorsTuple } from '@mantine/core';

// Scandinavian minimalist color palette
const primaryColor: MantineColorsTuple = [
  '#fafafa',
  '#f5f5f5',
  '#eeeeee',
  '#e0e0e0',
  '#bdbdbd',
  '#9e9e9e',
  '#757575',
  '#616161',
  '#424242',
  '#212121'
];

const secondaryColor: MantineColorsTuple = [
  '#f8fafc',
  '#f1f5f9',
  '#e2e8f0',
  '#cbd5e1',
  '#94a3b8',
  '#64748b',
  '#475569',
  '#334155',
  '#1e293b',
  '#0f172a'
];

const accentColor: MantineColorsTuple = [
  '#fef7f0',
  '#feeee0',
  '#fdd5b3',
  '#fcbc86',
  '#fba359',
  '#d4915a',
  '#b8804f',
  '#9c6f44',
  '#805e39',
  '#644d2e'
];

const successColor: MantineColorsTuple = [
  '#f0fdf4',
  '#dcfce7',
  '#bbf7d0',
  '#86efac',
  '#4ade80',
  '#22c55e',
  '#16a34a',
  '#15803d',
  '#166534',
  '#14532d'
];

const errorColor: MantineColorsTuple = [
  '#fef2f2',
  '#fee2e2',
  '#fecaca',
  '#fca5a5',
  '#f87171',
  '#ef4444',
  '#dc2626',
  '#b91c1c',
  '#991b1b',
  '#7f1d1d'
];

const neutralColor: MantineColorsTuple = [
  '#ffffff',
  '#fafafa',
  '#f5f5f5',
  '#eeeeee',
  '#e0e0e0',
  '#bdbdbd',
  '#9e9e9e',
  '#757575',
  '#616161',
  '#424242'
];

export const theme = createTheme({
  colors: {
    primary: primaryColor,
    secondary: secondaryColor,
    accent: accentColor,
    success: successColor,
    error: errorColor,
    neutral: neutralColor,
  },
  primaryColor: 'primary',
  primaryShade: { light: 5, dark: 7 },
  
  fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  fontFamilyMonospace: 'SF Mono, Monaco, "Cascadia Code", "Roboto Mono", Consolas, monospace',

  headings: {
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    fontWeight: '400',
    sizes: {
      h1: { fontSize: '2.5rem', lineHeight: '1.2', letterSpacing: '-0.02em' },
      h2: { fontSize: '2rem', lineHeight: '1.3', letterSpacing: '-0.015em' },
      h3: { fontSize: '1.5rem', lineHeight: '1.4', letterSpacing: '-0.01em' },
      h4: { fontSize: '1.25rem', lineHeight: '1.5', letterSpacing: '0em' },
      h5: { fontSize: '1.125rem', lineHeight: '1.6' },
      h6: { fontSize: '1rem', lineHeight: '1.6' },
    },
  },
  
  spacing: {
    xs: '0.75rem',
    sm: '1rem',
    md: '1.5rem',
    lg: '2rem',
    xl: '3rem',
    xxl: '4rem',
  },

  radius: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '0.75rem',
    lg: '1rem',
    xl: '1.5rem',
  },
  
  shadows: {
    xs: '0 1px 2px rgba(0, 0, 0, 0.04)',
    sm: '0 2px 4px rgba(0, 0, 0, 0.04)',
    md: '0 4px 8px rgba(0, 0, 0, 0.06)',
    lg: '0 8px 16px rgba(0, 0, 0, 0.08)',
    xl: '0 16px 32px rgba(0, 0, 0, 0.10)',
  },
  
  components: {
    Button: {
      defaultProps: {
        radius: 'sm',
        variant: 'subtle',
      },
    },

    Card: {
      defaultProps: {
        radius: 'sm',
        shadow: 'xs',
        padding: 'xl',
        withBorder: true,
      },
    },
    
    TextInput: {
      defaultProps: {
        radius: 'sm',
        variant: 'filled',
      },
    },

    PasswordInput: {
      defaultProps: {
        radius: 'sm',
        variant: 'filled',
      },
    },

    Select: {
      defaultProps: {
        radius: 'sm',
        variant: 'filled',
      },
    },

    Textarea: {
      defaultProps: {
        radius: 'sm',
        variant: 'filled',
      },
    },
    
    Modal: {
      defaultProps: {
        radius: 'sm',
        shadow: 'md',
        overlayProps: {
          backgroundOpacity: 0.3,
          blur: 1,
        },
      },
    },

    Paper: {
      defaultProps: {
        radius: 'sm',
        shadow: 'xs',
        withBorder: true,
      },
    },

    Badge: {
      defaultProps: {
        radius: 'xs',
        variant: 'light',
      },
    },

    Notification: {
      defaultProps: {
        radius: 'sm',
      },
    },

    Spotlight: {
      defaultProps: {
        radius: 'sm',
        shadow: 'md',
      },
    },
    
    Carousel: {
      defaultProps: {
        radius: 'sm',
      },
    },
  },
  
  other: {
    // Custom theme values
    headerHeight: 70,
    footerHeight: 200,
    sidebarWidth: 280,
    contentMaxWidth: 1200,
    
    // Animation durations
    transitionDuration: {
      fast: '150ms',
      normal: '250ms',
      slow: '400ms',
    },
    
    // Breakpoints for responsive design
    breakpoints: {
      xs: '36em',
      sm: '48em',
      md: '62em',
      lg: '75em',
      xl: '88em',
    },
    
    // Z-index values
    zIndex: {
      dropdown: 1000,
      sticky: 1020,
      fixed: 1030,
      modal: 1040,
      popover: 1050,
      tooltip: 1060,
      notification: 1070,
    },
  },
});

// Dark theme variant
export const darkTheme = createTheme({
  ...theme,
  colorScheme: 'dark',
  colors: {
    ...theme.colors,
    dark: [
      '#C1C2C5',
      '#A6A7AB',
      '#909296',
      '#5c5f66',
      '#373A40',
      '#2C2E33',
      '#25262b',
      '#1A1B1E',
      '#141517',
      '#101113',
    ],
  },
});

// Utility function to get theme values
export const getThemeValue = (path: string, theme: any) => {
  return path.split('.').reduce((obj, key) => obj?.[key], theme);
};

// Common style mixins
export const styleMixins = {
  // Flexbox utilities
  flexCenter: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  flexBetween: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  
  // Text utilities
  textEllipsis: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap' as const,
  },
  
  // Hover effects
  hoverLift: {
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)',
    },
  },
  
  // Focus styles
  focusRing: {
    '&:focus': {
      outline: 'none',
      boxShadow: '0 0 0 2px rgba(33, 150, 243, 0.3)',
    },
  },
  
  // Responsive utilities
  hideOnMobile: {
    '@media (max-width: 768px)': {
      display: 'none',
    },
  },
  
  showOnMobile: {
    display: 'none',
    '@media (max-width: 768px)': {
      display: 'block',
    },
  },
};