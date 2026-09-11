# Instagram — why there's no feed embed

Asked when connecting `jagdamb-creation` to a real Instagram profile: can
we show a business's Instagram posts on their site? Researched, not
assumed — here's what's actually available in 2026, and why the answer
here is "not automatically."

## The options

- **A. Self-hosted photos + a plain profile link (what's built).**
  `Business.social.instagram` → a "Follow us on Instagram" link in
  `Footer.tsx` (already existed, just needed a real URL). Photos the
  business sends over WhatsApp get added to `gallery.json` and hosted
  under `apps/website/public/assets/businesses/<slug>/gallery/`, same as
  every other business. Zero ongoing dependency, zero cost, nothing that
  can break or go stale.
- **B. Official per-post embed widget** — the `<blockquote
class="instagram-media">` + `embed.js` snippet Instagram's own
  "Embed" button on a post gives you. Free, no API key, works on any
  public post today. The real limits: it's a "pick specific post URLs to
  feature" widget, not an auto-updating feed — showing N posts means N
  manually-chosen URLs, revisited whenever the business wants the
  selection refreshed. It's also an external script loaded from
  instagram.com on every page view, and Meta has changed/broken this
  widget without notice before. **Not built yet** — a reasonable
  follow-up if a business wants a curated "recent posts" section rather
  than a plain link. Buildable as one shared component (an
  `InstagramEmbed` reading a `BusinessSettings.instagramPostUrls?:
string[]`), reusable by any business, the same "template once, use
  everywhere" shape as the GA4/Apps Script integrations.
- **C. Auto-pulling a live feed (Graph API) — rejected.** Requires the
  Instagram account converted to Business/Creator, a Meta Developer App,
  and an access token that **expires every 60 days** and needs something
  to refresh it on a schedule — in practice, a real backend running a
  cron job. That reintroduces exactly the backend dependency Tier 1
  businesses ([backend-tiers.md](backend-tiers.md)) are designed to
  avoid, for a feature that's cosmetic. Not worth it for a free-tier
  business.
- **Scraping Instagram's page for embedded JSON** — technically
  possible, explicitly not recommended: fragile (an unofficial surface
  Meta can change any time), and a Terms-of-Service risk not worth
  taking for a demo/small-business site.

## What's actually live

Option A only. `jagdamb-creation`'s `social.instagram` points at the real
profile; its gallery is 58 real photos the business sent, hosted in this
repo — not pulled from Instagram at request time.
