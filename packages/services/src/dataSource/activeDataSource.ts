import { HttpDataSource } from './HttpDataSource';
import { jsonDataSource } from './JsonDataSource';
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

type ReadOnlyDataSource = BusinessDataSource &
  ServiceCatalogDataSource &
  GalleryDataSource &
  TestimonialDataSource &
  ThemeDataSource &
  SeoDataSource &
  PageDataSource &
  FaqDataSource &
  TeamDataSource &
  SettingsDataSource;

/**
 * The single seam every read-only *Service constructs against (TASK-005
 * — see docs/future-backend-contract.md). Set VITE_API_BASE_URL to point
 * the whole frontend at the real backend (backend/); leave it unset to
 * keep using the bundled static-data/*.json — no code change either way,
 * just an env var. SalesDataSource is unaffected (still
 * localStorageSalesDataSource — see docs/business-dashboard.md).
 *
 * Read via a local cast rather than the ambient ImportMetaEnv/ImportMeta
 * global augmentation (the pattern packages/providers uses): this
 * package is depended on by several others (packages/hooks, ui,
 * business, apps/website), and each of those would otherwise need its
 * own matching vite/client type setup just to type-check a file it
 * never touches directly.
 */
const apiBaseUrl = (import.meta as unknown as { env?: Record<string, string | undefined> }).env
  ?.VITE_API_BASE_URL;

export const activeDataSource: ReadOnlyDataSource = apiBaseUrl
  ? new HttpDataSource({ baseUrl: apiBaseUrl })
  : jsonDataSource;
