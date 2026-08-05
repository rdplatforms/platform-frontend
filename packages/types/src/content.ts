/**
 * Content contracts. Every collection is keyed by businessId in the static
 * data source today, and will map 1:1 to REST resources scoped by business
 * once the Spring Boot backend exists (see docs/future-backend-contract.md).
 */
export interface ServiceItem {
  id: string;
  businessId: string;
  name: string;
  description: string;
  price?: number;
  currency?: string;
  durationMinutes?: number;
  imageUrl?: string;
  category?: string;
  isFeatured?: boolean;
}

export interface GalleryItem {
  id: string;
  businessId: string;
  title?: string;
  imageUrl: string;
  category?: string;
  order: number;
}

export interface Testimonial {
  id: string;
  businessId: string;
  authorName: string;
  authorRole?: string;
  avatarUrl?: string;
  rating: number;
  quote: string;
}

export interface SeoConfig {
  businessId: string;
  title: string;
  description: string;
  keywords: string[];
  ogImageUrl?: string;
  canonicalUrl?: string;
}

export type SectionType =
  | 'hero'
  | 'about'
  | 'services'
  | 'gallery'
  | 'testimonials'
  | 'faq'
  | 'cta'
  | 'contact'
  | 'map'
  | 'pricing'
  | 'team';

export interface SectionConfig {
  type: SectionType;
  enabled: boolean;
  order: number;
  title?: string;
  subtitle?: string;
}

export interface PageConfig {
  businessId: string;
  path: string;
  name: string;
  sections: SectionConfig[];
}

export interface FaqItem {
  id: string;
  businessId: string;
  question: string;
  answer: string;
}

export interface TeamMember {
  id: string;
  businessId: string;
  name: string;
  role: string;
  photoUrl?: string;
  bio?: string;
}

export interface BusinessSettings {
  businessId: string;
  currency: string;
  locale: string;
  timezone: string;
  bookingEnabled: boolean;
  whatsappEnabled: boolean;
  maintenanceMode: boolean;
  /**
   * Placeholder gate for the per-business owner dashboard (see
   * docs/business-dashboard.md) — a plain-text passcode, not real
   * authentication. Undefined disables the dashboard entirely for this
   * business until real auth exists (see docs/future-admin.md).
   */
  dashboardPasscode?: string;
}
