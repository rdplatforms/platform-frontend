import { describe, expect, it } from 'vitest';
import type { Business } from '@rdplatforms/types';
import type { BusinessService } from '@rdplatforms/services';
import { BusinessResolver, businessResolver } from '../src/BusinessResolver';

function makeBusiness(overrides: Partial<Business>): Business {
  return {
    id: overrides.slug ?? 'test-business',
    slug: 'test-business',
    legalName: 'Test Business LLC',
    displayName: 'Test Business',
    category: 'salon',
    logoUrl: '/logo.svg',
    description: 'A test business',
    contact: {
      phone: '5550000000',
      email: 'test@example.com',
      address: {
        line1: '1 Test St',
        city: 'Testville',
        state: 'TS',
        postalCode: '00000',
        country: 'USA',
      },
    },
    hours: [],
    social: {},
    domains: [],
    isActive: true,
    ...overrides,
  };
}

function fakeService(businesses: Business[]): BusinessService {
  return {
    getAll: async () => businesses,
    getBySlug: async (slug: string) => businesses.find((b) => b.slug === slug),
  } as BusinessService;
}

describe('BusinessResolver', () => {
  const businesses = [
    makeBusiness({ slug: 'royal-salon', domains: ['royal-salon.rdplatforms.dev'] }),
    makeBusiness({ slug: 'inactive-biz', domains: ['inactive.example.com'], isActive: false }),
  ];

  it('prefers the query-param override over the hostname', async () => {
    const resolver = new BusinessResolver(fakeService(businesses));
    const result = await resolver.resolve({
      hostname: 'royal-salon.rdplatforms.dev',
      queryParamSlug: 'royal-salon',
    });
    expect(result?.slug).toBe('royal-salon');
  });

  it('falls back to hostname when there is no query-param override', async () => {
    const resolver = new BusinessResolver(fakeService(businesses));
    const result = await resolver.resolve({ hostname: 'royal-salon.rdplatforms.dev' });
    expect(result?.slug).toBe('royal-salon');
  });

  it('falls back to the env default when nothing else resolves', async () => {
    const resolver = new BusinessResolver(fakeService(businesses));
    const result = await resolver.resolve({ envDefaultSlug: 'royal-salon' });
    expect(result?.slug).toBe('royal-salon');
  });

  it('never resolves an inactive business, even by exact hostname match', async () => {
    const resolver = new BusinessResolver(fakeService(businesses));
    const result = await resolver.resolve({ hostname: 'inactive.example.com' });
    expect(result).toBeUndefined();
  });

  it('returns undefined when no strategy produces a match', async () => {
    const resolver = new BusinessResolver(fakeService(businesses));
    const result = await resolver.resolve({ hostname: 'nobody.example.com' });
    expect(result).toBeUndefined();
  });

  it('resolves real demo businesses end to end via the default singleton', async () => {
    const result = await businessResolver.resolve({ queryParamSlug: 'urban-bistro' });
    expect(result?.displayName).toBe('Urban Bistro');
  });
});
