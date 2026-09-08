/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** One fixed GA4 id for the whole app. See docs/analytics.md. */
  readonly VITE_GOOGLE_ANALYTICS_ID?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
