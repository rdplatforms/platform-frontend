# Business Portal (`apps/portal`)

Where a Business Owner or Staff member logs in to manage **their own**
business — as opposed to `apps/admin`, which manages every business on
the platform. See [TASKS.md](../TASKS.md) Milestone 2 (TASK-010/011) and
Milestone 3 (TASK-015, bookings) for where this fits, and
[future-admin.md](future-admin.md) for why `apps/admin` deliberately
doesn't work this way.

This replaced the interim localStorage `/dashboard` on `apps/website`
(TASK-019) once real booking/billing functionality landed here — see
[adr/0012-real-billing-supersedes-localstorage-dashboard.md](adr/0012-real-billing-supersedes-localstorage-dashboard.md)
for the full reasoning and [adr/0007-per-business-owner-dashboard.md](adr/0007-per-business-owner-dashboard.md)
for why the interim version looked the way it did.

## Domain resolution: `Business.portalDomains`

The portal is scoped to **exactly one business per hostname**, the same
shape as the public website (`apps/website`) — just a different field:
`Business.domains` for the public site, `Business.portalDomains` for the
portal. A business can point `admin.theirsite.com`, `console.theirsite.com`,
or whatever subdomain they want at the portal; both resolve independently,
so a hostname is never ambiguous between the two apps.

- Type: `Business.portalDomains?: string[]` (`packages/types/src/business.ts`)
- Resolver strategy: `hostnamePortalResolver` (`packages/business/src/resolvers/HostnamePortalResolver.ts`)
- Singleton: `portalBusinessResolver` (`packages/business/src/BusinessResolver.ts`) —
  same `BusinessResolver` class the website uses, just with
  `hostnamePortalResolver` swapped in for `hostnameBusinessResolver`.
  Query-param (`?business=slug`) and env-default strategies are shared
  with the website's resolver, so local testing works the same way:
  `http://localhost:5175/?business=swami-hair-salon`.
- `BusinessProvider` (`@rdplatforms/providers`) takes an optional
  `resolver` prop for this — `AppProviders` passes it through, so
  `apps/portal`'s `App.tsx` is just
  `<AppProviders resolver={portalBusinessResolver}>`, otherwise
  identical to how `apps/website` composes providers (same per-business
  theme engine, same locale support).

## Auth

Logs in against the same backend endpoint as `apps/admin`
(`POST /auth/login` — see `../platform-backend/README.md`'s Auth section) since
Business Owner/Staff accounts are the same `User`/`BusinessMembership`
model as Super Admin, just without `isSuperAdmin`. `apps/portal/src/auth/`
mirrors `apps/admin/src/auth/` (localStorage token, same tradeoffs —
see that app's `adminAuth.ts` comment) with one addition:
**`RequireAuth` here checks two things, not one.**

1. Does this hostname even resolve to a business (`portalBusinessResolver`)?
   If not, there's nothing to log into — shown as an error, not a
   redirect to `/login`.
2. Is the signed-in user actually a member of _this_ business (or a
   Super Admin)? A valid token issued for a _different_ business must
   not grant access here — checked client-side via
   `hasMembership(user, business.id)` (`portalAuth.ts`) against the
   JWT's own `memberships` claim, the same claim
   `AuthenticatedUser.hasMembership`/`canAccessBusiness` check
   server-side. Neither check alone is sufficient: "has a valid token"
   is not "has access to _this_ business."

## Staff management (TASK-011)

`/staff` — an Owner-only page (or Super Admin; a Staff member sees an
"Owners only" message instead, both client-side via `StaffPage.tsx`'s
own role check and server-side via `StaffController`'s authorization,
which is the one that actually matters). Invite a staff member (email +
temporary password + display name), toggle their `canViewFullAnalytics`
permission, or remove them entirely — removal deletes their
`BusinessMembership` for _this_ business only, not their `User` account
(they could belong to another business, or be re-invited later, which
just finds-or-creates by email rather than erroring).

`apps/portal/src/api/staffApi.ts` talks to the backend directly (plain
`fetch`, bearer token) rather than through `@rdplatforms/services`'s
`*DataSource` pattern — that pattern is for the public, read-only
content every business exposes, not this auth-scoped, write-capable,
portal-specific API.

## Bookings (TASK-015)

`/bookings` — visible to any authenticated member of the business
(Owner or Staff, not Owner-only like `/staff`), listing every `Booking`
(TASK-013) for this business, newest-first by date/time, with a status
dropdown per row and a form to add a walk-in/phone-in booking. Reuses
the public site's own `useServices` hook (`@rdplatforms/hooks`) for the
service picker — the same real service catalog the website's
Appointment form uses, never free text.

Creating a booking here always sends the bearer token, so the backend
records `source: STAFF`/`status: CONFIRMED` immediately — see
`BookingController`'s own comment on how ONLINE vs. STAFF is decided
(never trusted from the request body). `apps/portal/src/api/bookingsApi.ts`
follows the exact same direct-fetch pattern as `staffApi.ts`.

## Billing (TASK-016/017)

`/billing` — visible to any authenticated member (Owner or Staff), same
as `/bookings`. A `Sale` is a bill: one or more line items (service or
product, quantity, unit price, a flat-amount discount, category), a
payment method, an optional customer name, and an optional link to an
existing `Booking` — linking one marks it COMPLETED as a side effect of
billing it (see `platform-backend`'s `SaleController`). The item picker
reuses `useServices` (same real catalog `/bookings` uses) to prefill a
line item, but items aren't required to come from the catalog — a
custom label/category/price is just as valid, matching how
`SaleController` treats `category` as free text, not a foreign key.

`apps/portal/src/api/salesApi.ts` follows the same direct-fetch pattern
as `staffApi.ts`/`bookingsApi.ts`. Its `listSales` throws a distinct
`SalesAccessDeniedError` on a 403 specifically (see "Analytics" below)
so callers can tell "you don't have the permission" apart from a real
failure — `BillingPage`'s own "recent bills" list on this same page
uses that to fail silently rather than showing an error a Staff member
without the permission would find confusing (they can still create
bills; they just don't see the history).

## Analytics (TASK-018)

`/analytics` — Today/Week/Month/All-Time totals plus a category
breakdown (selectable period), computed **client-side** from the full
sales list — same shape as the old dashboard's `SummaryCards`, just
fed by the real `Sale` model now
(`@rdplatforms/utils`' `saleAnalytics.ts`: `sumSaleTotals`,
`filterSalesSince`, `categoryBreakdown`, reusing the generic
`startOfDay`/`startOfWeek`/`startOfMonth` helpers `sales.ts` always had —
those were never `SaleEntry`-specific).

This is the one endpoint gated beyond "just a member": `GET
/businesses/{id}/sales` requires the Owner role (or Super Admin) or a
Staff member with `canViewFullAnalytics` (TASK-011) — enforced by
`SaleController` server-side, not just hidden in the UI, since reading
the sales list _is_ reading the business's analytics. A Staff member
without the permission sees a plain explanatory message here instead of
a dashboard, not an error.

## Local testing

```bash
# Terminal 1 — backend (a sibling checkout, ../platform-backend)
cd ../platform-backend
docker compose up -d
./gradlew bootRun --args='--spring.profiles.active=seed-super-admin --app.seed.super-admin-email=you@example.com --app.seed.super-admin-password=...'
./gradlew bootRun   # in a fresh terminal, or after the seed run exits

# Create an owner for a business (see ../platform-backend/README.md's Super Admin section)
curl -X POST http://localhost:8081/businesses/swami-hair-salon/owners \
  -H "Content-Type: application/json" -H "Authorization: Bearer <super-admin-token>" \
  -d '{"email":"owner@example.com","password":"...","displayName":"Owner Name"}'

# Terminal 2 — portal
cd apps/portal
VITE_API_BASE_URL=http://localhost:8081 pnpm dev
# open http://localhost:5175/?business=swami-hair-salon
```

Port **5175** — 5173 is the website, 5174 is admin.
