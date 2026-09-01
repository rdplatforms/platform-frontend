import { describe, expect, it } from 'vitest';
import type { BusinessTheme } from '@rdplatforms/types';
import { createAppTheme } from '../src/theme/createAppTheme';

const baseTheme: BusinessTheme = {
  businessId: 'swami-hair-salon',
  primaryColor: '#C9973E',
  secondaryColor: '#141414',
  typography: {
    fontFamily: "'Noto Sans Devanagari', 'Inter', sans-serif",
    headingFontFamily: "'Yatra One', 'Noto Sans Devanagari', serif",
    headingFontFamilyByLocale: {
      mr: "'Noto Sans Devanagari', 'Inter', sans-serif",
    },
    pairing: 'modern-sans',
  },
  borderRadius: 4,
  buttonStyle: 'square',
  backgroundStyle: 'solid',
  logoUrl: '',
  darkModeEnabled: false,
};

describe('createAppTheme heading font selection', () => {
  it('uses headingFontFamilyByLocale for a locale that has an override', () => {
    const theme = createAppTheme(baseTheme, 'mr');
    expect(theme.typography.h1.fontFamily).toBe("'Noto Sans Devanagari', 'Inter', sans-serif");
  });

  it('falls back to headingFontFamily for a locale without an override', () => {
    const theme = createAppTheme(baseTheme, 'en');
    expect(theme.typography.h1.fontFamily).toBe("'Yatra One', 'Noto Sans Devanagari', serif");
  });

  it('falls back to headingFontFamily when no locale is passed', () => {
    const theme = createAppTheme(baseTheme);
    expect(theme.typography.h1.fontFamily).toBe("'Yatra One', 'Noto Sans Devanagari', serif");
  });

  it('falls back to fontFamily when neither headingFontFamily nor an override is set', () => {
    const theme = createAppTheme({
      ...baseTheme,
      typography: { fontFamily: 'Inter, sans-serif', pairing: 'modern-sans' },
    });
    expect(theme.typography.h1.fontFamily).toBe('Inter, sans-serif');
  });
});
