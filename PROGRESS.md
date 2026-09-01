# Progress Log

Running log of implementation progress. Update this after every completed
feature or milestone. Newest entries first.

## 2026-09-01 — Appointment booking, icon placeholders, Netlify deployment prep

Prepared Swami Hair Salon for a same-day owner demo on Netlify.

- New config-driven `appointment` section
  (`packages/ui/src/sections/Appointment.tsx`): name/phone/service/date/
  time/note form, opens a prefilled WhatsApp message to the business's
  number on submit via `buildAppointmentMessage`
  (`packages/utils/src/appointment.ts`) + the existing `toWhatsAppLink`.
  Reusable by any business, not built one-off — see
  [docs/appointments.md](docs/appointments.md) and
  [docs/adr/0010-whatsapp-appointment-handoff.md](docs/adr/0010-whatsapp-appointment-handoff.md).
  No backend submission and no bookings persistence yet — deliberately
  deferred to ship same-day; the customer still has to tap Send.
- Enabled the new section for Swami Hair Salon, positioned right after
  Services.
- Upgraded Swami Hair Salon's service and gallery placeholder images from
  flat color+text tiles to simple icon illustrations (scissors, spa
  droplet, comb, storefront, mirror, barber chair) in the brand's
  gold/black palette — logo/favicon/og-image left as-is.
- Added `netlify.toml` and documented the interim one-site-per-business
  deployment approach (env-var-forced business, not hostname yet) — see
  [docs/deployment.md](docs/deployment.md) and
  [docs/adr/0009-netlify-interim-deployment.md](docs/adr/0009-netlify-interim-deployment.md).
  Actually connecting the repo in Netlify's dashboard is a step only the
  Netlify account owner can do — not completed from this repo.

**Verification:** 69 tests passing (4 new), full typecheck/build clean.

## 2026-08-06 — Bilingual content support + Swami Hair Salon rebrand

Added per-business bilingual content and rebranded the salon demo business
from the generic "Royal Salon" placeholder to a real business — see
[docs/i18n.md](docs/i18n.md) and
[docs/adr/0008-per-business-bilingual-content.md](docs/adr/0008-per-business-bilingual-content.md).

- `LocalizableText`/`SupportedLocale` types (`@rdplatforms/types`) —
  additive: existing single-language businesses (Urban Bistro, Vision3D)
  are completely unaffected, still plain strings throughout
- `resolveLocalizedText` + a `uiStrings.ts` platform-chrome dictionary
  (`@rdplatforms/utils`), unit tested
- `LocaleContext`/`LocaleProvider` (`@rdplatforms/contexts`,
  `@rdplatforms/providers`) wired into `AppProviders`, plus a
  `LanguageSwitcher` in `Navbar` that renders nothing for single-language
  businesses
- Every section component, `Navbar`, `Footer`, and `DocumentHead` updated
  to resolve localized business content and translated chrome text
- Fixed a real, unrelated gap surfaced by this work: declared theme fonts
  (`typography.fontFamily`/`headingFontFamily`) were never actually
  loaded anywhere — added `typography.googleFontsUrl` +
  `loadGoogleFont()` to `AppThemeProvider`
- `BusinessContact.email` and most of `BusinessAddress` made optional, plus
  a defensive `formatAddressLine` helper — real small businesses often
  don't have every field a Western contact form assumes
- Rebranded `royal-salon` → `swami-hair-salon` (स्वामी हेअर सलून) across
  every `static-data/` file, assets, the `JsonDataSource` registry, and
  the website's default-business env var, with real contact/location
  details (phone, WhatsApp, Google Maps coordinates and directions link)
  and bilingual (Marathi/English) tagline, description, services, and
  team (proprietor) content. Testimonials and FAQ sections disabled for
  now — no real content confirmed yet, not invented.

**Verification:** 65 tests passing, both apps build cleanly, and browser-
driven checks confirmed: Marathi renders correctly with the intended
Devanagari display font, the English toggle re-renders every string
correctly while the business name itself stays in Devanagari (a brand
name is never translated), mobile layout holds up, and the other two
demo businesses render exactly as before with no language switcher shown.

**Known limitations, called out in the docs:** the Marathi translations
(UI chrome and business content) are a first pass, not verified by a
native speaker; the business's exact street address, hours, service
pricing, and the fourth tagline item ("ब्रिज इम्प्लांट") are still
unconfirmed and were deliberately left out rather than guessed.

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
