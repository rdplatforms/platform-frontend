# Platform Frontend

A single, reusable frontend codebase that powers many business websites — a
salon, a restaurant, a 3D visualization studio, and eventually hundreds more
— by changing **data**, not code.

This is not a salon website or a restaurant website. It's a website
_platform_, engineered the way Shopify, Wix, or Webflow's frontend would be:
one codebase, one deploy pipeline, many tenants, each configured through
data.

## Vision

> One frontend. Many businesses. The difference between them is data.

Every visual and structural difference between Swami Hair Salon, Urban Bistro,
and Vision3D Studio — colors, typography, which sections appear, what
services are listed — comes from configuration, not from business-specific
components or forked code paths. Onboarding business #4 should never require
a new component, a new route, or a code review of business logic; it should
require a new data record.

That data can be static JSON (see `static-data/`) or a real Spring Boot
API (see `backend/`) — an env var away, no code change either way (see
`packages/services/src/dataSource/activeDataSource.ts`). Static JSON
remains the default; the backend today serves the same read-only content
(see [TASKS.md](TASKS.md) for what's implemented so far) — write
endpoints, auth, and roles are still ahead. See
[docs/future-backend-contract.md](docs/future-backend-contract.md).

## Architecture at a glance

```
Website / Admin (React)
        │
        ▼
BusinessResolver   — "which business is this request for?"
        │
        ▼
BusinessService / *Service   — the only things that know where data lives
        │
        ▼
activeDataSource   — JsonDataSource or HttpDataSource, by env var
        │
        ▼
static-data/*.json  or  backend/ (Spring Boot + Postgres)
```

Full detail: [ARCHITECTURE.md](ARCHITECTURE.md) and
[docs/frontend-architecture.md](docs/frontend-architecture.md).

## Folder structure

```
apps/
  website/       Public multi-tenant business website (Vite + React)
  admin/         Platform operator admin console (scaffolded, not built out)
packages/
  types/         Shared TypeScript contracts (Business, Theme, content)
  utils/         Pure functions: formatting, slugs, validation
  services/      Data access layer — the JSON/REST swap point
  business/      BusinessResolver — resolves a request to a Business
  contexts/      React context definitions
  providers/     Context providers, theme engine, TanStack Query setup
  hooks/         Data-fetching hooks built on the services layer
  ui/            Reusable, business-agnostic UI: primitives, layout, sections
static-data/     Temporary JSON data source (3 demo businesses + content)
docs/            Deep-dive architecture and process documentation
docs/adr/        Architecture Decision Records
```

Full rationale: [docs/folder-structure.md](docs/folder-structure.md).

## Demo businesses

| Business             | Category      | What it demonstrates                                                                          |
| -------------------- | ------------- | --------------------------------------------------------------------------------------------- |
| **Swami Hair Salon** | Salon         | Real business, bilingual (Marathi/English) content with a language switcher, gold/black theme |
| **Urban Bistro**     | Restaurant    | Light theme, square buttons, classic serif, FAQ section disabled via config                   |
| **Vision3D Studio**  | Design studio | Dark theme, square buttons, modern sans, Team section enabled, map disabled                   |

Switch between them locally with `?business=<slug>` — see
[Getting started](#getting-started).

## Localization

Businesses can offer content in more than one language — Swami Hair Salon
ships in Marathi and English with a switcher in the navbar. Single-language
businesses (the common case) are entirely unaffected — see
[docs/i18n.md](docs/i18n.md).

## Owner dashboard

Each business has a basic sales-logging tool at `/dashboard` on its own
site (passcode-gated — a placeholder, not real auth). See
[docs/business-dashboard.md](docs/business-dashboard.md).

## Tech stack

React · TypeScript · Vite · React Router · MUI · React Hook Form · Zod ·
TanStack Query · ESLint · Prettier · Vitest · pnpm workspaces

## Getting started

Requires Node 20+ and [pnpm](https://pnpm.io) 10+.

```bash
pnpm install

# Website (http://localhost:5173)
pnpm dev:website

# Admin (http://localhost:5174)
pnpm dev:admin
```

The website resolves which business to render from, in priority order: a
`?business=<slug>` query override, the request hostname, then a
`VITE_DEFAULT_BUSINESS_SLUG` env fallback (see `apps/website/.env.example`).
Locally, use the query override to preview any demo business:

```
http://localhost:5173/?business=swami-hair-salon
http://localhost:5173/?business=urban-bistro
http://localhost:5173/?business=vision3d
```

## Scripts

| Command                               | Description                            |
| ------------------------------------- | -------------------------------------- |
| `pnpm dev:website` / `pnpm dev:admin` | Run an app in dev mode                 |
| `pnpm build`                          | Build every workspace package/app      |
| `pnpm typecheck`                      | Type-check every workspace package/app |
| `pnpm lint` / `pnpm lint:fix`         | ESLint across the repo                 |
| `pnpm format` / `pnpm format:check`   | Prettier across the repo               |
| `pnpm test` / `pnpm test:watch`       | Run the Vitest suite                   |

## Roadmap

See [ROADMAP.md](ROADMAP.md) for the phased plan (platform foundation →
website platform → admin → backend integration → appointments → payments →
marketplace) and [TODO.md](TODO.md) / [PROGRESS.md](PROGRESS.md) for current
status.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md), [CODING_STANDARDS.md](CODING_STANDARDS.md),
and [COMPONENT_GUIDELINES.md](COMPONENT_GUIDELINES.md) before opening a PR.
