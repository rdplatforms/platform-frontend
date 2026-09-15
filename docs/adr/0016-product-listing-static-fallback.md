# 0016: Product listing gets a static-data fallback

## Status

Accepted. Supersedes `HttpProductDataSource`'s original "products are
backend-only, no static-data fallback" design from Milestone 6.

## Context

Milestone 6's e-commerce work (`Product`, `Shop`, cart, checkout) was
built against `printforge-3d`, a demo business with a real
`platform-backend` deployment. `HttpProductDataSource` — the only
`Product`-listing implementation at the time — resolved to an empty
list whenever no backend was configured, with the reasoning that "a
Product needs real CRUD from day one (`apps/portal`), so there was
never a static-data seed path the way there is for services/gallery."

That reasoning conflated two different things: **writes** (create/
update/delete a product) genuinely always need a real backend — there's
no static-data equivalent of "Save" — but **reads** (list a business's
products for the public shop page) never needed CRUD at all; every
other read-only content type (`ServiceItem`, `GalleryItem`,
`Testimonial`, ...) already has exactly this static-data fallback via
`JsonDataSource`/`activeDataSource`. The gap only became a real problem
once a genuine Tier 1 (WhatsApp-only, no backend at all —
[0013](0013-tiered-backend-per-business.md)) business needed a shop:
`jagdamb-creation`'s `commerceEnabled: true` + a `shop` section would
render, but the product grid would always be empty, with checkout
having nothing to check out.

## Decision

Give `Product` listing the same tier-selection seam every other
read-only content type already has:

- New `ProductCatalogDataSource` interface
  (`packages/services/src/dataSource/types.ts`):
  `listProductsByBusiness(businessId): Promise<Product[]>`.
- `JsonDataSource` implements it by reading
  `static-data/products.json` (now exported from
  `@rdplatforms/static-data`, alongside every other collection) — the
  one static-data file that was previously consumed _only_ by
  `platform-backend`'s importer, never by the frontend.
- `HttpDataSource` implements it via
  `GET /businesses/{id}/products`, same as
  `HttpProductDataSource` did.
- `activeDataSource`'s `ReadOnlyDataSource` intersection gains
  `ProductCatalogDataSource` — the same `VITE_API_BASE_URL` check every
  other read now goes through.
- `ProductService`/`HttpProductDataSource` (the old, standalone
  constructor-injected pair) are retired; `ProductService` now just
  delegates to `activeDataSource`, same shape as `BusinessService`/
  `PageService`/etc.
- `Product` gains an optional `sku?: string` — a business's own internal
  stock-keeping code, never shown to customers, added at the same time
  since a real Tier 1 business asked for one.

Write access (`apps/portal`'s Products page) is unaffected — it always
talked to the backend directly and still does; a Tier 1 business simply
has no `apps/portal` write path at all, the same way it has no bookings
staff-management path.

## Consequences

- A Tier 1 e-commerce business now gets a fully working shop: products
  listed from `static-data/products.json`, checkout via the
  [0015](0015-whatsapp-checkout-fallback.md) WhatsApp fallback, no
  backend anywhere in the loop.
- `static-data/products.json` entries are hand-authored without
  `businessId`/`createdAt` (meaningless to write by hand for a static
  seed) — `JsonDataSource.listProductsByBusiness` fills both in,
  mirroring what a real backend would stamp automatically.
- `sku` is not yet mirrored to `platform-backend`'s `Product` entity —
  a Tier 3 business's products just come back with `sku: undefined`
  until that catches up. A reasonable, not-yet-done follow-up.
