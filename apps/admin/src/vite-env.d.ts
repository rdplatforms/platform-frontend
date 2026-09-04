/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Base URL of the backend (backend/) — required, no static-data fallback for admin. */
  readonly VITE_API_BASE_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
