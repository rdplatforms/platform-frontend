/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Base URL of the backend (../platform-backend/) — required, no static-data fallback for admin. */
  readonly VITE_API_BASE_URL?: string;
  /** One fixed GA4 id for the whole admin app. See docs/analytics.md. */
  readonly VITE_GOOGLE_ANALYTICS_ID?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
