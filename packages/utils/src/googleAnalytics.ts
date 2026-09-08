/**
 * Unlike every other function in this package, this one has a real DOM
 * side effect (injects a <script> tag) rather than being a pure
 * transform — kept here anyway since it's the one place already shared
 * by every app (apps/website, portal, admin, rtsh-info), and adding a
 * new package for a single function would be more ceremony than the
 * problem needs. See docs/analytics.md for the full picture: apps/website
 * loads a different, per-business id (BusinessSettings.googleAnalyticsId);
 * apps/portal/admin/rtsh-info each load one fixed id via their own
 * VITE_GOOGLE_ANALYTICS_ID — both paths call this same function.
 *
 * No consent banner gates this (a deliberate v1 scope decision — see
 * docs/analytics.md) but Consent Mode signals are still sent explicitly
 * rather than left to gtag.js's own implicit default, matching Google's
 * documented recommendation to always declare consent state on
 * purpose. ad_storage stays denied — nothing here does Google Ads
 * remarketing, only page/event analytics.
 *
 * Returns a cleanup function (removes the injected script) so a caller
 * can use this from a useEffect and correctly no-op/re-run if the id
 * ever changes (e.g. BusinessResolver resolves a different business).
 */
export function loadGoogleAnalytics(measurementId: string): () => void {
  const w = window as unknown as { dataLayer?: unknown[]; gtag?: (...args: unknown[]) => void };
  w.dataLayer = w.dataLayer || [];
  const gtag = (...args: unknown[]) => {
    w.dataLayer!.push(args);
  };
  w.gtag = gtag;

  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`;
  document.head.appendChild(script);

  gtag('js', new Date());
  gtag('consent', 'default', { analytics_storage: 'granted', ad_storage: 'denied' });
  gtag('config', measurementId);

  return () => {
    document.head.removeChild(script);
  };
}
