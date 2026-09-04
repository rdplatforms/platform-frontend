# Architecture

This document explains how the platform is put together and why. For a
narrower, more implementation-level walkthrough of a single request, see
[docs/frontend-architecture.md](docs/frontend-architecture.md).

## The core idea

A website for a given business is a function of **data**, not code:

```
render(Business, BusinessTheme, PageConfig, content) → website
```

Every package in this repo exists to keep that function pure: nothing in
`packages/ui` knows what a "salon" or a "restaurant" is, and nothing in
`apps/website` hardcodes a business's colors, copy, or section order.

## Layers

### 1. `packages/types`

The shared contracts (`Business`, `BusinessTheme`, `ServiceItem`,
`SectionConfig`, etc.) that every other package and app compiles against.
Changing a shape here is a deliberate, repo-wide decision — it's the seam
the future Spring Boot API's DTOs will need to match.

### 2. `static-data/` — the original, still-default data source

Three demo businesses and their content (services, gallery, testimonials,
theme, SEO, page/section config, FAQs, team, settings), as flat JSON files.
This is explicitly **not** part of the application's public API — nothing
outside `packages/services` is allowed to import from it directly.

### 3. `packages/services` — the abstraction boundary

Every content type has a `*DataSource` interface (`BusinessDataSource`,
`ServiceCatalogDataSource`, ...) and a thin `*Service` class that depends
on one. Components and hooks only ever call a `*Service` — they never
know which data source backs it.

Two implementations exist: `JsonDataSource` (reads `static-data/`) and
`HttpDataSource` (calls the real backend under `backend/` — see
[docs/future-backend-contract.md](docs/future-backend-contract.md)).
`dataSource/activeDataSource.ts` is the single point of choice: every
read-only `*Service` singleton constructs against `activeDataSource`,
which picks `HttpDataSource` when `VITE_API_BASE_URL` is set and
`JsonDataSource` otherwise — no other code above this layer changes
either way. The backend today only serves this same read-only content
(TASKS.md Milestone 1); write endpoints, auth, and roles land in later
milestones.

### 4. `packages/business` — the Business Resolver

Given a request context (hostname, an optional `?business=` override, an
env fallback), `BusinessResolver` decides which `Business` is being
rendered:

```
Website
  │
  ▼
BusinessResolver          — picks a slug via ordered strategies
  │
  ▼
BusinessService.getBySlug — the only thing that knows where Business data lives
  │
  ▼
activeDataSource → JsonDataSource or HttpDataSource
```

Resolution strategies are pure functions
(`packages/business/src/resolvers/*`) so they're unit-testable without
mocking anything — see `packages/business/tests/`.

### 5. `packages/contexts` + `packages/providers`

`contexts` holds plain `React.createContext` definitions and their
`useXContext` accessors — no logic. `providers` holds the components that
compute values and supply them: `BusinessProvider` (runs the resolver),
`AppThemeProvider` (runs the theme engine), `QueryProvider` (TanStack Query
client), composed together as `AppProviders`.

### 6. `packages/providers/src/theme` — the theme engine

`createAppTheme(businessTheme)` turns a business's declarative
`BusinessTheme` (primary/secondary color, typography pairing, border
radius, button style, background style, dark mode) into a real MUI `Theme`.
No business ever ships CSS or a themed component override — the website
looks different per business purely because this function runs with
different input. See [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md).

### 7. `packages/hooks`

TanStack Query hooks (`useServices`, `useGallery`, `useTestimonials`,
`useFaqs`, `useTeam`, `useSeo`, `usePageSections`) built on top of the
services layer, plus `useBusiness()` for the resolved business. All share
one generic (`useBusinessScopedQuery`) so adding a new content type's hook
is a five-line file.

### 8. `packages/ui`

Business-agnostic, reusable components:

- **primitives** — `Button`, `Card`, `Badge`, `Container`, `PageSection`, `SectionTitle`
- **layout** — `Navbar`, `Footer`
- **sections** — `Hero`, `About`, `Services`, `Gallery`, `Testimonials`, `Faq`, `Cta`, `Contact`, `MapSection`, `Pricing`, `Team`
- **`SectionRenderer`** — maps a `SectionConfig[]` (already filtered to enabled, sorted by order) to the matching section components

No component in this package imports a business by name or reads
`static-data` directly. Every section takes `{ business, config }` and
fetches its own content through `packages/hooks`.

### 9. `apps/website`

Wires the layers together: `AppProviders` → `BusinessGate` (loading/error
UI while resolution happens) → a router with a single lazy-loaded
`HomePage`, which reads the resolved business's enabled sections
(`usePageSections`) and renders them via `SectionRenderer`.

### 10. `apps/admin`

A scaffold: routing and placeholder pages for Dashboard, Pages, Media,
Services, Business, Theme, Users, and Settings. It intentionally does not
share the per-business theme engine — an admin operates across every
business at once and uses its own fixed platform theme. See
[docs/future-admin.md](docs/future-admin.md).

## Why this shape scales

The test for every architectural decision in this repo is: **"will this
still make sense with 500 businesses?"**

- Adding business #500 is a JSON record (soon: a database row), never a
  code change.
- Enabling/disabling a section for one business is a `SectionConfig.enabled`
  flip, never a new page component.
- A new content type (e.g. "packages" for a photography business) is a new
  type, one `*DataSource` interface, one `*Service`, one hook, one section
  component — additive, not a rewrite.
- Swapping JSON for a real backend is isolated to `packages/services`.

## Deployment shape (future)

One frontend, one backend, many businesses — see
[docs/deployment.md](docs/deployment.md) for the full picture
(`admin.rdplatforms.com`, `api.rdplatforms.com`, per-business client
domains).
