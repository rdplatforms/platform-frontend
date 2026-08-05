/**
 * Business-level theme configuration. This is the contract the website's
 * theme engine reads to derive an MUI theme at runtime — no per-business code.
 */
export type ButtonStyle = 'rounded' | 'pill' | 'square';
export type BackgroundStyle = 'solid' | 'soft-gradient' | 'image-overlay';
export type FontPairing = 'modern-sans' | 'classic-serif' | 'editorial';

export interface ThemeTypography {
  fontFamily: string;
  headingFontFamily?: string;
  pairing: FontPairing;
}

export interface BusinessTheme {
  businessId: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor?: string;
  backgroundColor?: string;
  textColor?: string;
  typography: ThemeTypography;
  borderRadius: number;
  buttonStyle: ButtonStyle;
  backgroundStyle: BackgroundStyle;
  logoUrl: string;
  darkModeEnabled: boolean;
}
