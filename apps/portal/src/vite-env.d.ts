/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL?: string;
  /** Dev/preview convenience default (mirrors apps/website's own var) — a real portal domain resolves via Business.portalDomains instead. */
  readonly VITE_DEFAULT_BUSINESS_SLUG?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
