import { describe, expect, it, vi } from 'vitest';
import { postToAppsScript } from '../src/dataSource/AppsScriptClient';

function response(body: unknown, ok = true): Response {
  return { ok, status: ok ? 200 : 500, json: async () => body } as Response;
}

describe('postToAppsScript', () => {
  it('sends the body as JSON text under a text/plain Content-Type, to avoid a CORS preflight', async () => {
    const fetchImpl = vi.fn().mockResolvedValue(response({ ok: true }));
    await postToAppsScript('https://script.google.com/exec', { type: 'booking', foo: 'bar' }, fetchImpl);

    expect(fetchImpl).toHaveBeenCalledWith(
      'https://script.google.com/exec',
      expect.objectContaining({
        method: 'POST',
        redirect: 'follow',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({ type: 'booking', foo: 'bar' }),
      }),
    );
  });

  it('resolves when the script reports {ok: true}', async () => {
    const fetchImpl = vi.fn().mockResolvedValue(response({ ok: true }));
    await expect(postToAppsScript('url', {}, fetchImpl)).resolves.toBeUndefined();
  });

  it('throws when the script reports {ok: false, error}', async () => {
    const fetchImpl = vi.fn().mockResolvedValue(response({ ok: false, error: 'Sheet not found' }));
    await expect(postToAppsScript('url', {}, fetchImpl)).rejects.toThrow('Sheet not found');
  });

  it('throws when the HTTP request itself fails (network/wrong URL, never reached doPost)', async () => {
    const fetchImpl = vi.fn().mockResolvedValue(response(null, false));
    await expect(postToAppsScript('url', {}, fetchImpl)).rejects.toThrow();
  });
});
