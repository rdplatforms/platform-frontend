import type {
  Business,
  BusinessSettings,
  BusinessTheme,
  FaqItem,
  GalleryItem,
  PageConfig,
  SeoConfig,
  ServiceItem,
  TeamMember,
  Testimonial,
} from '@rdplatforms/types';

import type {
  BusinessDataSource,
  FaqDataSource,
  GalleryDataSource,
  PageDataSource,
  SeoDataSource,
  ServiceCatalogDataSource,
  SettingsDataSource,
  TeamDataSource,
  TestimonialDataSource,
  ThemeDataSource,
} from './types';

export interface HttpDataSourceOptions {
  /** e.g. "http://localhost:8081" — no trailing slash. */
  baseUrl: string;
  fetchImpl?: typeof fetch;
}

/**
 * Real REST implementation of every read-only *DataSource interface,
 * calling the backend built in backend/ (see
 * docs/future-backend-contract.md and TASK-004 in TASKS.md — every path
 * here matches a controller there exactly). Same method signatures and
 * return shapes as JsonDataSource, so swapping which one a *Service
 * constructs (see dataSource/activeDataSource.ts) is the entire
 * migration — no changes to any component or hook.
 */
export class HttpDataSource
  implements
    BusinessDataSource,
    ServiceCatalogDataSource,
    GalleryDataSource,
    TestimonialDataSource,
    ThemeDataSource,
    SeoDataSource,
    PageDataSource,
    FaqDataSource,
    TeamDataSource,
    SettingsDataSource
{
  constructor(private readonly options: HttpDataSourceOptions) {}

  async listBusinesses(): Promise<Business[]> {
    return this.getList<Business>('/businesses');
  }

  async getBusinessBySlug(slug: string): Promise<Business | undefined> {
    return this.getOptional<Business>(`/businesses/by-slug/${encodeURIComponent(slug)}`);
  }

  async listServicesByBusiness(businessId: string): Promise<ServiceItem[]> {
    return this.getList<ServiceItem>(`/businesses/${encodeURIComponent(businessId)}/services`);
  }

  async listGalleryByBusiness(businessId: string): Promise<GalleryItem[]> {
    return this.getList<GalleryItem>(`/businesses/${encodeURIComponent(businessId)}/gallery`);
  }

  async listTestimonialsByBusiness(businessId: string): Promise<Testimonial[]> {
    return this.getList<Testimonial>(`/businesses/${encodeURIComponent(businessId)}/testimonials`);
  }

  async getThemeByBusiness(businessId: string): Promise<BusinessTheme | undefined> {
    return this.getOptional<BusinessTheme>(`/businesses/${encodeURIComponent(businessId)}/theme`);
  }

  async getSeoByBusiness(businessId: string): Promise<SeoConfig | undefined> {
    return this.getOptional<SeoConfig>(`/businesses/${encodeURIComponent(businessId)}/seo`);
  }

  async listPagesByBusiness(businessId: string): Promise<PageConfig[]> {
    return this.getList<PageConfig>(`/businesses/${encodeURIComponent(businessId)}/pages`);
  }

  async getPageByBusinessAndPath(
    businessId: string,
    path: string,
  ): Promise<PageConfig | undefined> {
    return this.getOptional<PageConfig>(
      `/businesses/${encodeURIComponent(businessId)}/pages/by-path?path=${encodeURIComponent(path)}`,
    );
  }

  async listFaqsByBusiness(businessId: string): Promise<FaqItem[]> {
    return this.getList<FaqItem>(`/businesses/${encodeURIComponent(businessId)}/faqs`);
  }

  async listTeamByBusiness(businessId: string): Promise<TeamMember[]> {
    return this.getList<TeamMember>(`/businesses/${encodeURIComponent(businessId)}/team`);
  }

  async getSettingsByBusiness(businessId: string): Promise<BusinessSettings | undefined> {
    return this.getOptional<BusinessSettings>(
      `/businesses/${encodeURIComponent(businessId)}/settings`,
    );
  }

  private async getList<T>(path: string): Promise<T[]> {
    const res = await (this.options.fetchImpl ?? fetch)(`${this.options.baseUrl}${path}`);
    if (!res.ok) {
      return [];
    }
    return (await res.json()) as T[];
  }

  private async getOptional<T>(path: string): Promise<T | undefined> {
    const res = await (this.options.fetchImpl ?? fetch)(`${this.options.baseUrl}${path}`);
    if (!res.ok) {
      return undefined;
    }
    return (await res.json()) as T;
  }
}
