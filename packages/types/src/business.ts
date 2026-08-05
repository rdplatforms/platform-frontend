/**
 * Core identity and configuration for a single tenant business.
 * This is the root object every service/resolver keys off of.
 */
export interface BusinessAddress {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  mapEmbedUrl?: string;
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
  email: string;
  whatsapp?: string;
  address: BusinessAddress;
}

export interface Business {
  id: string;
  slug: string;
  legalName: string;
  displayName: string;
  tagline?: string;
  category: BusinessCategory;
  logoUrl: string;
  faviconUrl?: string;
  description: string;
  contact: BusinessContact;
  hours: BusinessHours[];
  social: SocialLinks;
  domains: string[];
  isActive: boolean;
}
