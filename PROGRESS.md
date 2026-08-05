# Progress Log

Running log of implementation progress. Update this after every completed
feature or milestone. Newest entries first.

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
