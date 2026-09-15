import type {
  Business,
  BusinessSettings,
  BusinessTheme,
  FaqItem,
  GalleryItem,
  PageConfig,
  Product,
  SeoConfig,
  ServiceItem,
  TeamMember,
  Testimonial,
} from '@rdplatforms/types';

import businessIndex from '@rdplatforms/static-data/businesses/index';
import swamiHairSalon from '@rdplatforms/static-data/businesses/swami-hair-salon';
import urbanBistro from '@rdplatforms/static-data/businesses/urban-bistro';
import vision3d from '@rdplatforms/static-data/businesses/vision3d';
import printforge3d from '@rdplatforms/static-data/businesses/printforge-3d';
import jagdambCreation from '@rdplatforms/static-data/businesses/jagdamb-creation';
import servicesData from '@rdplatforms/static-data/services';
import galleryData from '@rdplatforms/static-data/gallery';
import testimonialsData from '@rdplatforms/static-data/testimonials';
import themeData from '@rdplatforms/static-data/theme';
import seoData from '@rdplatforms/static-data/seo';
import pagesData from '@rdplatforms/static-data/pages';
import settingsData from '@rdplatforms/static-data/settings';
import faqData from '@rdplatforms/static-data/faq';
import teamData from '@rdplatforms/static-data/team';
import productsData from '@rdplatforms/static-data/products';

import type {
  BusinessDataSource,
  FaqDataSource,
  GalleryDataSource,
  PageDataSource,
  ProductCatalogDataSource,
  SeoDataSource,
  ServiceCatalogDataSource,
  SettingsDataSource,
  TeamDataSource,
  TestimonialDataSource,
  ThemeDataSource,
} from './types';

/**
 * Every demo business JSON file is statically imported and registered here.
 * This registry — not the JSON files themselves — is the seam a future
 * HttpDataSource replaces. Adding a business means adding one entry here
 * and one JSON file, never touching a component or hook.
 */
const BUSINESSES_BY_SLUG: Record<string, Business> = {
  'swami-hair-salon': swamiHairSalon as Business,
  'urban-bistro': urbanBistro as Business,
  vision3d: vision3d as Business,
  'printforge-3d': printforge3d as Business,
  'jagdamb-creation': jagdambCreation as Business,
};

const SERVICES_BY_BUSINESS = servicesData as Record<string, ServiceItem[]>;
const GALLERY_BY_BUSINESS = galleryData as Record<string, GalleryItem[]>;
const TESTIMONIALS_BY_BUSINESS = testimonialsData as Record<string, Testimonial[]>;
const THEME_BY_BUSINESS = themeData as Record<string, BusinessTheme>;
const SEO_BY_BUSINESS = seoData as Record<string, SeoConfig>;
const PAGES_BY_BUSINESS = pagesData as Record<string, PageConfig[]>;
const SETTINGS_BY_BUSINESS = settingsData as Record<string, BusinessSettings>;
const FAQ_BY_BUSINESS = faqData as Record<string, FaqItem[]>;
const TEAM_BY_BUSINESS = teamData as Record<string, TeamMember[]>;
// Hand-authored products.json entries omit businessId/createdAt (see
// listProductsByBusiness below) — the literal JSON type doesn't
// structurally satisfy Product, hence the double cast.
const PRODUCTS_BY_BUSINESS = productsData as unknown as Record<string, Product[]>;

export class JsonDataSource
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
    SettingsDataSource,
    ProductCatalogDataSource
{
  async listBusinesses(): Promise<Business[]> {
    return businessIndex.slugs
      .map((slug) => BUSINESSES_BY_SLUG[slug])
      .filter((business): business is Business => Boolean(business));
  }

  async getBusinessBySlug(slug: string): Promise<Business | undefined> {
    return BUSINESSES_BY_SLUG[slug];
  }

  async listServicesByBusiness(businessId: string): Promise<ServiceItem[]> {
    return SERVICES_BY_BUSINESS[businessId] ?? [];
  }

  async listGalleryByBusiness(businessId: string): Promise<GalleryItem[]> {
    return GALLERY_BY_BUSINESS[businessId] ?? [];
  }

  async listTestimonialsByBusiness(businessId: string): Promise<Testimonial[]> {
    return TESTIMONIALS_BY_BUSINESS[businessId] ?? [];
  }

  async getThemeByBusiness(businessId: string): Promise<BusinessTheme | undefined> {
    return THEME_BY_BUSINESS[businessId];
  }

  async getSeoByBusiness(businessId: string): Promise<SeoConfig | undefined> {
    return SEO_BY_BUSINESS[businessId];
  }

  async listPagesByBusiness(businessId: string): Promise<PageConfig[]> {
    return PAGES_BY_BUSINESS[businessId] ?? [];
  }

  async getPageByBusinessAndPath(
    businessId: string,
    path: string,
  ): Promise<PageConfig | undefined> {
    return (PAGES_BY_BUSINESS[businessId] ?? []).find((page) => page.path === path);
  }

  async listFaqsByBusiness(businessId: string): Promise<FaqItem[]> {
    return FAQ_BY_BUSINESS[businessId] ?? [];
  }

  async listTeamByBusiness(businessId: string): Promise<TeamMember[]> {
    return TEAM_BY_BUSINESS[businessId] ?? [];
  }

  async getSettingsByBusiness(businessId: string): Promise<BusinessSettings | undefined> {
    return SETTINGS_BY_BUSINESS[businessId];
  }

  async listProductsByBusiness(businessId: string): Promise<Product[]> {
    // products.json entries are hand-authored without businessId/createdAt
    // (meaningless to author by hand for a static seed) — filled in here,
    // the same way a real backend would stamp them automatically.
    return (PRODUCTS_BY_BUSINESS[businessId] ?? []).map((product) => ({
      ...product,
      businessId,
      createdAt: product.createdAt ?? '2026-01-01T00:00:00.000Z',
    }));
  }
}

export const jsonDataSource = new JsonDataSource();
