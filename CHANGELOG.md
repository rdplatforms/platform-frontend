# Changelog

All notable changes to this project are documented here. Format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/); versioning follows
[Semantic Versioning](https://semver.org/).

## [Unreleased]

### Added

- Monorepo foundation: pnpm workspaces, shared TypeScript/ESLint/Prettier
  config, Vitest.
- `@rdplatforms/types` shared contracts for businesses, themes, and content.
- `@rdplatforms/utils` formatting, slug, and validation helpers.
- `@rdplatforms/services` data access layer with a `JsonDataSource` and
  per-content-type services.
- `@rdplatforms/business` `BusinessResolver` with hostname, query-param, and
  environment-default resolution strategies.
- `@rdplatforms/contexts` and `@rdplatforms/providers`, including the
  business theme engine (`createAppTheme`).
- `@rdplatforms/hooks` TanStack Query hooks over the services layer.
- `@rdplatforms/ui` reusable primitives, layout, and section component
  library, plus config-driven `SectionRenderer`.
- `apps/website` — the public, multi-tenant business website.
- `apps/admin` — scaffolded admin console with routing and placeholder
  pages.
- Three demo businesses with full content: Royal Salon (salon), Urban
  Bistro (restaurant), Vision3D Studio (architecture/3D visualization).
- Full documentation set: README, ARCHITECTURE, ROADMAP, TODO, PROGRESS,
  CODING_STANDARDS, COMPONENT_GUIDELINES, DESIGN_SYSTEM, ROUTES,
  CONTRIBUTING, AI_OPERATING_INSTRUCTIONS, `/docs` deep dives, and ADRs.
- Per-business owner dashboard (`/dashboard` on `apps/website`) for logging
  sales and viewing totals, backed by a new `SalesDataSource` (the
  platform's first write-capable data source) with a localStorage-backed
  implementation, gated by a placeholder per-business passcode.
