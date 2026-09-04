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
- [ ] **TASK-009** — Super Admin capability: create/suspend a `Business` tenant; create that business's first Business Owner account.
- [ ] **TASK-010** — Scaffold `apps/portal` (new app): Business Owner/Staff login, resolves the current business via `Business.portalDomains[]`.
- [ ] **TASK-011** — Business Owner capability in `apps/portal`: invite/create/deactivate Staff accounts; per-staff "can view full analytics" toggle.
- [ ] **TASK-012** — Remove the interim localStorage `/dashboard` + passcode gate from `apps/website` now that `apps/portal` covers it; update `docs/business-dashboard.md` to reflect the real portal (or retire the doc in favor of a new `docs/portal.md`).

## Milestone 3 — Real Booking

- [ ] **TASK-013** — `Booking` entity + endpoints (create/list/update status: pending → confirmed → completed/cancelled/no_show).
- [ ] **TASK-014** — `apps/website`'s Appointment section POSTs to the real endpoint (WhatsApp message still fires too, as a notify side-effect, not the only record).
- [ ] **TASK-015** — `apps/portal` booking queue: today's/upcoming bookings, change status, add a walk-in/phone-in booking manually.

## Milestone 4 — Billing/POS + Analytics

- [ ] **TASK-016** — Unified `Sale` entity (line items with category, payment method, optional linked `Booking`, `source: staff | online`, `createdByUserId`) + endpoints — supersedes `SaleEntry`/`SalesDataSource`.
- [ ] **TASK-017** — `apps/portal` itemized bill creation UI (service/product picker, qty, price, discount, payment method), optionally linking to and fulfilling an existing `Booking`.
- [ ] **TASK-018** — `apps/portal` analytics: Today/Week/Month totals + category-wise breakdown, visible to Owner and any Staff granted the permission from TASK-011.
- [ ] **TASK-019** — Retire `SaleEntry`/`LocalStorageSalesDataSource`/the old dashboard's sales UI; migrate `docs/business-dashboard.md` content into the new portal docs.

## Milestone 5 — 3D Printing Business + E-commerce

- [ ] **TASK-020** — `Product` type + `ProductDataSource`/`ProductService`/hooks; `BusinessSettings.commerceEnabled` capability flag (not category-gated — same pattern as `bookingEnabled`).
- [ ] **TASK-021** — New `shop` section type (product grid) + a dedicated cart/checkout route in `apps/website`.
- [ ] **TASK-022** — Client-side `Cart` (localStorage, no backend cart entity) + checkout flow that creates a `Sale(source: 'online')`.
- [ ] **TASK-023** — `apps/portal` product catalog CRUD for Owner/Staff-with-permission.
- [ ] **TASK-024** — New demo business #4 (3D printing, `category: 'ecommerce'` — already a reserved `BusinessCategory` value, no type change needed): full content, products, theme; demoed end-to-end (browse → cart → checkout → shows up in Milestone 4's analytics).

## Milestone 6 — Customer Accounts

- [ ] **TASK-025** — `Customer` register/login on `apps/website` (separate from staff-side auth), JWT session scoped to one business.
- [ ] **TASK-026** — Guest booking/checkout stays fully supported (never forced login); a logged-in Customer's bookings/orders link to their account and pre-fill their details.
- [ ] **TASK-027** — Customer-facing "My Bookings" / "My Orders" history page.

## Milestone 7 — UI Polish Pass

- [ ] **TASK-028** — Full visual/UX QA across `apps/website` (booking, shop, cart, customer account), `apps/portal`, and `apps/admin` — spacing, mobile responsiveness, empty/loading/error states, consistent with the existing design system.

---

## Open questions (revisit before the milestone they block)

- **M5**: Does the 3D-printing business also need appointment booking (e.g. "book a design consultation"), or is it purely browse → cart → checkout, with walk-in billing available too?
- **M6**: Customer accounts are scoped per-business for v1 (register separately on each business's site) — flag if a unified cross-business platform identity is actually wanted; it's a materially bigger change.
- **Deferred, not forgotten**: no live payment gateway (Razorpay/Stripe) anywhere in this plan — `Sale.paymentMethod` just records cash/card/UPI/other. Matches `ROADMAP.md` Phase 6 already being separate from booking/billing. Say the word if checkout actually needs to take real payments before M5 ships.
