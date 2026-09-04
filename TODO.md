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

| Status | Priority | Item                     | Description                                                                            |
| ------ | -------- | ------------------------ | -------------------------------------------------------------------------------------- |
| Done   | P0       | `*DataSource` interfaces | One per content type, implemented by `JsonDataSource`                                  |
| Done   | P0       | `*Service` classes       | Business, ServiceCatalog, Gallery, Testimonial, Theme, Seo, Page, Faq, Team, Settings  |
| Done   | P0       | `HttpDataSource`         | Real REST implementation against `backend/`, behind `VITE_API_BASE_URL` — see TASKS.md |

## Website Platform

| Status      | Priority | Item                            | Description                                                                                                               |
| ----------- | -------- | ------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| Done        | P0       | Theme engine                    | `createAppTheme` derives an MUI theme from `BusinessTheme`                                                                |
| Done        | P0       | Section library                 | Hero, About, Services, Gallery, Testimonials, Faq, Cta, Contact, Map, Pricing, Team, Appointment                          |
| Done        | P0       | `SectionRenderer`               | Config-driven enable/disable/reorder                                                                                      |
| Done        | P1       | Contact form                    | React Hook Form + Zod validation (no submission backend yet)                                                              |
| Done        | P1       | SEO document head               | Per-business title/description/keywords via `useSeo`                                                                      |
| Done        | P2       | Code splitting                  | Lazy-loaded routes + vendor chunk splitting                                                                               |
| Done        | P1       | Mobile responsiveness pass      | Stacked CTA buttons, tighter Grid spacing on small screens, lazy-loaded card images — see `docs/mobile-responsiveness.md` |
| Not Started | P2       | Per-business multi-page support | `PageConfig` already supports multiple `path` entries per business; router only wires `/` today                           |

## Admin

| Status      | Priority | Item                   | Description                                                         |
| ----------- | -------- | ---------------------- | ------------------------------------------------------------------- |
| Done        | P1       | Routing + layout shell | Sidebar navigation, `AdminLayout`                                   |
| Done        | P1       | Placeholder pages      | Dashboard, Pages, Media, Services, Business, Theme, Users, Settings |
| Not Started | P0       | Authentication         | No auth exists yet — required before any real functionality         |
| Not Started | P1       | Business/content CRUD  | Depends on Phase 4 backend                                          |

## Business Owner Dashboard

| Status      | Priority | Item                                  | Description                                                                                 |
| ----------- | -------- | ------------------------------------- | ------------------------------------------------------------------------------------------- |
| Done        | P1       | Sales logging (`/dashboard`)          | Log a service/product sale, view totals (today/week/month/all-time), delete an entry        |
| Done        | P1       | `SalesDataSource` (localStorage)      | First write-capable data source; per-business namespaced, unit tested with a fake storage   |
| Not Started | P0       | Real authentication                   | Passcode gate is a placeholder — see `docs/business-dashboard.md`                           |
| Not Started | P1       | Postgres-backed `HttpSalesDataSource` | Superseded by the unified `Sale` entity in TASKS.md Milestone 4, not a standalone Mongo API |
| Not Started | P2       | Edit an existing sale entry           | v1 only supports create + delete                                                            |
| Not Started | P2       | Real product catalog                  | Products are free-text on the entry today, not their own type                               |

## Localization

| Status      | Priority | Item                                  | Description                                                                                                                     |
| ----------- | -------- | ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| Done        | P0       | `LocalizableText` + resolution        | Additive to existing single-language businesses; `resolveLocalizedText` unit tested                                             |
| Done        | P0       | `LocaleProvider` + `LanguageSwitcher` | Wired into `AppProviders`/`Navbar`; renders nothing for single-language businesses                                              |
| Done        | P1       | UI-chrome string dictionary           | `translateUi` covers nav/section defaults/form labels/buttons for en/mr                                                         |
| Done        | P1       | Font loading fix                      | `typography.googleFontsUrl` + `loadGoogleFont()` — was a real gap, not Marathi-specific                                         |
| Done        | P1       | Per-locale heading font               | `headingFontFamilyByLocale` — a Latin-only decorative heading font was breaking Devanagari conjunct shaping; see `docs/i18n.md` |
| Done        | P1       | Swami Hair Salon bilingual content    | Real business, Marathi-first with English toggle                                                                                |
| Not Started | P2       | Native-speaker review of Marathi copy | Both `uiStrings.ts` and the demo business content are a first pass                                                              |
| Not Started | P3       | Additional locales                    | Only `en`/`mr` exist in `SupportedLocale` today                                                                                 |

## Swami Hair Salon Content (Pending Confirmation)

| Status      | Priority | Item                        | Description                                                                                                                                                                                             |
| ----------- | -------- | --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Not Started | P1       | Street address              | Only coordinates + Maps link confirmed; no formatted address text yet                                                                                                                                   |
| Done        | P1       | Business hours              | Tue–Sun 10:00–22:00, closed Monday                                                                                                                                                                      |
| Not Started | P1       | Service pricing/duration    | All three confirmed services have no price/duration set                                                                                                                                                 |
| Not Started | P2       | 4th tagline item            | "ब्रिज इम्प्लांट" read off signage but not confirmed — omitted for now                                                                                                                                  |
| Done        | P2       | Real service photos         | 3 CC-licensed Wikimedia Commons photos in place — see `services/CREDITS.md`                                                                                                                             |
| Done        | P2       | Real gallery photos         | Exterior/Interior now the owner's own storefront photo; Styling Chair is a supplied product photo — see `gallery/CREDITS.md`                                                                            |
| Not Started | P0       | Styling chair photo license | Source/license of `styling-chair.jpg` is unknown (looks like a retailer/manufacturer product shot) — confirm with the owner it's cleared for use, or replace it, before this goes beyond a one-day demo |
| Not Started | P2       | Real logo photo             | Logo still a placeholder                                                                                                                                                                                |
| Not Started | P1       | Visible photo credit        | Service photos are CC BY 2.0 — need a visible on-site attribution line, not just the CREDITS.md record                                                                                                  |
| Not Started | P2       | Team section                | Disabled (page + nav) until there's a real photo of Shankar to replace the placeholder silhouette                                                                                                       |
| Not Started | P2       | Testimonials / FAQ          | Sections disabled — no real reviews or confirmed FAQ content yet                                                                                                                                        |

## Appointment Booking

| Status      | Priority | Item                        | Description                                                                                       |
| ----------- | -------- | --------------------------- | ------------------------------------------------------------------------------------------------- |
| Done        | P1       | `appointment` section type  | Name/service/date/time/note form (no phone — WhatsApp reveals it), config-driven                  |
| Done        | P1       | WhatsApp handoff            | Shared `useWhatsAppSubmit` hook; customer taps send, nothing automatic                            |
| Done        | P1       | Date validation             | No past dates — HTML `min` + a real Zod check                                                     |
| Done        | P1       | Hours-driven time slots     | `generateTimeSlots` from `BusinessHours` + `appointmentSlotMinutes`; closed days disabled         |
| Done        | P1       | "Currently closed" banner   | `ClosedNoticeBanner`, dismissible, driven by `isBusinessOpenNow` — see `docs/business-hours.md`   |
| Done        | P1       | Get In Touch → WhatsApp     | `Contact` section now uses the same handoff as Appointment                                        |
| Not Started | P2       | Bookings persistence        | No record kept on the platform side — same pattern as `SalesDataSource` if wanted                 |
| Not Started | P3       | Slots vs. existing bookings | A slot within hours is offered regardless of whether it's already booked (no bookings record yet) |

## Deployment

| Status      | Priority | Item                                       | Description                                                                    |
| ----------- | -------- | ------------------------------------------ | ------------------------------------------------------------------------------ |
| Done        | P1       | `netlify.toml` (interim, one per business) | Build/publish/SPA-redirect config; per-site `VITE_DEFAULT_BUSINESS_SLUG`       |
| Not Started | P1       | First live deploy (Swami Hair Salon)       | Requires connecting the repo in Netlify's dashboard — not doable from the repo |
| Not Started | P2       | Custom domain + hostname resolution        | Long-term shape once a real domain exists — see `docs/deployment.md`           |

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
