import type { Business } from '@rdplatforms/types';
import { businessService } from '@rdplatforms/services';
import type { BusinessService } from '@rdplatforms/services';
import { envBusinessResolver } from './resolvers/EnvBusinessResolver';
import { hostnameBusinessResolver } from './resolvers/HostnameBusinessResolver';
import { queryParamBusinessResolver } from './resolvers/QueryParamBusinessResolver';
import type { BusinessResolutionContext, BusinessResolverStrategy } from './resolvers/types';

/**
 * Priority order matters: a local dev override should always win, hostname
 * is the real production signal, and the env default only fires when
 * nothing else could resolve a business (e.g. bare localhost).
 */
const DEFAULT_STRATEGIES: BusinessResolverStrategy[] = [
  queryParamBusinessResolver,
  hostnameBusinessResolver,
  envBusinessResolver,
];

/**
 * The single entry point the website uses to figure out "which business am
 * I rendering right now". It never touches JSON or an HTTP client directly —
 * it asks BusinessService, which owns that decision. See
 * docs/frontend-architecture.md for the full request flow.
 */
export class BusinessResolver {
  constructor(
    private readonly service: BusinessService,
    private readonly strategies: BusinessResolverStrategy[] = DEFAULT_STRATEGIES,
  ) {}

  async resolve(context: BusinessResolutionContext): Promise<Business | undefined> {
    const businesses = await this.service.getAll();

    for (const strategy of this.strategies) {
      const slug = strategy.resolveSlug(context, businesses);
      if (!slug) {
        continue;
      }
      const business = businesses.find((candidate) => candidate.slug === slug);
      if (business && business.isActive) {
        return business;
      }
    }

    return undefined;
  }
}

export const businessResolver = new BusinessResolver(businessService);
