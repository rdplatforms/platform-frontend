import { beforeEach, describe, expect, it, vi } from 'vitest';
import { HttpDataSource } from '../src/dataSource/HttpDataSource';

function jsonResponse(body: unknown, ok = true): Response {
  return {
    ok,
    json: async () => body,
  } as Response;
}

describe('HttpDataSource', () => {
  let fetchImpl: ReturnType<typeof vi.fn>;
  let dataSource: HttpDataSource;

  beforeEach(() => {
    fetchImpl = vi.fn();
    dataSource = new HttpDataSource({ baseUrl: 'http://localhost:8081', fetchImpl });
  });

  it('lists businesses from GET /businesses', async () => {
    fetchImpl.mockResolvedValue(jsonResponse([{ id: 'swami-hair-salon' }]));
    const businesses = await dataSource.listBusinesses();
    expect(fetchImpl).toHaveBeenCalledWith('http://localhost:8081/businesses');
    expect(businesses).toEqual([{ id: 'swami-hair-salon' }]);
  });

  it('resolves a business by slug, URL-encoding the slug', async () => {
    fetchImpl.mockResolvedValue(jsonResponse({ id: 'a/b' }));
    const business = await dataSource.getBusinessBySlug('a/b');
    expect(fetchImpl).toHaveBeenCalledWith('http://localhost:8081/businesses/by-slug/a%2Fb');
    expect(business).toEqual({ id: 'a/b' });
  });

  it('returns undefined for a 404 single-record lookup, not a thrown error', async () => {
    fetchImpl.mockResolvedValue(jsonResponse(null, false));
    const theme = await dataSource.getThemeByBusiness('does-not-exist');
    expect(theme).toBeUndefined();
  });

  it('returns an empty array for a failed list request', async () => {
    fetchImpl.mockResolvedValue(jsonResponse(null, false));
    const services = await dataSource.listServicesByBusiness('does-not-exist');
    expect(services).toEqual([]);
  });

  it('builds the page-by-path query string correctly', async () => {
    fetchImpl.mockResolvedValue(jsonResponse({ path: '/' }));
    await dataSource.getPageByBusinessAndPath('swami-hair-salon', '/');
    expect(fetchImpl).toHaveBeenCalledWith(
      'http://localhost:8081/businesses/swami-hair-salon/pages/by-path?path=%2F',
    );
  });
});
