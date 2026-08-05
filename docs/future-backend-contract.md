# Future Backend Contract

This document is the handoff spec for whoever builds the Spring Boot
backend: what shapes it needs to return, and exactly where those responses
plug into the existing frontend. Nothing on the frontend should need to
change beyond `packages/services/src/dataSource` when this is implemented.

## The seam

Every `*DataSource` interface in
`packages/services/src/dataSource/types.ts` is the contract. Today,
`JsonDataSource` implements all of them by reading `static-data/`. The
backend's job is to make an `HttpDataSource` that implements the same
interfaces by calling real endpoints — same method signatures, same return
types (from `@rdplatforms/types`), same `Promise`-based shape.

```ts
// packages/services/src/dataSource/HttpDataSource.ts (future)
export class HttpDataSource implements
  BusinessDataSource, ServiceCatalogDataSource, GalleryDataSource, /* ... */
{
  async getBusinessBySlug(slug: string) {
    const res = await fetch(`${API_BASE}/businesses/by-slug/${slug}`);
    if (!res.ok) return undefined;
    return res.json() as Promise<Business>;
  }
  // ...
}
```

Then each `*Service`'s exported singleton (e.g. `businessService` in
`packages/services/src/BusinessService.ts`) swaps its constructor argument
from `jsonDataSource` to a shared `httpDataSource` instance. That's the
entire migration — no changes to `packages/hooks`, `packages/ui`,
`packages/business`, or either app.

## Suggested REST surface

Base path: `api.rdplatforms.com` (see [deployment.md](deployment.md)).
Response bodies should match the corresponding type in
`packages/types/src/*.ts` field-for-field.

| Method | Path                                            | Maps to                                            | Returns                   |
| ------ | ----------------------------------------------- | -------------------------------------------------- | ------------------------- |
| `GET`  | `/businesses`                                   | `BusinessDataSource.listBusinesses`                | `Business[]`              |
| `GET`  | `/businesses/by-slug/{slug}`                    | `BusinessDataSource.getBusinessBySlug`             | `Business \| 404`         |
| `GET`  | `/businesses/{businessId}/services`             | `ServiceCatalogDataSource.listServicesByBusiness`  | `ServiceItem[]`           |
| `GET`  | `/businesses/{businessId}/gallery`              | `GalleryDataSource.listGalleryByBusiness`          | `GalleryItem[]`           |
| `GET`  | `/businesses/{businessId}/testimonials`         | `TestimonialDataSource.listTestimonialsByBusiness` | `Testimonial[]`           |
| `GET`  | `/businesses/{businessId}/theme`                | `ThemeDataSource.getThemeByBusiness`               | `BusinessTheme \| 404`    |
| `GET`  | `/businesses/{businessId}/seo`                  | `SeoDataSource.getSeoByBusiness`                   | `SeoConfig \| 404`        |
| `GET`  | `/businesses/{businessId}/pages`                | `PageDataSource.listPagesByBusiness`               | `PageConfig[]`            |
| `GET`  | `/businesses/{businessId}/pages/by-path?path=/` | `PageDataSource.getPageByBusinessAndPath`          | `PageConfig \| 404`       |
| `GET`  | `/businesses/{businessId}/faqs`                 | `FaqDataSource.listFaqsByBusiness`                 | `FaqItem[]`               |
| `GET`  | `/businesses/{businessId}/team`                 | `TeamDataSource.listTeamByBusiness`                | `TeamMember[]`            |
| `GET`  | `/businesses/{businessId}/settings`             | `SettingsDataSource.getSettingsByBusiness`         | `BusinessSettings \| 404` |

`getEnabledSections`/`getFeaturedByBusiness`-style filtering (currently done
client-side in `PageService`/`ServiceCatalogService`) can stay client-side
against the full list, or move server-side as a query param
(`?enabled=true`) if payload size ever justifies it — not a frontend
concern either way, since it's already isolated in the `*Service` layer,
not in components.

## Business resolution by hostname

`hostnameBusinessResolver` currently scans every loaded `Business.domains[]`
client-side. Once `listBusinesses()` is backed by a real directory of
hundreds of tenants, that's the first thing to move server-side: add

```
GET /businesses/by-domain/{hostname}
```

and give `BusinessResolver` an optional fast path that calls it directly
instead of loading every business to search client-side. This is additive —
`hostnameBusinessResolver` can stay as a fallback/dev path.

## Auth (admin only)

The public website has no auth. Once `apps/admin` gets real functionality
(Phase 3), it will need session/token auth against the backend — out of
scope for this contract until that phase starts; see
[future-admin.md](future-admin.md).

## Non-goals for v1 of the backend

- No write endpoints are required to unblock the frontend migration itself
  — read-only parity with `static-data/` is enough to cut over
  `HttpDataSource`.
- Write endpoints (for the admin) can land in the same phase as admin
  functionality, not before.
