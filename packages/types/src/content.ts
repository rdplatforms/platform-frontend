import type { LocalizableText } from './locale';

/**
 * Content contracts. Every collection is keyed by businessId in the static
 * data source today, and will map 1:1 to REST resources scoped by business
 * once the Spring Boot backend exists (see docs/future-backend-contract.md).
 */
export interface ServiceItem {
  id: string;
  businessId: string;
  name: LocalizableText;
  description: LocalizableText;
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
  title?: LocalizableText;
  imageUrl: string;
  category?: string;
  order: number;
}

export interface Testimonial {
  id: string;
  businessId: string;
  authorName: string;
  authorRole?: LocalizableText;
  avatarUrl?: string;
  rating: number;
  quote: LocalizableText;
}

export interface SeoConfig {
  businessId: string;
  title: LocalizableText;
  description: LocalizableText;
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
  | 'team'
  | 'appointment';

export interface SectionConfig {
  type: SectionType;
  enabled: boolean;
  order: number;
  title?: LocalizableText;
  subtitle?: LocalizableText;
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
  question: LocalizableText;
  answer: LocalizableText;
}

export interface TeamMember {
  id: string;
  businessId: string;
  name: string;
  role: LocalizableText;
  photoUrl?: string;
  bio?: LocalizableText;
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
  /**
   * Appointment time-slot length in minutes for the Appointment section
   * (see docs/appointments.md). Defaults to 60 when unset — change this
   * instead of touching any code to offer 30-minute slots, etc.
   */
  appointmentSlotMinutes?: number;
}
