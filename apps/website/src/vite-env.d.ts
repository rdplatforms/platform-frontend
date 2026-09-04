/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_DEFAULT_BUSINESS_SLUG?: string;
  /** Points the frontend at the real backend (backend/) instead of the
   * bundled static-data/*.json — see packages/services/src/dataSource/activeDataSource.ts. */
  readonly VITE_API_BASE_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
