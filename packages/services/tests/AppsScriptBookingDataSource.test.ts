import { describe, expect, it, vi } from 'vitest';
import { AppsScriptBookingDataSource } from '../src/dataSource/AppsScriptBookingDataSource';

function response(body: unknown, ok = true): Response {
  return { ok, status: ok ? 200 : 500, json: async () => body } as Response;
}

describe('AppsScriptBookingDataSource', () => {
  it('posts a type: "booking" envelope with the businessId and booking fields', async () => {
    const fetchImpl = vi.fn().mockResolvedValue(response({ ok: true }));
    const dataSource = new AppsScriptBookingDataSource({ webAppUrl: 'https://script.google.com/exec', fetchImpl });

    await dataSource.createBooking('swami-hair-salon', {
      serviceId: 'svc-1',
      customerName: 'Jane',
      preferredDate: '2026-10-01',
      preferredTime: '11:00',
    });

    const [, options] = fetchImpl.mock.calls[0];
    expect(JSON.parse(options.body)).toEqual({
      type: 'booking',
      businessId: 'swami-hair-salon',
      serviceId: 'svc-1',
      customerName: 'Jane',
      preferredDate: '2026-10-01',
      preferredTime: '11:00',
    });
  });

  it('synthesizes a client-side Booking (id, status: PENDING, source: ONLINE) since Apps Script has no real entity to return', async () => {
    const fetchImpl = vi.fn().mockResolvedValue(response({ ok: true }));
    const dataSource = new AppsScriptBookingDataSource({ webAppUrl: 'url', fetchImpl });

    const result = await dataSource.createBooking('biz', {
      serviceId: 'svc-1',
      customerName: 'Jane',
      preferredDate: '2026-10-01',
      preferredTime: '11:00',
    });

    expect(result.status).toBe('PENDING');
    expect(result.source).toBe('ONLINE');
    expect(result.businessId).toBe('biz');
    expect(result.id).toBeTruthy();
  });

  it('throws (does not silently swallow) when the Apps Script call fails', async () => {
    const fetchImpl = vi.fn().mockResolvedValue(response({ ok: false, error: 'boom' }));
    const dataSource = new AppsScriptBookingDataSource({ webAppUrl: 'url', fetchImpl });

    await expect(
      dataSource.createBooking('biz', {
        serviceId: 'svc-1',
        customerName: 'Jane',
        preferredDate: '2026-10-01',
        preferredTime: '11:00',
      }),
    ).rejects.toThrow('boom');
  });
});
