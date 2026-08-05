import { normalizeHostname } from '@rdplatforms/utils';
import type { BusinessResolverStrategy } from './types';

/**
 * Production resolution path: matches the incoming hostname against every
 * business's registered domains. Scales to any number of businesses without
 * code changes — onboarding a business is a data change, not a deploy.
 */
export const hostnameBusinessResolver: BusinessResolverStrategy = {
  name: 'hostname',
  resolveSlug(context, businesses) {
    if (!context.hostname) {
      return undefined;
    }
    const hostname = normalizeHostname(context.hostname);
    const match = businesses.find((business) =>
      business.domains.some((domain) => normalizeHostname(domain) === hostname),
    );
    return match?.slug;
  },
};
