import type {
  Booking,
  Business,
  BusinessSettings,
  BusinessTheme,
  FaqItem,
  GalleryItem,
  NewBooking,
  PageConfig,
  Product,
  SeoConfig,
  ServiceItem,
  TeamMember,
  Testimonial,
} from '@rdplatforms/types';
import type { ContactMessageDetails } from '@rdplatforms/utils';

/**
 * Every method returns a Promise even though the JSON implementation is
 * synchronous under the hood. This is deliberate: it lets every consumer
 * (components, hooks, TanStack Query) treat data access as async from day
 * one, so swapping JsonDataSource for an HttpDataSource later is a
 * same-shape, drop-in replacement. See docs/future-backend-contract.md.
 */
export interface BusinessDataSource {
  listBusinesses(): Promise<Business[]>;
  getBusinessBySlug(slug: string): Promise<Business | undefined>;
}

export interface ServiceCatalogDataSource {
  listServicesByBusiness(businessId: string): Promise<ServiceItem[]>;
}

/**
 * Read-only product listing — implemented by both JsonDataSource (a
 * static-data seed, for a Tier 1 business with no backend at all) and
 * HttpDataSource (Tier 3). Unlike the old HttpProductDataSource-only
 * design, a Product's write path (create/update/delete, apps/portal,
 * Owner-only) stays backend-only regardless — this interface only
 * covers the customer-facing read path, which never needed CRUD.
 */
export interface ProductCatalogDataSource {
  listProductsByBusiness(businessId: string): Promise<Product[]>;
}

export interface GalleryDataSource {
  listGalleryByBusiness(businessId: string): Promise<GalleryItem[]>;
}

export interface TestimonialDataSource {
  listTestimonialsByBusiness(businessId: string): Promise<Testimonial[]>;
}

export interface ThemeDataSource {
  getThemeByBusiness(businessId: string): Promise<BusinessTheme | undefined>;
}

export interface SeoDataSource {
  getSeoByBusiness(businessId: string): Promise<SeoConfig | undefined>;
}

export interface PageDataSource {
  listPagesByBusiness(businessId: string): Promise<PageConfig[]>;
  getPageByBusinessAndPath(businessId: string, path: string): Promise<PageConfig | undefined>;
}

export interface FaqDataSource {
  listFaqsByBusiness(businessId: string): Promise<FaqItem[]>;
}

export interface TeamDataSource {
  listTeamByBusiness(businessId: string): Promise<TeamMember[]>;
}

export interface SettingsDataSource {
  getSettingsByBusiness(businessId: string): Promise<BusinessSettings | undefined>;
}

/**
 * Implemented by both HttpBookingDataSource (Tier 3 — platform-backend)
 * and AppsScriptBookingDataSource (Tier 2 — a business's own Google
 * account) — see docs/backend-tiers.md. BookingService picks whichever
 * one applies (or neither, Tier 1) based on which env var is set.
 */
export interface BookingDataSource {
  createBooking(businessId: string, booking: NewBooking): Promise<Booking>;
}

/**
 * Tier 2 (AppsScriptContactDataSource) only for now — there is no Tier 3
 * equivalent yet, unlike bookings; platform-backend has no
 * ContactMessage entity. ContactService still degrades to a no-op with
 * neither configured, same as BookingService.
 */
export interface ContactDataSource {
  createContactMessage(businessId: string, message: ContactMessageDetails): Promise<void>;
}
