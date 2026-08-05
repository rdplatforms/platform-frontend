/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_DEFAULT_BUSINESS_SLUG?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
