import type { Business } from '@rdplatforms/types';

/**
 * Everything a strategy could possibly need to determine a business slug,
 * gathered up front by the caller (a browser entry point today, an SSR
 * request handler tomorrow) so strategies stay pure and easy to unit test.
 */
export interface BusinessResolutionContext {
  /** e.g. window.location.hostname, or a request's Host header */
  hostname?: string;
  /** dev/staging convenience override, e.g. ?business=swami-hair-salon */
  queryParamSlug?: string;
  /** deployment-level fallback, e.g. VITE_DEFAULT_BUSINESS_SLUG */
  envDefaultSlug?: string;
}

export interface BusinessResolverStrategy {
  readonly name: string;
  resolveSlug(context: BusinessResolutionContext, businesses: Business[]): string | undefined;
}
