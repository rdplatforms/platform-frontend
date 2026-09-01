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
- Per-business bilingual content support (`LocalizableText`, `LocaleProvider`,
  a language switcher, and a UI-chrome string dictionary for en/mr) and a
  fix for a gap where declared theme fonts were never actually loaded.
- Rebranded the salon demo business from "Royal Salon" to a real business,
  Swami Hair Salon (स्वामी हेअर सलून), with real contact/location details
  and bilingual (Marathi/English) content.
- A config-driven `appointment` section: customers request a booking
  (service/date/time), handed off to the business's WhatsApp number as a
  prefilled message. Reusable by any business.
- Icon-based placeholder graphics for Swami Hair Salon's services and
  gallery, replacing flat color+text tiles.
- `netlify.toml` and an interim, one-site-per-business deployment approach
  for going live before real custom domains exist.
