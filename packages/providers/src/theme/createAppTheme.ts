import { createTheme, type Theme } from '@mui/material/styles';
import type { BusinessTheme } from '@rdplatforms/types';

const BUTTON_RADIUS_BY_STYLE: Record<BusinessTheme['buttonStyle'], number> = {
  square: 4,
  rounded: 12,
  pill: 999,
};

/**
 * The core of the theme engine: turns a business's declarative theme config
 * into a real MUI Theme. No business ever ships a line of CSS or a themed
 * component override — everything visual is derived from this one function.
 */
export function createAppTheme(businessTheme: BusinessTheme | undefined): Theme {
  const theme = businessTheme ?? DEFAULT_THEME;

  return createTheme({
    palette: {
      mode: theme.darkModeEnabled ? 'dark' : 'light',
      primary: { main: theme.primaryColor },
      secondary: { main: theme.secondaryColor },
      ...(theme.backgroundColor
        ? { background: { default: theme.backgroundColor, paper: theme.backgroundColor } }
        : {}),
      ...(theme.textColor ? { text: { primary: theme.textColor } } : {}),
    },
    shape: {
      borderRadius: theme.borderRadius,
    },
    typography: {
      fontFamily: theme.typography.fontFamily,
      h1: { fontFamily: theme.typography.headingFontFamily ?? theme.typography.fontFamily },
      h2: { fontFamily: theme.typography.headingFontFamily ?? theme.typography.fontFamily },
      h3: { fontFamily: theme.typography.headingFontFamily ?? theme.typography.fontFamily },
      h4: { fontFamily: theme.typography.headingFontFamily ?? theme.typography.fontFamily },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: BUTTON_RADIUS_BY_STYLE[theme.buttonStyle],
            textTransform: 'none',
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage:
              theme.backgroundStyle === 'soft-gradient'
                ? `linear-gradient(180deg, ${theme.primaryColor}0d 0%, transparent 100%)`
                : 'none',
          },
        },
      },
    },
  });
}

const DEFAULT_THEME: BusinessTheme = {
  businessId: 'default',
  primaryColor: '#1976d2',
  secondaryColor: '#9c27b0',
  typography: { fontFamily: 'Inter, sans-serif', pairing: 'modern-sans' },
  borderRadius: 8,
  buttonStyle: 'rounded',
  backgroundStyle: 'solid',
  logoUrl: '',
  darkModeEnabled: false,
};
