# Progress Log

Running log of implementation progress. Update this after every completed
feature or milestone. Newest entries first.

## 2026-08-05 — Business owner dashboard

Added a basic, per-business owner dashboard at `/dashboard` on
`apps/website` for logging sales and seeing totals — see
[docs/business-dashboard.md](docs/business-dashboard.md) and
[docs/adr/0007-per-business-owner-dashboard.md](docs/adr/0007-per-business-owner-dashboard.md).

- `SaleEntry` type + `dashboardPasscode` on `BusinessSettings`
  (`@rdplatforms/types`)
- Sales utility functions — totals, date bucketing (today/week/month) —
  unit tested (`@rdplatforms/utils`)
- `SalesDataSource` — the platform's first write-capable data source — with
  a `LocalStorageSalesDataSource` implementation (injectable storage, unit
  tested against a fake) and `SalesService` (`@rdplatforms/services`)
- `useSales`, `useCreateSale`, `useDeleteSale`, `useSettings` hooks with
  TanStack Query mutation + cache invalidation (`@rdplatforms/hooks`)
- Dashboard UI (`apps/website/src/dashboard/`): passcode gate, summary
  cards, a React Hook Form + Zod sale-entry form, and a mobile-first sales
  history list with delete — lazy-loaded at `/dashboard`, not linked from
  the public site
- Demo passcodes added for all three demo businesses

**Verification:** 51 tests passing (15 new), both apps build cleanly,
browser-driven check (desktop + mobile viewport) confirmed: passcode
reject/accept, logging a sale, correct totals, persistence across a full
reload (localStorage) and session persistence of the auth gate
(sessionStorage), delete, and a clean mobile layout — zero console errors.

**Known limitations, called out in the docs:** the passcode gate is not
real authentication, and localStorage does not sync across devices — both
flagged as things to replace before this handles real business data.

## 2026-08-05 — Platform foundation, website platform, and admin scaffold

Initial build of the platform frontend from scratch.

**Foundation**

- pnpm monorepo (`apps/*`, `packages/*`, `static-data`) with shared
  TypeScript/ESLint/Prettier config
- `@rdplatforms/types` shared contracts for Business, BusinessTheme, and
  content (services, gallery, testimonials, SEO, pages/sections, FAQ, team,
  settings)
- `@rdplatforms/utils` with unit-tested formatters, slug helpers, validators

**Data & Business Resolution**

- `static-data/` with three fully-populated demo businesses (Royal Salon,
  Urban Bistro, Vision3D Studio) and all their content
- `@rdplatforms/services` — `*DataSource` interfaces + `JsonDataSource` +
  ten `*Service` classes, unit tested
- `@rdplatforms/business` — `BusinessResolver` with query-param / hostname /
  env-default strategies, each independently unit tested plus resolver
  integration tests (36 tests passing across the repo)

**Website Platform**

- `@rdplatforms/providers` — theme engine (`createAppTheme`), business/theme/
  query providers composed as `AppProviders`
- `@rdplatforms/hooks` — TanStack Query hooks over the services layer
- `@rdplatforms/ui` — primitives, layout (Navbar/Footer), and eleven section
  components, plus `SectionRenderer` for config-driven section
  enable/disable/reorder
- `apps/website` — business resolution gate, lazy-loaded routing, SEO
  document head, contact form (React Hook Form + Zod), vendor code-splitting

**Admin**

- `apps/admin` — routing shell, sidebar layout, eight placeholder pages
  (intentionally not fully built per the platform's phased plan)

**Verification**

- All packages type-check (`pnpm -r typecheck`)
- 36 tests passing (`pnpm test`)
- Both apps build cleanly (`pnpm build`)
- Both apps manually verified in a real browser (Playwright): all three
  demo businesses render with correct per-business theming and
  config-driven sections (Urban Bistro's FAQ correctly hidden, Vision3D's
  Team section correctly shown, dark mode correctly applied); zero console
  errors or failed network requests; admin routing and placeholder pages
  confirmed working

**Documentation**

- Full root doc set, `/docs` deep dives, and ADRs for the key architectural
  decisions made during this build
