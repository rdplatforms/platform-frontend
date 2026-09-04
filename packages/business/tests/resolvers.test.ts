import { describe, expect, it } from 'vitest';
import type { Business } from '@rdplatforms/types';
import { envBusinessResolver } from '../src/resolvers/EnvBusinessResolver';
import { hostnameBusinessResolver } from '../src/resolvers/HostnameBusinessResolver';
import { hostnamePortalResolver } from '../src/resolvers/HostnamePortalResolver';
import { queryParamBusinessResolver } from '../src/resolvers/QueryParamBusinessResolver';

function makeBusiness(overrides: Partial<Business>): Business {
  return {
    id: 'test-business',
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

describe('hostnameBusinessResolver', () => {
  const businesses = [
    makeBusiness({
      slug: 'royal-salon',
      domains: ['royal-salon.rdplatforms.dev', 'www.royalsalon.com'],
    }),
  ];

  it('matches an exact registered domain', () => {
    expect(
      hostnameBusinessResolver.resolveSlug({ hostname: 'royal-salon.rdplatforms.dev' }, businesses),
    ).toBe('royal-salon');
  });

  it('normalizes a www. prefix before matching', () => {
    expect(hostnameBusinessResolver.resolveSlug({ hostname: 'royalsalon.com' }, businesses)).toBe(
      'royal-salon',
    );
  });

  it('returns undefined when no hostname is provided', () => {
    expect(hostnameBusinessResolver.resolveSlug({}, businesses)).toBeUndefined();
  });

  it('returns undefined for an unregistered hostname', () => {
    expect(
      hostnameBusinessResolver.resolveSlug({ hostname: 'unknown.example.com' }, businesses),
    ).toBeUndefined();
  });
});

describe('hostnamePortalResolver', () => {
  const businesses = [
    makeBusiness({
      slug: 'royal-salon',
      domains: ['royal-salon.rdplatforms.dev'],
      portalDomains: ['admin.royalsalon.com'],
    }),
  ];

  it('matches a registered portal domain', () => {
    expect(
      hostnamePortalResolver.resolveSlug({ hostname: 'admin.royalsalon.com' }, businesses),
    ).toBe('royal-salon');
  });

  it('does not match the same business public domain', () => {
    expect(
      hostnamePortalResolver.resolveSlug({ hostname: 'royal-salon.rdplatforms.dev' }, businesses),
    ).toBeUndefined();
  });

  it('returns undefined for a business with no portalDomains configured', () => {
    const noPortal = [makeBusiness({ slug: 'no-portal-biz' })];
    expect(
      hostnamePortalResolver.resolveSlug({ hostname: 'anything.example.com' }, noPortal),
    ).toBeUndefined();
  });

  it('returns undefined when no hostname is provided', () => {
    expect(hostnamePortalResolver.resolveSlug({}, businesses)).toBeUndefined();
  });
});

describe('queryParamBusinessResolver', () => {
  it('accepts a well-formed slug', () => {
    expect(queryParamBusinessResolver.resolveSlug({ queryParamSlug: 'urban-bistro' }, [])).toBe(
      'urban-bistro',
    );
  });

  it('rejects a malformed slug', () => {
    expect(
      queryParamBusinessResolver.resolveSlug({ queryParamSlug: 'Urban Bistro!' }, []),
    ).toBeUndefined();
  });

  it('returns undefined when absent', () => {
    expect(queryParamBusinessResolver.resolveSlug({}, [])).toBeUndefined();
  });
});

describe('envBusinessResolver', () => {
  it('passes through the configured default', () => {
    expect(envBusinessResolver.resolveSlug({ envDefaultSlug: 'vision3d' }, [])).toBe('vision3d');
  });

  it('returns undefined when nothing is configured', () => {
    expect(envBusinessResolver.resolveSlug({}, [])).toBeUndefined();
  });
});
