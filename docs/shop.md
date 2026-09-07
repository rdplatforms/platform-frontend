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
via `useProducts` (`@rdplatforms/hooks`) — backend-only, no
`static-data` fallback the way `Services`/`Gallery`/etc. have, since a
`Product` needs real CRUD from day one (see "Products" below). No
backend configured means an empty grid, not an error — same tolerance
`BookingService` has.

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

**Deliberately not best-effort** — unlike `BookingService`, which
silently swallows a failed save because the WhatsApp handoff is still a
real fallback channel, there is no equivalent fallback for an order.
`CheckoutService`/`useCheckout` surface a real, visible error
(`CartPage` shows it in an `Alert`) rather than pretending an order
succeeded when it didn't.

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

Read (`apps/website`'s shop) is public. Write (`apps/portal`'s
`/products`, TASK-023) is Owner-only — same gating as Staff management,
not the "any member" gating Bookings/Billing have, since product/
pricing changes are business configuration, not day-to-day operational
work. `apps/portal/src/api/productsApi.ts` follows the same
direct-fetch pattern as `staffApi.ts`/`bookingsApi.ts`/`salesApi.ts`.

## Demo business: `printforge-3d`

A 3D printing shop — `commerceEnabled: true` **and** `bookingEnabled:
true` (a free "3D Design Consultation" service, booked the normal way
through the `Appointment` section), demonstrating a business doesn't
have to pick one or the other. Seeded via `static-data/products.json` +
`platform-backend`'s `StaticDataImportRunner.importProducts` — the one
static-data collection that isn't the generic JSONB passthrough path,
since `Product` needs its fields parsed into real typed columns.

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
