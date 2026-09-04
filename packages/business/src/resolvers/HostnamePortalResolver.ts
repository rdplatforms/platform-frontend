import { normalizeHostname } from '@rdplatforms/utils';
import type { BusinessResolverStrategy } from './types';

/**
 * apps/portal's equivalent of hostnameBusinessResolver — matches against
 * Business.portalDomains instead of Business.domains, since a portal
 * subdomain (admin.*, console.*, whatever the business picked) resolves
 * to a different app than the public site, even though both are "one
 * business per hostname" resolution.
 */
export const hostnamePortalResolver: BusinessResolverStrategy = {
  name: 'hostname-portal',
  resolveSlug(context, businesses) {
    if (!context.hostname) {
      return undefined;
    }
    const hostname = normalizeHostname(context.hostname);
    const match = businesses.find((business) =>
      (business.portalDomains ?? []).some((domain) => normalizeHostname(domain) === hostname),
    );
    return match?.slug;
  },
};
