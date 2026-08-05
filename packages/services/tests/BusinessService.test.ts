import { describe, expect, it } from 'vitest';
import { businessService } from '../src/BusinessService';

describe('BusinessService', () => {
  it('lists all registered demo businesses', async () => {
    const businesses = await businessService.getAll();
    const slugs = businesses.map((business) => business.slug).sort();
    expect(slugs).toEqual(['royal-salon', 'urban-bistro', 'vision3d']);
  });

  it('resolves a business by slug', async () => {
    const business = await businessService.getBySlug('royal-salon');
    expect(business?.displayName).toBe('Royal Salon');
    expect(business?.category).toBe('salon');
  });

  it('returns undefined for an unknown slug', async () => {
    const business = await businessService.getBySlug('does-not-exist');
    expect(business).toBeUndefined();
  });
});
