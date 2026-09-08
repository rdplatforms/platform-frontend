/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_DEFAULT_BUSINESS_SLUG?: string;
  /** Points the frontend at the real backend (../platform-backend/) instead of the
   * bundled static-data/*.json — see packages/services/src/dataSource/activeDataSource.ts. */
  readonly VITE_API_BASE_URL?: string;
  /** Tier 2 — this business's own Apps Script Web App URL. Only used for bookings/contact; ignored if VITE_API_BASE_URL is also set. See docs/backend-tiers.md. */
  readonly VITE_APPS_SCRIPT_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
