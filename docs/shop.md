# Shop, Cart & Checkout (`apps/website`, TASKS.md Milestone 6)

The other half of the original booking/billing ask: a business that
sells physical products (the demo: `printforge-3d`, a 3D printing shop)
gets a product grid, a cart, and checkout — the same real `Sale`/
`Product` backend everything else in Milestone 5/6 uses, not a separate
system. See [adr/0012-real-billing-supersedes-localstorage-dashboard.md](adr/0012-real-billing-supersedes-localstorage-dashboard.md)
for why `Sale` exists at all.

## `commerceEnabled` and the `shop` section

`BusinessSettings.commerceEnabled` (TASK-020) declares whether a
business runs a shop — deliberately not gated by `BusinessCategory` (a
salon could sell retail products too), and currently just a declared
capability, same "not yet actively enforced anywhere" status
`bookingEnabled` already has. What actually controls whether the shop
renders is the same mechanism every section uses: a `shop`
`SectionConfig` entry in that business's `PageConfig`
(`static-data/pages.json`), enabled or not.

`Shop` (`packages/ui/src/sections/Shop.tsx`) fetches its product grid
via `useProducts` (`@rdplatforms/hooks`) → `ProductService` →
`activeDataSource` — the same read-tier seam every other content type
uses (see [adr/0016-product-listing-static-fallback.md](adr/0016-product-listing-static-fallback.md)):
a Tier 1 business with no backend at all gets its products from
`static-data/products.json`, a Tier 3 business gets them from
`platform-backend`. This superseded the original "backend-only, no
static-data fallback" design once a real Tier 1 e-commerce business
(`jagdamb-creation`) needed a shop with no backend to talk to — see
"Products" below for what's unchanged (writes stay backend-only).

## Cart

Client-side, `localStorage`, namespaced per business
(`rdplatforms:cart:<businessId>`) — same tradeoff the old dashboard's
sales storage had (per-browser, per-device), acceptable here since a
cart is inherently a single-session, single-device thing anyway (unlike
a business's sales ledger, which is why `Sale` itself is real and
backend-persisted, not the cart).

**Lives in `@rdplatforms/contexts`/`@rdplatforms/providers`, not
`apps/website`** — this surprised me while building it: `Shop.tsx`
lives in `packages/ui` (shared by any app that composes
`SectionRenderer`), so it can't import anything from `apps/website`
directly (packages must not depend on apps). `CartContext`/`CartItem`
(`@rdplatforms/contexts`) and `CartProvider` (`@rdplatforms/providers`)
follow the exact same split `BusinessContext`/`BusinessProvider`
already established.

- `useCart()` — throws outside a `<CartProvider>`. For `apps/website`'s
  own pages (`CartPage.tsx`), which only ever render inside one.
- `useOptionalCart()` — returns `undefined` instead of throwing. For
  `Shop.tsx`, since not every app wrapping `SectionRenderer` has (or
  should have) a cart — `apps/portal`/`apps/admin` never will.

Only `apps/website`'s `App.tsx` actually wraps its tree in
`<CartProvider>` (inside `<BusinessGate>`, since the provider needs a
resolved business to namespace its storage key) — `AppProviders` itself
does not include it by default, same reasoning as it not including
`RequireAuth` for any app.

## Checkout → `Sale`

`/cart` (`apps/website/src/pages/CartPage.tsx`) is the one dedicated
route the shop needs — "add to cart" happens inline in the `Shop`
section, but reviewing/editing the cart and checking out needs its own
page. Submitting calls `useCheckout` (`@rdplatforms/hooks`) →
`checkoutService.createSale` (`@rdplatforms/services`) →
`POST /businesses/{id}/sales`, no auth header — that absence is what
makes the backend record `source: ONLINE` instead of `STAFF` (see
`platform-backend`'s `SaleController`, and `docs/portal.md`'s Billing
section for the STAFF side of the same endpoint).

**Best-effort, same shape as `BookingService`** (superseded the original
"no WhatsApp-style fallback for an order" decision — see
[adr/0015-whatsapp-checkout-fallback.md](adr/0015-whatsapp-checkout-fallback.md)):
`CheckoutService`/`useCheckout` themselves still reject on failure or a
missing backend, but `CartPage` awaits that, swallows any error, and
always fires a WhatsApp handoff afterward regardless — the order's
contents formatted by `buildCartOrderMessage` (`@rdplatforms/utils`),
sent the same way `Appointment`/`Contact` already do. A Tier 1 business
(no backend at all) gets a fully working checkout this way; a Tier 2/3
business gets both a persisted `Sale` _and_ the WhatsApp handoff, since
the WhatsApp confirmation is a platform-wide capability, not conditional
on which tier is configured.

`NewSale.customerEmail`/`customerPhone` only make sense for an online
checkout — how else would the business reach the customer? A
staff-entered bill through `apps/portal`'s billing UI leaves both
undefined.

## Products (TASK-020/023)

`Product` (`packages/types/src/product.ts`) mirrors
`platform-backend`'s `Product` entity field-for-field, including
`featured` (not `isFeatured` — Jackson's bean-property convention
strips the `is` prefix off a `boolean isFeatured` getter, so `featured`
is what's actually on the wire; matching it exactly avoids a silent
runtime mismatch masked by TypeScript).

Read (`apps/website`'s shop) is public, and — for a Tier 1 business —
comes from `static-data/products.json` rather than
`platform-backend`, per the fallback above. Write (`apps/portal`'s
`/products`, TASK-023) is Owner-only, backend-only regardless of tier
(a Tier 1 business simply has no `apps/portal` write path, same as it
has no bookings-management path) — same gating as Staff management,
not the "any member" gating Bookings/Billing have, since product/
pricing changes are business configuration, not day-to-day operational
work. `apps/portal/src/api/productsApi.ts` follows the same
direct-fetch pattern as `staffApi.ts`/`bookingsApi.ts`/`salesApi.ts`.

`Product.sku?: string` (optional) — an internal stock-keeping code for
the business's own reference, never shown to customers, added once a
real Tier 1 business (`jagdamb-creation`) asked for one so its owner
could track inventory without a backend. Not yet mirrored to
`platform-backend`'s `Product` entity — a `printforge-3d`-style Tier 3
business just gets `sku: undefined` until that catches up.

## Demo business: `printforge-3d`

A 3D printing shop — `commerceEnabled: true` **and** `bookingEnabled:
true` (a free "3D Design Consultation" service, booked the normal way
through the `Appointment` section), demonstrating a business doesn't
have to pick one or the other. Seeded via `static-data/products.json` +
`platform-backend`'s `StaticDataImportRunner.importProducts` — the one
static-data collection that isn't the generic JSONB passthrough path,
since `Product` needs its fields parsed into real typed columns.

## Demo business: `jagdamb-creation`

A Tier 1 (WhatsApp-only, no backend at all — [0013](adr/0013-tiered-backend-per-business.md))
e-commerce business — `commerceEnabled: true`, `bookingEnabled: false`
(pure retail, no appointment concept), and bilingual
(`supportedLocales: ["en", "mr"]` — [0008](adr/0008-per-business-bilingual-content.md)).
Demonstrates the [0015](adr/0015-whatsapp-checkout-fallback.md) fallback
end to end: with no `VITE_API_BASE_URL`/`VITE_APPS_SCRIPT_URL`
configured, checkout is _entirely_ the WhatsApp handoff — nothing is
persisted, same as this business's bookings/contact would be if it had
any. `Product.name`/`description` stay English-only even here — see
`packages/types/src/product.ts`'s own comment on why `Product` isn't
bilingual yet, a real (documented, not silent) limitation for a
Marathi-speaking business's product catalog specifically.

Started as a fictional demo (`rupali-imitation-jewellery`), then
connected to the real business it's modeled on — real WhatsApp number,
real Instagram profile, real owner name, real gallery photos (see
[instagram.md](instagram.md) for why there's no live Instagram feed
embed, just a profile link). Its 6 products (`static-data/products.json`)
each carry a `sku` (`JC-NEC-001`, etc.) for the owner's own internal
tracking. Prices are placeholders — nobody in this session has real
pricing from the business, so they're deliberately approximate, pending
the actual owner setting real prices through whatever the eventual
pricing-management path turns out to be. `team` is disabled in
`pages.json` for this business (no team/owner section on the page) —
kept as data, just not shown, the same on/off pattern used for
`printforge-3d`'s or `swami-hair-salon`'s disabled sections.

## Local testing

```bash
# Terminal 1 — backend (imports printforge-3d + its products)
cd ../platform-backend
docker compose up -d
./gradlew bootRun --args='--spring.profiles.active=import-static-data'
./gradlew bootRun --args='--spring.profiles.active=seed-super-admin --app.seed.super-admin-email=you@example.com --app.seed.super-admin-password=...'
./gradlew bootRun

# Terminal 2 — website
VITE_API_BASE_URL=http://localhost:8081 pnpm --filter @rdplatforms/website dev
# open http://localhost:5173/?business=printforge-3d

# Terminal 3 — portal (create an owner first — see docs/portal.md)
VITE_API_BASE_URL=http://localhost:8081 pnpm --filter @rdplatforms/portal dev
# open http://localhost:5175/?business=printforge-3d
```

`jagdamb-creation` needs none of the above — no backend, no importer, no
portal — since it's Tier 1:

```bash
pnpm --filter @rdplatforms/website dev
# open http://localhost:5173/?business=jagdamb-creation
```
