/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL?: string;
  /** Dev/preview convenience default (mirrors apps/website's own var) — a real portal domain resolves via Business.portalDomains instead. */
  readonly VITE_DEFAULT_BUSINESS_SLUG?: string;
  /** One fixed GA4 id for the whole portal (internal usage analytics — how Owners/Staff use the tool), not per-business like apps/website's. See docs/analytics.md. */
  readonly VITE_GOOGLE_ANALYTICS_ID?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
