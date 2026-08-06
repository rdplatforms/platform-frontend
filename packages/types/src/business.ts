import type { LocalizableText, SupportedLocale } from './locale';

/**
 * Core identity and configuration for a single tenant business.
 * This is the root object every service/resolver keys off of.
 */
export interface BusinessAddress {
  /**
   * All of these are optional because a business's exact formatted street
   * address may not be confirmed yet — coordinates/mapEmbedUrl/directionsUrl
   * can carry the real location in the meantime. Render defensively.
   */
  line1?: string;
  line2?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  mapEmbedUrl?: string;
  /** A shareable Google Maps link — "get directions" target, not the iframe src. */
  directionsUrl?: string;
  latitude?: number;
  longitude?: number;
}

export interface BusinessHours {
  day: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
  opensAt: string | null;
  closesAt: string | null;
  isClosed: boolean;
}

export interface SocialLinks {
  facebook?: string;
  instagram?: string;
  twitter?: string;
  linkedin?: string;
  youtube?: string;
  tiktok?: string;
  pinterest?: string;
}

export type BusinessCategory =
  | 'salon'
  | 'restaurant'
  | 'design-studio'
  | 'gym'
  | 'dental-clinic'
  | 'hotel'
  | 'interior-design'
  | 'photography'
  | 'legal'
  | 'architecture'
  | 'ecommerce'
  | 'real-estate';

export interface BusinessContact {
  phone: string;
  /** Optional — some small local businesses genuinely have no business email, only a phone. */
  email?: string;
  whatsapp?: string;
  address: BusinessAddress;
}

export interface Business {
  id: string;
  slug: string;
  legalName: string;
  /** Always the business's real name, as-is — never translated per locale. */
  displayName: string;
  tagline?: LocalizableText;
  category: BusinessCategory;
  logoUrl: string;
  faviconUrl?: string;
  /** A short line shown near the logo (a motto, invocation, founding note). Optional, business-specific. */
  brandNote?: LocalizableText;
  description: LocalizableText;
  contact: BusinessContact;
  hours: BusinessHours[];
  social: SocialLinks;
  domains: string[];
  isActive: boolean;
  /**
   * Ordered locales this business's content is available in; the first is
   * the default. Absent means single-language (English). See
   * docs/i18n.md.
   */
  supportedLocales?: SupportedLocale[];
}
