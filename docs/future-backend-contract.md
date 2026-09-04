# Backend Contract

**Status: the read-only surface below is implemented** (TASKS.md
Milestone 1, TASK-001–005) — `backend/` is a real Spring Boot + Postgres
API, and the frontend can call it today. This document remains the
reference for that seam: what shapes it returns, and where those
responses plug into the frontend. Write endpoints, auth, and roles are
still ahead (see TASKS.md Milestones 2+) — this doc will keep growing as
those land, not get replaced by a new one.

## The seam

Every `*DataSource` interface in
`packages/services/src/dataSource/types.ts` is the contract.
`JsonDataSource` (`packages/services/src/dataSource/JsonDataSource.ts`)
implements all of them by reading `static-data/`; `HttpDataSource`
(`packages/services/src/dataSource/HttpDataSource.ts`) implements the
same interfaces by calling `backend/`'s real endpoints — same method
signatures, same return types (from `@rdplatforms/types`), same
`Promise`-based shape, so nothing above `packages/services` needed to
change.

`packages/services/src/dataSource/activeDataSource.ts` is the actual
switch: every read-only `*Service` singleton constructs against
`activeDataSource`, which resolves to `HttpDataSource` when
`VITE_API_BASE_URL` is set, `JsonDataSource` otherwise. Set that env var
to point the frontend at a running `backend/` (see `backend/README.md`
for how to run it locally, including CORS setup).

On the backend side: every entity (`backend/src/main/java/com/rdplatforms/backend/{business,content}/`)
stores its full record as a JSONB `data` column rather than modeling
every nested field into JPA columns — see `backend/README.md`'s "Data
model" section for why. Controllers
(`BusinessController`, `BusinessContentController`) return that JSON
straight through as a `JsonNode`, guaranteeing field-for-field fidelity
with `packages/types/src/*.ts` by construction.

## REST surface

Base path today: `http://localhost:8081` (see `backend/README.md`) — a
real deployed base path isn't chosen yet (see [deployment.md](deployment.md)).
Response bodies match the corresponding type in `packages/types/src/*.ts`
field-for-field.

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

## Auth

None of these endpoints require auth today — the public website has
none, and neither does the backend. Real auth (Super Admin, Business
Owner, Staff — see TASKS.md Milestone 2) is the very next thing to be
built on top of this, alongside write endpoints for booking/billing
(Milestones 3–4) and `apps/admin`/`apps/portal` (see
[future-admin.md](future-admin.md)).

## What v1 deliberately didn't need

- No write endpoints were required to unblock the read-only frontend
  migration (TASK-005) — read-only parity with `static-data/` was enough
  to cut over `HttpDataSource`. Write endpoints start in TASKS.md
  Milestone 2.
- No auth, since nothing writable exists yet to protect.
