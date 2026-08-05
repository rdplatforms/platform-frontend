import { isValidSlug } from '@rdplatforms/utils';
import type { BusinessResolverStrategy } from './types';

/**
 * Local/staging convenience: lets a developer preview any business without
 * owning its domain, e.g. http://localhost:5173/?business=urban-bistro.
 * Takes priority over hostname resolution so it always wins when present.
 */
export const queryParamBusinessResolver: BusinessResolverStrategy = {
  name: 'query-param',
  resolveSlug(context) {
    if (!context.queryParamSlug || !isValidSlug(context.queryParamSlug)) {
      return undefined;
    }
    return context.queryParamSlug;
  },
};
