# Frontend Architecture: One Request, Start to Finish

This walks through exactly what happens when a browser loads the website,
referencing real files. For the higher-level "why", see
[../ARCHITECTURE.md](../ARCHITECTURE.md).

## 1. Boot

`apps/website/src/main.tsx` mounts `<App />`
(`apps/website/src/App.tsx`), which renders:

```tsx
<AppProviders>
  <BusinessGate>
    <DocumentHead />
    <RouterProvider router={router} />
  </BusinessGate>
</AppProviders>
```

`AppProviders` (`packages/providers/src/AppProviders.tsx`) composes, in
order: `QueryProvider` → `BusinessProvider` → `AppThemeProvider`. Order
matters — `AppThemeProvider` reads the business `BusinessProvider` resolves.

## 2. Business resolution

`BusinessProvider` (`packages/providers/src/BusinessProvider.tsx`) runs
once on mount:

1. Reads `window.location.hostname`, a `?business=` query param, and
   `import.meta.env.VITE_DEFAULT_BUSINESS_SLUG` into a
   `BusinessResolutionContext`.
2. Calls `businessResolver.resolve(context)`
   (`packages/business/src/BusinessResolver.ts`), which:
   - Loads every business via `businessService.getAll()`.
   - Tries each strategy in priority order — `queryParamBusinessResolver` →
     `hostnameBusinessResolver` → `envBusinessResolver` — until one returns
     a slug matching an **active** business.
3. Publishes `{ business, isLoading, error }` via `BusinessContext`
   (`packages/contexts/src/BusinessContext.tsx`).

`BusinessGate` (`apps/website/src/components/BusinessGate.tsx`) reads that
context: renders a spinner while `isLoading`, an explanatory error state if
resolution failed, and otherwise renders its children.

## 3. Theme derivation

Once a `business` is available, `AppThemeProvider`
(`packages/providers/src/AppThemeProvider.tsx`) calls
`themeService.getByBusiness(business.id)` and feeds the result into
`createAppTheme()` (`packages/providers/src/theme/createAppTheme.ts`),
wrapping children in MUI's `ThemeProvider` + `CssBaseline`. See
[../DESIGN_SYSTEM.md](../DESIGN_SYSTEM.md) for what that function does.

## 4. Routing and page rendering

`RouterProvider` uses `apps/website/src/routes/router.tsx` — a single
lazy-loaded `/` route to `HomePage` and a catch-all to `NotFoundPage`.

`HomePage` (`apps/website/src/pages/HomePage.tsx`):

1. Reads the resolved `business` via `useBusiness()`.
2. Calls `usePageSections(business.id, '/')`
   (`packages/hooks/src/usePageSections.ts`), which calls
   `pageService.getEnabledSections()` — already filtered to `enabled:
true` and sorted by `order`.
3. Derives `NavItem[]` for the `Navbar` from the enabled sections.
4. Renders `<Navbar>`, `<SectionRenderer business={business}
sections={sections} />`, `<Footer>`.

`SectionRenderer` (`packages/ui/src/sections/SectionRenderer.tsx`) maps
each `SectionConfig.type` to its component via a fixed lookup table and
renders them in order. Each section component (`Hero`, `Services`, ...)
independently fetches whatever content it needs through a hook —
`SectionRenderer` itself passes nothing but `business` and that section's
own `config`.

## 5. Content fetching inside a section

Take `Services` (`packages/ui/src/sections/Services.tsx`) as the
representative example:

```tsx
const { data: services, isLoading } = useServices(business.id);
```

`useServices` (`packages/hooks/src/useServices.ts`) wraps
`useBusinessScopedQuery('services', (id) =>
serviceCatalogService.getByBusiness(id), businessId)` — a TanStack Query
hook keyed by `['services', businessId]`, disabled until `businessId` is
known. `serviceCatalogService.getByBusiness()`
(`packages/services/src/ServiceCatalogService.ts`) calls into
`JsonDataSource.listServicesByBusiness()`
(`packages/services/src/dataSource/JsonDataSource.ts`), which reads the
statically-imported `static-data/services.json`.

Every other content-driven section (`Gallery`, `Testimonials`, `Faq`,
`Team`) follows the identical shape.

## 6. SEO

`DocumentHead` (`apps/website/src/seo/DocumentHead.tsx`) runs alongside the
router, calling `useSeo(business.id)` and imperatively syncing
`document.title` and `<meta>` tags when the SEO config loads. No
`react-helmet` dependency — this is a single-page-per-business site today.

## Performance notes

- Routes are `React.lazy` + `Suspense` (`router.tsx`) so `HomePage` and
  `NotFoundPage` code-split out of the main bundle.
- `apps/website/vite.config.ts` manually chunks `react`/`react-dom`/
  `react-router-dom`, `@mui/material` + emotion, and
  `@tanstack/react-query` into separate vendor chunks so a change to app
  code doesn't invalidate the (much larger, much more stable) vendor cache.
- `react-hook-form` + `zod` (used only by `Contact`) end up in their own
  chunk automatically because nothing else imports them.

## What changes when the backend arrives

Nothing above step 5's last sentence. `JsonDataSource` is replaced by an
`HttpDataSource` implementing the same `*DataSource` interfaces (see
[future-backend-contract.md](future-backend-contract.md)) — every hook,
section, and page keeps working unmodified.
