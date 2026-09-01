import type { SupportedLocale } from './locale';

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
  /**
   * Per-locale override for headingFontFamily. A decorative/display font
   * that only covers Latin script (e.g. a stylized English heading face)
   * will silently break complex-script shaping — conjuncts and vowel
   * signs in Devanagari, for instance — when it's the first family in the
   * stack, even though it "falls back" to a real Devanagari font later in
   * that same string. Set headingFontFamily[locale] to a font that
   * actually supports that script; unset locales fall back to the plain
   * headingFontFamily above.
   */
  headingFontFamilyByLocale?: Partial<Record<SupportedLocale, string>>;
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
