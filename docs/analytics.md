# Google Analytics (GA4)

Every app gets its own separate analytics — a business's own GA4
property for `apps/website`, one fixed rdplatforms-owned property each
for `apps/portal`/`apps/admin`/`apps/rtsh-info`. Two different
configuration paths, one shared loader.

## The full flow (per business, `apps/website`)

1. The business creates their **own** GA4 property in their **own**
   Google account (free — GA4's standard tier covers up to 10M
   events/month, far beyond a local business's traffic) → gets a
   Measurement ID, `G-XXXXXXXXXX`.
2. You add that ID to `BusinessSettings.googleAnalyticsId` for that
   business — for now, by hand, in `static-data/settings.json`, same as
   every other `BusinessSettings` field today (currency, timezone,
   `bookingEnabled`, ...). No self-serve UI exists for any of those
   fields either.
3. `apps/website/src/analytics/GoogleAnalytics.tsx` reads it via
   `useSettings` and calls `loadGoogleAnalytics` (`@rdplatforms/utils`)
   — composed in `App.tsx` alongside `DocumentHead`, so it's live on
   every route with no per-page wiring. A business with nothing set
   never loads the script at all.
4. **Ownership stays with the business** — it's their GA account, their
   data, not centralized on rdplatforms' side. If the platform
   relationship ends, their analytics history doesn't go anywhere.

## The platform apps (`apps/portal`/`apps/admin`/`apps/rtsh-info`)

Different use case — internal usage analytics (how Owners/Staff/Super
Admins use the tools), not per-business customer behavior. Each app has
its own fixed `VITE_GOOGLE_ANALYTICS_ID` env var (a different GA4
property per app), read directly in that app's `App.tsx` — no per-business
data involved, since none of these three are per-business deployments.

## Shared loader: `loadGoogleAnalytics` (`packages/utils`)

One function, two callers. Injects the standard `gtag.js` script tag +
`js`/`consent`/`config` calls, returns a cleanup function (removes the
script — used from a `useEffect`, so a changing id, e.g. `apps/website`
resolving a different business, re-runs cleanly). See the function's own
comment for why it lives in `packages/utils` despite being the one
DOM-side-effecting function in an otherwise-pure-function package.

## Consent — a deliberate v1 scope decision

**No consent banner.** Analytics loads unconditionally whenever an id
is configured — chosen deliberately for v1 rather than assumed; see the
chat history for the tradeoff discussion. What *is* still done: Consent
Mode signals are sent explicitly (`gtag('consent', 'default', {
analytics_storage: 'granted', ad_storage: 'denied' })`) rather than left
to gtag.js's own implicit default — Google's own recommended practice
even without a banner. `ad_storage` stays denied since nothing here
does Google Ads remarketing, only page/event analytics.

**This is a real gap for a business with EU/UK visitors** (GDPR/ePrivacy
technically wants consent before analytics loads) — flag it to whichever
business that applies to rather than silently assuming it's fine
everywhere. A real consent banner is a reasonable follow-up if/when that
comes up.

## Costs

GA4 standard is free (up to 10M events/month per property) — no cost
consideration here, unlike the [backend tiers](backend-tiers.md) plan.
