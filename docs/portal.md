# Business Portal (`apps/portal`)

Where a Business Owner or Staff member logs in to manage **their own**
business — as opposed to `apps/admin`, which manages every business on
the platform. See [TASKS.md](../TASKS.md) Milestone 2 (TASK-010/011) for
where this fits, and [future-admin.md](future-admin.md) for why
`apps/admin` deliberately doesn't work this way.

This will replace the interim localStorage `/dashboard` on
`apps/website` (see [business-dashboard.md](business-dashboard.md)) once
real booking/billing functionality lands here — TASK-012.

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
(`POST /auth/login` — see `backend/README.md`'s Auth section) since
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

## Local testing

```bash
# Terminal 1 — backend
cd backend
docker compose up -d
./gradlew bootRun --args='--spring.profiles.active=seed-super-admin --app.seed.super-admin-email=you@example.com --app.seed.super-admin-password=...'
./gradlew bootRun   # in a fresh terminal, or after the seed run exits

# Create an owner for a business (see backend/README.md's Super Admin section)
curl -X POST http://localhost:8081/businesses/swami-hair-salon/owners \
  -H "Content-Type: application/json" -H "Authorization: Bearer <super-admin-token>" \
  -d '{"email":"owner@example.com","password":"...","displayName":"Owner Name"}'

# Terminal 2 — portal
cd apps/portal
VITE_API_BASE_URL=http://localhost:8081 pnpm dev
# open http://localhost:5175/?business=swami-hair-salon
```

Port **5175** — 5173 is the website, 5174 is admin.
