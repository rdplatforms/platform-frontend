import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { loadGoogleAnalytics } from '../src/googleAnalytics';

/**
 * The test suite runs with environment: 'node' (see vitest.config.ts) —
 * no real DOM. loadGoogleAnalytics is the one function in this package
 * that touches document/window, so it gets its own lightweight manual
 * stub here rather than switching the whole suite to a jsdom
 * environment for one function.
 */
function stubBrowserGlobals() {
  const appended: Array<{ src?: string; async?: boolean }> = [];
  const removed: Array<{ src?: string }> = [];

  vi.stubGlobal('document', {
    createElement: () => ({}) as { src?: string; async?: boolean },
    head: {
      appendChild: (el: { src?: string; async?: boolean }) => {
        appended.push(el);
      },
      removeChild: (el: { src?: string }) => {
        removed.push(el);
      },
    },
  });
  vi.stubGlobal('window', {});

  return { appended, removed };
}

describe('loadGoogleAnalytics', () => {
  beforeEach(() => {
    vi.unstubAllGlobals();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('injects an async gtag.js script tag with the measurement id in the src', () => {
    const { appended } = stubBrowserGlobals();
    loadGoogleAnalytics('G-TEST123');

    expect(appended).toHaveLength(1);
    expect(appended[0].async).toBe(true);
    expect(appended[0].src).toBe('https://www.googletagmanager.com/gtag/js?id=G-TEST123');
  });

  it('pushes js/consent/config calls onto window.dataLayer via gtag, with analytics granted and ads denied by default', () => {
    stubBrowserGlobals();
    loadGoogleAnalytics('G-TEST123');

    const w = (globalThis as unknown as { window: { dataLayer: unknown[][] } }).window;
    expect(w.dataLayer[0]).toEqual(['js', expect.any(Date)]);
    expect(w.dataLayer[1]).toEqual([
      'consent',
      'default',
      { analytics_storage: 'granted', ad_storage: 'denied' },
    ]);
    expect(w.dataLayer[2]).toEqual(['config', 'G-TEST123']);
  });

  it('the returned cleanup function removes the injected script', () => {
    const { appended, removed } = stubBrowserGlobals();
    const cleanup = loadGoogleAnalytics('G-TEST123');

    expect(removed).toHaveLength(0);
    cleanup();
    expect(removed).toEqual(appended);
  });
});
