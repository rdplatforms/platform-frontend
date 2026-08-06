# Roadmap

Phased plan for the platform. Status reflects what's actually implemented —
see [PROGRESS.md](PROGRESS.md) for a running log and [TODO.md](TODO.md) for
granular, trackable items.

## Phase 1 — Platform Foundation ✅ Complete

Monorepo structure, shared type contracts, business resolver, services
abstraction layer, and three demo businesses with full static content.

- pnpm workspace with `apps/*`, `packages/*`, `static-data`
- `@rdplatforms/types` shared contracts
- `@rdplatforms/utils` (formatters, slugs, validators)
- `@rdplatforms/services` data access layer over `JsonDataSource`
- `@rdplatforms/business` — `BusinessResolver` with hostname / query-param / env strategies
- Three demo businesses: Swami Hair Salon (real business, bilingual mr/en), Urban Bistro, Vision3D Studio

## Phase 2 — Website Platform ✅ Complete

The reusable, config-driven public website.

- `@rdplatforms/providers` theme engine (`createAppTheme`) + `AppProviders`
- `@rdplatforms/hooks` content hooks over TanStack Query
- `@rdplatforms/ui` primitives, layout, and full section library
- `SectionRenderer` — enable/disable/reorder sections purely through data
- `apps/website` — business resolution, lazy-loaded routing, SEO document head
- Contact section using React Hook Form + Zod (client-side validation only — no backend yet)
- Per-business bilingual content (`LocalizableText`, `LocaleProvider`, a `Navbar` language switcher) and dynamic Google Fonts loading — see [docs/i18n.md](docs/i18n.md)
- A basic per-business owner dashboard (`/dashboard`) for logging sales — see [docs/business-dashboard.md](docs/business-dashboard.md)

## Phase 3 — Admin 🟡 Scaffolded

- [x] Routing shell + sidebar navigation (`AdminLayout`)
- [x] Placeholder pages: Dashboard, Pages, Media, Services, Business, Theme, Users, Settings
- [ ] Authentication and role-based access
- [ ] Real CRUD for business content (pages/sections, services, gallery, testimonials, FAQ, team)
- [ ] Theme editor with live preview against the real theme engine
- [ ] Media upload and management

See [docs/future-admin.md](docs/future-admin.md).

## Phase 4 — Backend Integration ⬜ Not started

- [ ] Spring Boot API implementing the contracts in [docs/future-backend-contract.md](docs/future-backend-contract.md)
- [ ] `HttpDataSource` implementations of every `*DataSource` interface in `@rdplatforms/services`
- [ ] Authentication/session handling for the admin
- [ ] Replace static `BUSINESSES_BY_SLUG` registry with a real business directory lookup (by hostname) at the API layer

## Phase 5 — Appointments ⬜ Not started

- [ ] Booking/scheduling data model and service (salon, dental, photography, etc.)
- [ ] Availability + calendar UI in the website's Services/Contact flow
- [ ] Admin booking management

## Phase 6 — Payments ⬜ Not started

- [ ] Deposit/payment collection for bookings and orders
- [ ] Payment provider integration behind a `PaymentService` abstraction
- [ ] Invoicing/receipts

## Phase 7 — Marketplace ⬜ Not started

- [ ] Self-serve business onboarding (create a `Business` record without a deploy)
- [ ] Template/category gallery (salon, restaurant, gym, dental, hotel, interior design, photography, legal, architecture, ecommerce, real estate, ...)
- [ ] Billing/subscription for platform tenants
