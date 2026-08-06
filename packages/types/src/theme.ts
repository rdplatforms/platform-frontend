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
  /**
   * A Google Fonts CSS2 API URL (the href you'd put on a <link>) covering
   * every family referenced above. Without this, fontFamily/headingFontFamily
   * are just names — the browser silently falls back to a system font
   * that happens to share the name, or to a generic sans-serif if it
   * doesn't. Required for any non-Latin script (e.g. Devanagari) to render
   * in the intended display face rather than an OS default.
   */
  googleFontsUrl?: string;
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
