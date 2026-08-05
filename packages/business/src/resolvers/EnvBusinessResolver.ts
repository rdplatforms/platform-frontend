import type { BusinessResolverStrategy } from './types';

/**
 * Last-resort fallback so local development works with zero setup: a
 * single default business slug configured per environment.
 */
export const envBusinessResolver: BusinessResolverStrategy = {
  name: 'env-default',
  resolveSlug(context) {
    return context.envDefaultSlug;
  },
};
