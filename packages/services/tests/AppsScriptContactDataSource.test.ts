import { describe, expect, it, vi } from 'vitest';
import { AppsScriptContactDataSource } from '../src/dataSource/AppsScriptContactDataSource';

function response(body: unknown, ok = true): Response {
  return { ok, status: ok ? 200 : 500, json: async () => body } as Response;
}

describe('AppsScriptContactDataSource', () => {
  it('posts a type: "contact" envelope with the businessId and message fields', async () => {
    const fetchImpl = vi.fn().mockResolvedValue(response({ ok: true }));
    const dataSource = new AppsScriptContactDataSource({ webAppUrl: 'https://script.google.com/exec', fetchImpl });

    await dataSource.createContactMessage('swami-hair-salon', {
      name: 'Jane',
      email: 'jane@example.com',
      message: 'Do you take walk-ins?',
    });

    const [, options] = fetchImpl.mock.calls[0];
    expect(JSON.parse(options.body)).toEqual({
      type: 'contact',
      businessId: 'swami-hair-salon',
      name: 'Jane',
      email: 'jane@example.com',
      message: 'Do you take walk-ins?',
    });
  });

  it('throws (does not silently swallow) when the Apps Script call fails', async () => {
    const fetchImpl = vi.fn().mockResolvedValue(response({ ok: false, error: 'boom' }));
    const dataSource = new AppsScriptContactDataSource({ webAppUrl: 'url', fetchImpl });

    await expect(
      dataSource.createContactMessage('biz', { name: 'Jane', message: 'Hi' }),
    ).rejects.toThrow('boom');
  });
});
