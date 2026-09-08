# Tasks

Granular, sequential execution log for the platform's backend + roles +
booking/billing + e-commerce initiative. This is a different document from
[TODO.md](TODO.md)/[PROGRESS.md](PROGRESS.md): those track the frontend-only,
static-data phase of the project narratively. TASKS.md tracks _this_
initiative task-by-task, in commit-sized units, starting from TASK-001.

For the high-level phase structure this maps onto, see
[ROADMAP.md](ROADMAP.md) (Phases 3–7). For the architecture reasoning
behind the decisions below, see the chat/plan history — this file tracks
_what_, not _why_; put durable _why_ into `docs/` as each task lands.

## Conventions

- **Status**: `Not Started` · `In Progress` · `Done` · `Blocked`
- **One task = one commit** (or a small tight group of commits if a task
  is genuinely too large for one), only once that task's scope is
  actually done — no partial/WIP commits against a task ID.
- **Commit message format**: `TASK-00N: <what actually shipped>` — a
  real past-tense description of the change, not the task title restated
  (e.g. `TASK-013: add Booking entity, repository, and status-transition endpoints`,
  not `TASK-013: implement booking`).
- **Commit author**: every commit here is authored as
  `Ritesh Dhekane <ritesh.dhekane@outlook.com>` (the repo's configured
  git identity) — no co-author trailer.
- Tasks are meant to be done **in order within a milestone**; milestones
  themselves are ordered (each depends on the previous one existing),
  but call out cross-milestone dependencies explicitly where they exist.

## Roles (reference)

Established during planning, referenced throughout the tasks below:

| Role               | Scope                                                                                                                                                           | Logs in where                                                  |
| ------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------- |
| **Super Admin**    | Whole platform — create/suspend businesses, create Business Owner accounts, cross-business analytics                                                            | `apps/admin` (platform-wide, not per-business)                 |
| **Business Owner** | One or more businesses — catalog, staff, theme/content, full booking + sales analytics                                                                          | `apps/portal` (per-business, on that business's own subdomain) |
| **Staff**          | Added by a Business Owner, scoped to one business — log walk-in sales, manage booking queue; full-analytics visibility is an opt-in permission the Owner grants | `apps/portal`                                                  |
| **Customer**       | Optional account for an end customer of one business — booking/order history, faster repeat checkout. Not required to book or buy as a guest.                   | `apps/website` (public site)                                   |
| **Visitor**        | Anyone unauthenticated browsing `apps/website`                                                                                                                  | n/a — not a persisted role, just "no session"                  |

`Staff`/`Business Owner`/`Super Admin` are **internal** accounts
(`User` + `BusinessMembership`); `Customer` is a **separate** table/type
tied to `apps/website`'s own login, deliberately not mixed into the same
RBAC used for staff-side accounts.

## Portal domain model (reference)

Each business gets its own subdomain for its Owner/Staff portal, chosen by
the business (`admin.`, `console.`, whatever they want) — separate from
its public site's domain(s). Modeled as a new `Business.portalDomains: string[]`
field, resolved the same way `domains[]` already is (`BusinessResolver`'s
hostname strategy), just consumed by `apps/portal` instead of
`apps/website`. `apps/admin` (Super Admin) stays platform-wide, on its own
fixed domain, unrelated to any single business's portal domain — this was
already the design in `docs/future-admin.md`, unchanged here.

---

**Repo split note:** `backend/` (TASK-001 onward) lived inside this repo
through Milestone 3. It has since been moved to its own repo,
`platform-backend` (sibling to this one, history preserved via
`git subtree split`) — see that repo's `README.md` for local-run
instructions. Task descriptions below that say "under `backend/`" are
accurate for the point in time they were written; going forward, backend
work happens in `platform-backend`, tracked by its own TASKS.md if/when
it needs one.

## Milestone 1 — Backend Foundation

Stand up a real backend with read-only parity to `static-data/` — no new
behavior yet, just proving the seam works end-to-end before adding logic.

- [x] **TASK-001** — Scaffold the Spring Boot project under `backend/` (Gradle, base package layout, health-check endpoint, local-run instructions in a `backend/README.md`). ✅ Done
- [x] **TASK-002** — Postgres schema/migrations (Flyway) + a `docker-compose.yml` for local Postgres. ✅ Done
- [x] **TASK-003** — Read-only JPA entities + repositories for existing content types (Business, ServiceItem, GalleryItem, Testimonial, FaqItem, TeamMember, BusinessTheme, SeoConfig, PageConfig, BusinessSettings) + a one-time import script loading `static-data/*.json` into Postgres. ✅ Done
- [x] **TASK-004** — Read-only REST controllers matching the surface already specified in `docs/future-backend-contract.md`. ✅ Done
- [x] **TASK-005** — `HttpDataSource` in `packages/services`, behind an env flag so `JsonDataSource` stays available for offline/local dev; cut the frontend over. ✅ Done
- [x] **TASK-006** — Update `docs/future-backend-contract.md` (mark implemented), `ARCHITECTURE.md`, and `docs/business-dashboard.md` (correct the Mongo mention — Milestone 4 will supersede `SaleEntry` with a Postgres-backed `Sale` instead). ✅ Done — **Milestone 1 complete**

## Milestone 2 — Auth & Roles

- [x] **TASK-007** — `User`, `BusinessMembership` (role: owner/staff), and `Customer` data model; Spring Security + JWT issuing/validation. ✅ Done
- [x] **TASK-008** — Super Admin auth wired into `apps/admin` (real login, protected routes, replacing the "Coming Soon" placeholders for auth-gated pages). ✅ Done
- [x] **TASK-009** — Super Admin capability: create/suspend a `Business` tenant; create that business's first Business Owner account. ✅ Done — backend + `apps/admin`'s `/businesses` UI (the UI half landed later, in the audit-fixes entry below, once curl-only access was flagged as a real requirements gap)
- [x] **TASK-010** — Scaffold `apps/portal` (new app): Business Owner/Staff login, resolves the current business via `Business.portalDomains[]`. ✅ Done
- [x] **TASK-011** — Business Owner capability in `apps/portal`: invite/create/deactivate Staff accounts; per-staff "can view full analytics" toggle. ✅ Done
- [x] **TASK-012 (partial)** — Update `docs/business-dashboard.md`/`docs/portal.md` to reflect the real portal. ✅ Done (docs updated throughout TASK-010/011). **Deferred to TASK-019**: actually removing the interim localStorage `/dashboard` + passcode gate from `apps/website`. Caught while starting this task: `apps/portal` only has login + staff management so far — it does _not_ yet have sales logging/totals, which is the dashboard's entire purpose. Deleting it now would be a real regression (owners lose the ability to log sales at all) with no replacement until Milestone 4 (TASK-016/017/018) actually builds that functionality into the portal. TASK-019 already covers this removal at the correct point in the sequence — expanded its wording below to be explicit about the route/passcode gate, not just the sales-entry form.

## Milestone 3 — Real Booking

- [x] **TASK-013** — `Booking` entity + endpoints (create/list/update status: pending → confirmed → completed/cancelled/no_show). ✅ Done
- [x] **TASK-014** — `apps/website`'s Appointment section POSTs to the real endpoint (WhatsApp message still fires too, as a notify side-effect, not the only record). ✅ Done
- [x] **TASK-015** — `apps/portal` booking queue: today's/upcoming bookings, change status, add a walk-in/phone-in booking manually. ✅ Done — **Milestone 3 complete**

## Milestone 4 — Digital Business Card (`rtsh-info`)

A separate initiative from the business-platform work above — a
platform-owned product, not a per-tenant business site. One shared app
serving a mobile-first personal profile page at `<domain>/<identifier>`,
opened by scanning a QR code on someone's physical business card.
`rtsh-info` is a placeholder app name, expected to change later. See the
chat history for the full design discussion (path-based resolution vs.
`apps/website`'s hostname-based resolution, phone-number MVP routing
evolving to an opaque `uid` past ~100 users, and the separate/deferred
link-shortener idea for email use — not part of this milestone).

Card data model is **extensible by design**: a `links: [{ type, value,
label? }]` array rather than hardcoded `whatsapp`/`instagram`/`website`
fields, with an icon lookup map in the UI (unknown `type` falls back to
a generic link icon). Adding a new platform later (LinkedIn, X,
Telegram, ...) is just a new `links` entry plus, if it's a genuinely new
`type`, one icon-map entry — no schema change.

- [x] **TASK-029** — Scaffold `apps/rtsh-info` (new Vite/React app, own fixed MUI theme — same reasoning as `apps/admin`'s, no per-business theme engine needed). Basic mobile-first shell + a `/:identifier` route + `NotFoundPage` for genuinely unmatched paths. ✅ Done
- [x] **TASK-030** — `Card`/`CardLink` types (`packages/types`) + `static-data/cards/*.json` + a local `cardRegistry.ts`/`useCard()` hook, mirroring `JsonDataSource`'s registry pattern but path-param-resolved (not hostname-resolved), matching on the last 10 digits of the identifier for MVP phone-number routing. `findCardByIdentifier` already falls back to matching `Card.id` directly for a non-phone-shaped identifier, so the future `uid`-routing migration needs no code change here, only new QR codes. ✅ Done
- [x] **TASK-031** — Card page UI: circular avatar (initials fallback), name/title/location/phone/email, and the extensible `links` list rendered as icon buttons — reused `@rdplatforms/utils`' existing `toWhatsAppLink`/`formatPhoneForDisplay` rather than reimplementing them. `linkPresentation.ts` isolates the one place a new link `type` needs a touch (icon map + optional label/href handling). ✅ Done
- [x] **TASK-032** — Seeded the first real `Card` record (Ritesh Dhekane) + `docs/rtsh-info.md` (routing scheme, how to add a card, how to add a new link type, future `uid` migration). ✅ Done — **Milestone 4 complete** (for its current MVP scope; link shortener explicitly deferred, not part of this milestone)

Post-MVP refinements, requested after seeing the first shipped version:

- [x] **TASK-033** — Shared `getInitials`/`getAvatarColors` utility (`@rdplatforms/utils`, not local to `apps/rtsh-info` — reusable anywhere a "no photo yet" avatar is needed) deriving a two-letter badge + deterministic color pair from a name alone. ✅ Done
- [x] **TASK-034** — Five selectable, Linktree-inspired visual styles (`Card.style`, `src/cardStyles.ts`) switched entirely from data; added `maps` (Google Maps search from a free-text address) and `website` links to `ritesh-dhekane.json`. ✅ Done
- [x] **TASK-035** — `NotFoundPage` gained a mobile-number input that navigates straight to `/<number>`, for looking a card up without its QR code. ✅ Done
- [x] **TASK-036** — Split "style" (colors, `cardStyles.ts`) from a new, independent "template" axis (`Card.template`, `src/templates/`) — 4 genuinely different component layouts (Stack/Banner/Compact/Framed), not recolors of one skeleton. Added a dev-only floating switcher (`DevPreviewSwitcher`, gated on `import.meta.env.DEV`, verified tree-shaken out of the production bundle) to cycle both live while building. ✅ Done

## Milestone 5 — Billing/POS + Analytics

- [x] **TASK-016** — Unified `Sale` entity (`platform-backend`: line items with category, payment method, optional linked `Booking`, `source: STAFF | ONLINE`, `createdByUserId`) + endpoints — supersedes `SaleEntry`/`SalesDataSource`. `GET` gated on Owner/Super Admin or Staff with `canViewFullAnalytics`; `POST` open to any member. Linking a `bookingId` marks that Booking COMPLETED. ✅ Done
- [x] **TASK-017** — `apps/portal` itemized bill creation UI (`/billing`) — catalog-backed or custom line items, qty/price/discount, payment method, optionally fulfilling an existing `Booking`; a "recent bills" list that fails silently (not an error) for a Staff member without the analytics permission. ✅ Done
- [x] **TASK-018** — `apps/portal` analytics (`/analytics`): Today/Week/Month/All-Time totals + category-wise breakdown (selectable period), visible to Owner and any Staff granted the permission from TASK-011; a plain explanatory message, not an error, for a Staff member without it. ✅ Done
- [x] **TASK-019** — Retired `SaleEntry`/`SalesDataSource`/`LocalStorageSalesDataSource`/`SalesService`/`useSales`/`useCreateSale`/`useDeleteSale`/`BusinessSettings.dashboardPasscode` and removed the interim `/dashboard` route + passcode gate from `apps/website` entirely (see TASK-012's note); kept `packages/utils/src/sales.ts`'s date-bucketing helpers (never `SaleEntry`-specific) for the new analytics page. Folded `docs/business-dashboard.md` into `docs/portal.md` and deleted it; wrote [docs/adr/0012-real-billing-supersedes-localstorage-dashboard.md](docs/adr/0012-real-billing-supersedes-localstorage-dashboard.md), marked ADR 0007 superseded. ✅ Done — **Milestone 5 complete**

Also fixed along the way: `StaticDataImportRunner`'s default import path
(`platform-backend`) assumed the pre-repo-split layout — updated to
`../platform-frontend/static-data`.

## Milestone 6 — 3D Printing Business + E-commerce

- [x] **TASK-020** — `Product` entity (`platform-backend` — real typed columns, not JSONB passthrough, since apps/portal needs real CRUD) + `HttpProductDataSource`/`ProductService`/`useProducts` (backend-only, no static-data fallback); `BusinessSettings.commerceEnabled` capability flag (not category-gated, same "declared but not yet enforced" status as `bookingEnabled`). ✅ Done
- [x] **TASK-021** — New `shop` section type (`packages/ui/src/sections/Shop.tsx`, product grid) + a dedicated `/cart` route in `apps/website`. `CartContext`/`CartProvider` live in `@rdplatforms/contexts`/`@rdplatforms/providers`, not `apps/website` — `Shop.tsx` is shared via `packages/ui`, which can't depend on an app. ✅ Done
- [x] **TASK-022** — Client-side `Cart` (localStorage, namespaced per business, no backend cart entity) + checkout flow that creates a `Sale(source: 'ONLINE')`. Backend: `SaleController.create` now tells STAFF/ONLINE apart by whether `AuthenticatedUser` is null (mirrors `BookingController`), `POST /businesses/*/sales` is public; added `customerEmail`/`customerPhone` columns. Deliberately not best-effort like booking's WhatsApp fallback — checkout surfaces a real error on failure. ✅ Done
- [x] **TASK-023** — `apps/portal` product catalog CRUD (`/products`) — Owner-only (+ Super Admin), same gating as Staff management, not the "any member" gating Bookings/Billing have. ✅ Done
- [x] **TASK-024** — New demo business #4, `printforge-3d` (3D printing, `category: 'ecommerce'`): full content (services — a free design consultation, gallery, testimonials, faq, team, theme, seo, pages) + 5 seeded products (`static-data/products.json`, imported into real typed columns by `StaticDataImportRunner.importProducts` — the one static-data collection that isn't the generic JSONB path). `commerceEnabled: true` **and** `bookingEnabled: true` — proves a business isn't forced to pick one. Demoed end-to-end live: public shop listing, consultation service, public checkout creating an ONLINE Sale with correct total, Owner-side analytics reflecting it. ✅ Done — **Milestone 6 complete**

Also fixed along the way: `Product.id` was `@GeneratedValue`, which
conflicts with the importer needing to assign known, stable ids for
idempotent re-imports — Hibernate's `merge()` threw
`StaleObjectStateException` the first time. Fixed by making it
application-assigned (matching `PageConfig`'s strategy, not
`Booking`/`Sale`'s), caught by actually running the importer against
real data rather than trusting it would work from reading the code.

## Audit fixes — security/UX findings from a retrospective review

Not part of the milestone sequence — a full review of Milestones 1–3
(UI, security, logic) surfaced findings that sat unaddressed for
several milestones before being fixed here in one pass. All verified
live via curl in addition to new/updated tests.

- [x] **Backend validation** — `CreateOwnerRequest`/`CreateStaffRequest` accepted a blank/1-char password and any string as an email; `CreateBusinessRequest` accepted a blank phone/displayName and an unvalidated slug; the public booking endpoint had zero server-side validation despite being reachable directly, bypassing the website's client-side Zod checks entirely. Added `AccountValidation` (shared between the two account-creating controllers) plus per-field checks on `BusinessAdminController`/`BookingController`. ✅ Done
- [x] **`StaffController` missing business-exists check** — every other write controller 404s for an unknown `businessId`; `StaffController`'s Super-Admin path didn't, since `requireOwner` lets a Super Admin through purely on `superAdmin()` with no membership to anchor "this business is real." Could have silently created orphaned rows for a mistyped/deleted business. ✅ Done
- [x] **Session expiry only checked at app load** — `apps/portal`/`apps/admin`'s `AuthProvider` never re-checked token expiry during an open session; a session left open past expiration stayed "logged in" until the next reload, with every API call failing with a generic error in the meantime. Now polled every 30s. ✅ Done
- [x] **Inconsistent error handling / no confirmation on destructive actions** — `StaffPage`'s toggle/remove and `BookingsPage`'s status-change handlers had no try/catch (unlike their sibling `onSubmit`s); removing staff, deleting a product, or cancelling a booking fired immediately with no "are you sure?". ✅ Done
- [x] **No loading indicator** — `StaffPage`/`BookingsPage`/`ProductsPage`'s tables showed a blank table with no feedback during initial load, indistinguishable from "genuinely empty." ✅ Done
- [x] **`apps/admin`'s `RequireAuth` checked only `isAuthenticated`, not `superAdmin`** — since `/auth/login` is shared across every account type, a Business Owner's own valid token previously passed straight through to the admin shell (the backend independently rejects any actual write, but the app's own gate should say so). ✅ Done
- [x] **Super Admin had no UI, curl-only** (TASK-009's original gap) — built `apps/admin`'s real `/businesses` page: list, create, suspend/reactivate, create-owner dialog, wired to the backend endpoints that already existed. ✅ Done

## Milestone 7 — Customer Accounts

- [ ] **TASK-025** — `Customer` register/login on `apps/website` (separate from staff-side auth), JWT session scoped to one business.
- [ ] **TASK-026** — Guest booking/checkout stays fully supported (never forced login); a logged-in Customer's bookings/orders link to their account and pre-fill their details.
- [ ] **TASK-027** — Customer-facing "My Bookings" / "My Orders" history page.

## Milestone 8 — UI Polish Pass

- [ ] **TASK-028** — Full visual/UX QA across `apps/website` (booking, shop, cart, customer account), `apps/portal`, and `apps/admin` — spacing, mobile responsiveness, empty/loading/error states, consistent with the existing design system.

---

## Open questions (revisit before the milestone they block)

- ~~**M6**: Does the 3D-printing business also need appointment booking...~~ — resolved: yes, both. `printforge-3d` has `commerceEnabled: true` **and** `bookingEnabled: true` (a free design-consultation service), proving a business isn't forced to pick one.
- **M7**: Customer accounts are scoped per-business for v1 (register separately on each business's site) — flag if a unified cross-business platform identity is actually wanted; it's a materially bigger change.
- **Deferred, not forgotten**: no live payment gateway (Razorpay/Stripe) anywhere in this plan, including M6's online checkout — `Sale.paymentMethod` just records cash/card/UPI/other, selected by the customer, never actually charged. Matches `ROADMAP.md` Phase 6 already being separate from booking/billing. Say the word if checkout actually needs to take real payments.
