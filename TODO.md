# TODO

Granular, trackable work items. Each entry has a status, priority, and
description. For the bigger-picture phased plan, see [ROADMAP.md](ROADMAP.md).
For narrative history, see [PROGRESS.md](PROGRESS.md).

Status: `Done` · `In Progress` · `Not Started`
Priority: `P0` (blocking) · `P1` (high) · `P2` (normal) · `P3` (nice to have)

## Foundation

| Status | Priority | Item                        | Description                                                    |
| ------ | -------- | --------------------------- | -------------------------------------------------------------- |
| Done   | P0       | Monorepo scaffold           | pnpm workspaces across `apps/*`, `packages/*`, `static-data`   |
| Done   | P0       | Shared TypeScript contracts | `@rdplatforms/types` — Business, Theme, content types          |
| Done   | P1       | Shared utils                | Formatters, slug helpers, validators with unit tests           |
| Done   | P0       | Static data source          | Three demo businesses + content JSON, isolated behind services |

## Business Resolution

| Status      | Priority | Item                     | Description                                                                      |
| ----------- | -------- | ------------------------ | -------------------------------------------------------------------------------- |
| Done        | P0       | `BusinessResolver`       | Ordered strategy resolution: query param → hostname → env default                |
| Done        | P1       | Resolver unit tests      | Each strategy pure-function tested in isolation, plus resolver integration tests |
| Not Started | P2       | Multi-domain aliasing UI | Admin UI to manage a business's `domains[]` (currently JSON-only)                |

## Services Layer

| Status      | Priority | Item                     | Description                                                                           |
| ----------- | -------- | ------------------------ | ------------------------------------------------------------------------------------- |
| Done        | P0       | `*DataSource` interfaces | One per content type, implemented by `JsonDataSource`                                 |
| Done        | P0       | `*Service` classes       | Business, ServiceCatalog, Gallery, Testimonial, Theme, Seo, Page, Faq, Team, Settings |
| Not Started | P0       | `HttpDataSource`         | Real REST implementation once the backend exists                                      |

## Website Platform

| Status      | Priority | Item                            | Description                                                                                     |
| ----------- | -------- | ------------------------------- | ----------------------------------------------------------------------------------------------- |
| Done        | P0       | Theme engine                    | `createAppTheme` derives an MUI theme from `BusinessTheme`                                      |
| Done        | P0       | Section library                 | Hero, About, Services, Gallery, Testimonials, Faq, Cta, Contact, Map, Pricing, Team             |
| Done        | P0       | `SectionRenderer`               | Config-driven enable/disable/reorder                                                            |
| Done        | P1       | Contact form                    | React Hook Form + Zod validation (no submission backend yet)                                    |
| Done        | P1       | SEO document head               | Per-business title/description/keywords via `useSeo`                                            |
| Done        | P2       | Code splitting                  | Lazy-loaded routes + vendor chunk splitting                                                     |
| Not Started | P2       | Per-business multi-page support | `PageConfig` already supports multiple `path` entries per business; router only wires `/` today |

## Admin

| Status      | Priority | Item                   | Description                                                         |
| ----------- | -------- | ---------------------- | ------------------------------------------------------------------- |
| Done        | P1       | Routing + layout shell | Sidebar navigation, `AdminLayout`                                   |
| Done        | P1       | Placeholder pages      | Dashboard, Pages, Media, Services, Business, Theme, Users, Settings |
| Not Started | P0       | Authentication         | No auth exists yet — required before any real functionality         |
| Not Started | P1       | Business/content CRUD  | Depends on Phase 4 backend                                          |

## Business Owner Dashboard

| Status      | Priority | Item                                 | Description                                                                               |
| ----------- | -------- | ------------------------------------ | ----------------------------------------------------------------------------------------- |
| Done        | P1       | Sales logging (`/dashboard`)         | Log a service/product sale, view totals (today/week/month/all-time), delete an entry      |
| Done        | P1       | `SalesDataSource` (localStorage)     | First write-capable data source; per-business namespaced, unit tested with a fake storage |
| Not Started | P0       | Real authentication                  | Passcode gate is a placeholder — see `docs/business-dashboard.md`                         |
| Not Started | P1       | MongoDB-backed `HttpSalesDataSource` | Needs a small API in front of Mongo; same swap pattern as `HttpDataSource`                |
| Not Started | P2       | Edit an existing sale entry          | v1 only supports create + delete                                                          |
| Not Started | P2       | Real product catalog                 | Products are free-text on the entry today, not their own type                             |

## Backend Integration

| Status      | Priority | Item                                     | Description                                                  |
| ----------- | -------- | ---------------------------------------- | ------------------------------------------------------------ |
| Not Started | P0       | Spring Boot API                          | Implements the contract in `docs/future-backend-contract.md` |
| Not Started | P0       | Swap `JsonDataSource` → `HttpDataSource` | Per-service, behind the existing interfaces                  |

## Documentation

| Status | Priority | Item               | Description                                                                                                |
| ------ | -------- | ------------------ | ---------------------------------------------------------------------------------------------------------- |
| Done   | P1       | Root docs          | README, ARCHITECTURE, ROADMAP, TODO, PROGRESS, CHANGELOG, standards/guidelines                             |
| Done   | P1       | `/docs` deep dives | frontend-architecture, deployment, future-backend-contract, business-model, future-admin, folder-structure |
| Done   | P2       | ADRs               | Key architectural decisions recorded under `docs/adr/`                                                     |
