import type {
  Business,
  BusinessSettings,
  BusinessTheme,
  FaqItem,
  GalleryItem,
  NewSaleEntry,
  PageConfig,
  SaleEntry,
  SeoConfig,
  ServiceItem,
  TeamMember,
  Testimonial,
} from '@rdplatforms/types';

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
 * The first write-capable data source in the platform — logging sales
 * (services rendered, products sold) for the per-business owner
 * dashboard. See docs/business-dashboard.md.
 */
export interface SalesDataSource {
  listSalesByBusiness(businessId: string): Promise<SaleEntry[]>;
  createSale(entry: NewSaleEntry): Promise<SaleEntry>;
  deleteSale(id: string, businessId: string): Promise<void>;
}
