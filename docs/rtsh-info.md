# Digital Business Card (`apps/rtsh-info`)

A platform-owned product, not a per-tenant business site: one shared app
serving a mobile-first personal profile page at `<domain>/<identifier>`,
opened by scanning a QR code printed on someone's physical business
card. `rtsh-info` is a placeholder app/package name — the product name
shown in the app itself is **"Card Viewer"**. See
[TASKS.md](../TASKS.md) Milestone 4 (the original MVP) and Milestone 9
(the current 6-template system + showcase page, this doc's "Templates"
and "Showcase page" sections below).

## Routing

Path-based, not hostname-based (unlike `apps/website`'s
`BusinessResolver`) — one domain serves every card via `/:identifier`.

- **MVP**: the identifier is a phone number, in whatever format the QR
  code happens to encode (`+919322527567`, `919322527567`,
  `9322527567`, ...). `findCardByIdentifier` (`src/data/cardRegistry.ts`)
  matches on the **last 10 digits** rather than an exact string, so
  format inconsistency at QR-generation time doesn't 404 people.
- **Future** (past ~100 cards): identifiers move to an opaque `uid`.
  `findCardByIdentifier` already handles this — an identifier that
  isn't 10 phone-shaped digits is matched against `Card.id` directly
  instead. Every `Card` record already carries a permanent `id`, so this
  is a routing/QR-regeneration change only, not a data migration.
- A bad identifier still matches the `/:identifier` route — `CardPage`
  renders a "Card not found" state inline rather than redirecting.
  `/` has its own route (`HomePage`, the template showcase — see
  "Showcase page" below); `NotFoundPage` only handles paths that match
  neither (e.g. `/some/nested/path`).

## Data

Frontend-only for now, same static-JSON-registry pattern
`packages/services`' `JsonDataSource` uses for businesses, just kept
local to this app (`src/data/cardRegistry.ts`) since a `Card` isn't
part of the business-content domain — see `static-data/package.json`'s
updated description for that distinction.

- Type: `Card` / `CardLink` (`packages/types/src/card.ts`)
- Files: `static-data/cards/index.json` (list of ids) +
  `static-data/cards/<id>.json` (one per person)
- Registry: `CARDS_BY_ID` in `cardRegistry.ts` — statically imports
  every card JSON file and registers it, same as `JsonDataSource`'s
  `BUSINESSES_BY_SLUG`. **This registry is the seam a future
  backend/table replaces** — adding a card today means one JSON file +
  one registry line; a real backend swap later means pointing
  `findCardByIdentifier` at an HTTP call instead, with no change to any
  component.

### Adding a new card

1. Add `static-data/cards/<id>.json` (see `ritesh-dhekane.json` for the
   shape).
2. Add `<id>` to `static-data/cards/index.json`'s `ids` array.
3. Add one line to `CARDS_BY_ID` in `cardRegistry.ts`, with a matching
   static import.

### Adding a new link type

`CardLink.type` is an open string on purpose — a new platform (Telegram,
X, ...) needs no schema change:

1. Add an entry to `ICONS` in `src/linkPresentation.ts` (pick any
   `@mui/icons-material` icon).
2. Optionally add a display-label override to `LABELS` (falls back to
   the raw `type` string otherwise).
3. If the link needs special `href` handling (not "treat `value` as a
   URL"), add a case to `hrefForLink`'s `switch` — see `call`/
   `whatsapp`/`email`/`maps` for examples. `whatsapp` reuses
   `@rdplatforms/utils`' `toWhatsAppLink`, the same helper
   `apps/website`'s Appointment section uses. `maps` treats `value` as a
   free-text address/place name and builds a Google Maps search URL
   from it, not a raw URL passthrough — see `Card.location` on the
   seeded `ritesh-dhekane.json` for the convention (same text, used as
   a `maps` link's `value`).

An unrecognized `type` still renders correctly — generic link icon, the
raw `type` string as its label, `value` treated as a URL.

## Templates (Milestone 9)

A card's entire look — layout _and_ colors together — comes from one
field, `Card.template`. This replaced an earlier two-axis design
(`Card.style` for colors, `Card.template` for layout, independently
combinable) once six new templates arrived, each carrying its own
deliberate, specific palette from a real design spec — a separate
recolor axis on top of that no longer made sense (see
[adr's reasoning pattern](adr/README.md) for why a decision like this
gets superseded rather than silently changed: the six templates below
are a real replacement of the original 4-template/5-style MVP system,
not an extension of it).

Each template is a self-contained component in `src/templates/` that
hardcodes its own design tokens (`src/templates/designTokens.ts`) —
`DARK_GLASS_TOKENS` for the four dark ones, `WARM_LUXURY_TOKENS` for
the two light ones — rather than reading from a swappable style config.
Both token sets share the same shape (`GlassTokens`), so the shared
building blocks in `src/templates/shared.tsx` (`GlassSection`,
`ActionTile`, `AmbientBackdrop`, `HeroMesh`, `CatalogCard`, `MapEmbed`,
`UpiPaymentQr`, `TestimonialCard`, `BadgeChip`, `LinkRowList`,
`QrShareButton`) work with either — `WARM_LUXURY_TOKENS` sets `blur:
undefined` and a tighter `panelRadius`/`tileRadius`, since that spec
explicitly rejects backdrop blur and heavy shadows in favor of flat
tonal layering, and the shared components render accordingly rather
than forcing one aesthetic onto both.

| template key                  | fits                                                 | tokens               |
| ----------------------------- | ---------------------------------------------------- | -------------------- |
| `executive-minimal` (default) | Consultants, founders, individual professionals      | `DARK_GLASS_TOKENS`  |
| `whatsapp-storefront`         | Shops/service businesses taking orders over WhatsApp | `DARK_GLASS_TOKENS`  |
| `creative-portfolio`          | Designers/creatives leading with their work          | `DARK_GLASS_TOKENS`  |
| `dark-tech-glassmorphism`     | Engineers, founders, Web3/tech-flavored profiles     | `DARK_GLASS_TOKENS`  |
| `artisanal-jewelry-boutique`  | Jewellery, boutique, light-luxury retail             | `WARM_LUXURY_TOKENS` |
| `bistro-dining`               | Restaurants, cafes, dining spots                     | `WARM_LUXURY_TOKENS` |

An unrecognized/missing `Card.template` falls back to
`executive-minimal` (`resolveCardTemplate`), same tolerance an
unrecognized link `type` has.

Adding a 7th template: one new component in `src/templates/`, composing
whichever `shared.tsx` pieces fit (add a new one there first if the
template needs something none of the existing pieces cover — that's
exactly how `CatalogCard`/`MapEmbed`/`UpiPaymentQr`/`TestimonialCard`/
`LinkRowList` were added, each the first time a template actually
needed it, not speculatively ahead of that), plus one entry in
`CARD_TEMPLATES` (`src/templates/index.ts`, including a one-line
`description` — shown on the showcase page below). `CardPage` itself
never changes.

The richer `Card` fields the business-style templates read —
`category`, `whatsapp` (distinct from `phone`), `mapEmbedUrl`, `hours`
(an array of labeled blocks, e.g. separate lunch/dinner rows), `upiId`
(renders as a payment QR — display only, no processing happens on our
side), `catalog`, `testimonials`, `badges`, `bio`, `skills` — are all
optional (`packages/types/src/card.ts`). A personal card that sets none
of them (Ritesh Dhekane's) renders exactly as a card with just
name/title/links always has.

### Dev-only template preview switcher

`CardPage` renders a floating `DevPreviewSwitcher` (bottom-right corner)
only when `import.meta.env.DEV` is true — i.e. `pnpm dev:rtsh-info`,
never a production build (verified: the string `"DEV PREVIEW"` doesn't
appear anywhere in a `vite build` output, meaning it's tree-shaken out,
not just hidden). It cycles the live preview through every template
without touching JSON, for quickly reviewing all of them while
building. A real visitor scanning a QR code never sees it.

## Showcase page (Milestone 9)

`/` is `HomePage` — a public page (no login, matching this app's
dev-managed, no-accounts scope) that browses all 6 templates with a
**genuine live preview** of each: the actual template component,
rendered at real size against a generic `SAMPLE_CARD`
(`src/sampleCard.ts` — one value for every optional field, so no
template's sections render empty) and scaled down with a CSS
`transform`, not a static screenshot that would go stale the next time
a template changes.

Each preview has a **"Request this style"** button — the entire
"onboarding" flow for now, since there's no self-serve signup: it opens
WhatsApp (`toWhatsAppLink`) to a fixed number with a pre-filled message
naming the template, and a card gets added by hand from there, same as
every card today. No form, no backend call, nothing persisted.

The mobile-number lookup that used to be the only thing on `/`
(previously handled by falling through to `NotFoundPage`, the 404
catch-all) is still here too, extracted into a shared
`CardLookupForm` component so it isn't duplicated between `HomePage`
and the now-genuinely-404-only `NotFoundPage`.

## Avatar initials/color

`getInitials`/`getAvatarColors` (`@rdplatforms/utils`, not local to this
app — deliberately shared since any future avatar in the platform, e.g.
a staff list in `apps/portal`, can reuse the same "no photo yet" look)
derive a two-letter initials badge and a deterministic background/text
color pair from a person's name alone, so the same name always renders
the same badge with no stored color field needed.

## Looking a card up without a QR code

`CardLookupForm` (shown on both `HomePage`, `/`, and `NotFoundPage`, any
genuinely unmatched path) is a mobile-number input that navigates to
`/<number>`, landing back on the same identifier resolution
`CardPage`/`findCardByIdentifier` already do.

## Local development

```bash
pnpm dev:rtsh-info
# open http://localhost:5176/9322527567 for a real card
# open http://localhost:5176/ for the template showcase
```

Port **5176** — 5173 website, 5174 admin, 5175 portal.

## Deployment

Unlike `apps/website` (deployed once _per business_, see
[deployment.md](deployment.md)), `rtsh-info` is platform-owned — it
needs exactly **one** deployment, ever, shared by every card. That
makes it simpler than the per-business case, not harder.

**Netlify or Vercel (recommended)** — same repo, a second
site/project alongside the existing Swami Hair Salon one, just pointed
at a different app:

1. Netlify → "Add new site" / Vercel → "Add New... Project" → import
   `rdplatforms/platform-frontend` again (a second, independent
   site/project from the same repo — this is exactly what
   [deployment.md](deployment.md) already does per business, just for
   a different app this time).
2. **Explicitly** set that site/project's build settings (Site/Project
   settings → Build & deploy) — don't rely on `netlify.toml`/
   `vercel.json` to fill these in, they deliberately don't set a build
   command/output directory at all now (see
   [deployment.md](deployment.md#netlify), the real bug this caused
   the first time this deployment was attempted: `netlify.toml`/
   `vercel.json` override dashboard settings, not the other way
   around, so a shared `apps/website`-only build command there was
   silently winning over this site's own dashboard config and
   deploying the wrong app):
   - **Build command**: `pnpm install && pnpm build:rtsh-info`
   - **Publish/Output directory**: `apps/rtsh-info/dist`
   - Leave "Root Directory"/"Base directory" at the repo root either
     way — it's a pnpm workspace, the build needs the whole monorepo
     present, same reasoning as every other app here.
3. SPA fallback (`/:identifier` is a client-side route, so a direct
   link or refresh must still resolve to `index.html`) is already
   handled, no action needed:
   - **Netlify**: [`apps/rtsh-info/public/_redirects`](../apps/rtsh-info/public/_redirects)
     (`/* /index.html 200`) ships in the app itself and Vite copies it
     into `dist/` on build, so Netlify picks it up automatically no
     matter which site it's deployed to.
   - **Vercel**: the root `vercel.json`'s rewrite rule
     (`/(.*) → /index.html`) is generic, not `apps/website`-specific,
     so a second Vercel project pointed at this same repo picks it up
     as-is.
4. Add `VITE_GOOGLE_ANALYTICS_ID` as a site/project environment
   variable if this deployment should have its own GA4 property (see
   [analytics.md](analytics.md)) — optional, same as every other app.
5. Deploy, then rename the site/project to something recognizable
   (e.g. `rtsh-info` or a real custom domain later).

**GitHub Pages** is possible too, but the
[multi-business thin-repo pattern](deployment.md#github-pages) built
for `apps/website` doesn't apply here — `rtsh-info` only ever needs
one deployment, so a thin external repo would be pure overhead. A
direct, one-off `.github/workflows/` entry in this repo (build
`apps/rtsh-info`, deploy straight to this repo's own Pages site) is
the right shape instead — not built yet, since Netlify/Vercel cover
the common case with zero extra files.
