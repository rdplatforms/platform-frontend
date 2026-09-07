import { beforeEach, describe, expect, it, vi } from 'vitest';
import { HttpBookingDataSource } from '../src/dataSource/HttpBookingDataSource';

function jsonResponse(body: unknown, ok = true): Response {
  return {
    ok,
    status: ok ? 201 : 403,
    json: async () => body,
  } as Response;
}

describe('HttpBookingDataSource', () => {
  let fetchImpl: ReturnType<typeof vi.fn>;
  let dataSource: HttpBookingDataSource;

  beforeEach(() => {
    fetchImpl = vi.fn();
    dataSource = new HttpBookingDataSource({ baseUrl: 'http://localhost:8081', fetchImpl });
  });

  it('POSTs to /businesses/{id}/bookings with the booking as the JSON body', async () => {
    const created = {
      id: 'b1',
      businessId: 'swami-hair-salon',
      serviceId: 'svc-1',
      customerName: 'Jane',
      preferredDate: '2026-10-01',
      preferredTime: '11:00',
      status: 'PENDING',
      source: 'ONLINE',
      createdAt: '2026-09-01T00:00:00Z',
    };
    fetchImpl.mockResolvedValue(jsonResponse(created));

    const result = await dataSource.createBooking('swami-hair-salon', {
      serviceId: 'svc-1',
      customerName: 'Jane',
      preferredDate: '2026-10-01',
      preferredTime: '11:00',
    });

    expect(fetchImpl).toHaveBeenCalledWith(
      'http://localhost:8081/businesses/swami-hair-salon/bookings',
      expect.objectContaining({ method: 'POST' }),
    );
    expect(result).toEqual(created);
  });

  it('URL-encodes the businessId', async () => {
    fetchImpl.mockResolvedValue(jsonResponse({}));
    await dataSource.createBooking('a/b', {
      serviceId: 'x',
      customerName: 'x',
      preferredDate: '2026-10-01',
      preferredTime: '11:00',
    });
    expect(fetchImpl).toHaveBeenCalledWith(
      'http://localhost:8081/businesses/a%2Fb/bookings',
      expect.anything(),
    );
  });

  it('throws (does not silently swallow) when the request fails', async () => {
    fetchImpl.mockResolvedValue(jsonResponse(null, false));
    await expect(
      dataSource.createBooking('swami-hair-salon', {
        serviceId: 'x',
        customerName: 'x',
        preferredDate: '2026-10-01',
        preferredTime: '11:00',
      }),
    ).rejects.toThrow();
  });
});
