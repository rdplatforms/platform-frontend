# rdplatforms backend

Spring Boot API for the platform. See [../TASKS.md](../TASKS.md) for the
build-out plan and [../docs/future-backend-contract.md](../docs/future-backend-contract.md)
for the contract this implements against the existing frontend.

## Requirements

- Java 17
- Docker (for local Postgres, and for tests — see below)
- Nothing else to install — the project uses the Gradle wrapper (`./gradlew`), which downloads the matching Gradle version on first run.

## Running locally

Start Postgres first:

```bash
cd backend
docker compose up -d
```

This runs Postgres on **host port 5433** (not 5432 — avoids colliding with
any other local Postgres) with database/user/password all `rdplatforms`.
Then:

```bash
./gradlew bootRun
```

Starts on **port 8081** (not 8080 — chosen to avoid colliding with other
local dev tooling). Flyway migrations (`src/main/resources/db/migration/`)
run automatically on startup. Verify it's up:

```bash
curl http://localhost:8081/actuator/health
# {"groups":["liveness","readiness"],"status":"UP"}
```

To have a frontend app actually call this instead of `static-data/*.json`,
set `VITE_API_BASE_URL=http://localhost:8081` when running it (see
`packages/services/src/dataSource/activeDataSource.ts`). CORS
(`config/CorsConfig.java`) defaults to allowing all three apps' Vite dev
server ports (`5173` website, `5174` admin, `5175` portal) — override
with `app.cors.allowed-origins` (comma-separated) for deployed frontend
origins.

## Building and testing

```bash
./gradlew build
```

**Does not need `docker compose up`** — tests use Testcontainers, which
starts its own throwaway Postgres container per test run (needs Docker
running, but not the compose stack above). Produces a runnable jar under
`build/libs/`.

## Project layout

```
backend/
├── build.gradle                        Dependencies and plugins
├── docker-compose.yml                  Local Postgres for `bootRun`
├── src/main/java/com/rdplatforms/backend/
│   ├── BackendApplication.java         Entry point
│   ├── auth/                           User/BusinessMembership/Customer, JWT, /auth/*
│   ├── config/                         CorsConfig, SecurityConfig
│   ├── business/                       Business entity + repository
│   ├── content/                        Service/Gallery/Testimonial/Faq/Team/
│   │                                   Theme/Seo/Settings/Page entities + repos
│   └── importer/                       One-time static-data → Postgres import
├── src/main/resources/
│   ├── application.properties
│   └── db/migration/                   Flyway migrations (schema source of truth)
└── src/test/java/...                   Tests (Testcontainers-backed)
```

This will grow module-by-module as [../TASKS.md](../TASKS.md) progresses
(booking/billing in Milestones 3/4, etc.) — no speculative structure has
been added ahead of the task that needs it.

## Data model: why entities are just `id` + `data` (JSONB)

Every content entity (`ServiceItem`, `GalleryItem`, `BusinessTheme`, ...)
has a handful of native columns for lookup (`id`, `business_id`) and one
`data JSONB` column holding the **entire record**, verbatim, as it exists
in `static-data/*.json` today. This is deliberate for this milestone: it
guarantees field-for-field fidelity with the corresponding type in
`packages/types/src/*.ts` by construction — the response literally _is_
that JSON — instead of hand-modeling every nested union type
(`LocalizableText`, `BusinessHours[]`, `SectionConfig[]`, `ThemeTypography`)
into JPA embeddables, which would be a lot of fragile boilerplate for data
that's always read and written as a whole document from the frontend
anyway.

**This should evolve** once real write/admin CRUD needs field-level
validation or partial updates (Milestone 2+) — at that point, normalize
whichever fields actually need it (e.g. `BusinessHours` as its own table
once booking logic needs to query it), not before.

## Importing static-data/*.json

One-time, idempotent (safe to re-run after editing `static-data/*.json` —
every upsert is keyed by the same id/businessId+path already used there):

```bash
docker compose up -d   # if not already running
./gradlew bootRun --args='--spring.profiles.active=import-static-data'
```

Logs a per-file record count, then exits (this is a one-shot tool, not a
server). Reads from `../static-data` by default — override with
`app.import.static-data-dir` if running from a different working
directory.

## Auth (Milestone 2)

Stateless JWT — no sessions. `GET /businesses/**` and `/actuator/**`
stay public; everything else (including POST/PATCH on `/businesses/**`
— see TASK-009 below) requires `Authorization: Bearer <token>`.

**Roles**: `User` (internal — Super Admin is `isSuperAdmin=true`,
global; Business Owner/Staff via `BusinessMembership`, one row per
business) and `Customer` (a business's own public-site account — data
model only so far, no login endpoint yet; see TASKS.md Milestone 6).
These are deliberately separate tables/realms, not one unified "account"
concept.

There's no self-registration — bootstrap the first Super Admin:

```bash
docker compose up -d   # if not already running
./gradlew bootRun --args='--spring.profiles.active=seed-super-admin --app.seed.super-admin-email=you@example.com --app.seed.super-admin-password=...'
```

Then log in and use the token:

```bash
curl -X POST http://localhost:8081/auth/login -H "Content-Type: application/json" \
  -d '{"email":"you@example.com","password":"..."}'
# {"token":"..."}

curl http://localhost:8081/auth/me -H "Authorization: Bearer <token>"
# {"userId":"...","email":"...","superAdmin":true,"memberships":[]}
```

A token embeds every `BusinessMembership` (businessId/role/
canViewFullAnalytics) so a protected endpoint can authorize without a
DB round-trip — see `AuthenticatedUser.hasMembership`/`canAccessBusiness`.
`app.jwt.secret` in `application.properties` is a **dev-only** generated
value — override it for any real deployment, never commit a real one.

### Super Admin platform management (TASK-009)

Every endpoint below checks `AuthenticatedUser.superAdmin()` itself (not
just "is there a valid token") and returns 403 for anyone else,
including a Business Owner/Staff member:

```bash
# Create a business tenant
curl -X POST http://localhost:8081/businesses -H "Content-Type: application/json" \
  -H "Authorization: Bearer <super-admin-token>" \
  -d '{"slug":"new-salon","displayName":"New Salon","legalName":"New Salon LLC","category":"salon","phone":"555-0100"}'
# 201, full Business JSON — 409 if the slug already exists, 400 for an unrecognized category

# Suspend/reactivate a tenant (BusinessResolver already refuses to
# resolve a business with isActive: false — see docs/business-model.md)
curl -X PATCH http://localhost:8081/businesses/new-salon/status -H "Content-Type: application/json" \
  -H "Authorization: Bearer <super-admin-token>" -d '{"isActive":false}'

# Create that business's first Business Owner
curl -X POST http://localhost:8081/businesses/new-salon/owners -H "Content-Type: application/json" \
  -H "Authorization: Bearer <super-admin-token>" \
  -d '{"email":"owner@new-salon.example","password":"...","displayName":"Owner Name"}'
# 201 — that email can now log in via /auth/login and gets an OWNER membership for new-salon
```

A created `Business` gets sensible empty defaults for everything not in
the request (`hours: []`, `social: {}`, `domains: []`, blank
`description`/`logoUrl`) — matching every other field the frontend's
`Business` type expects, so it round-trips through the existing
read-only endpoints (TASK-004) with no special-casing.

Creating a `Business`/`Owner` twice for the same slug/email is
idempotent, not a raw 500 — the second call updates the existing
row/membership instead of hitting the `UNIQUE` constraint directly.

### Business Owner staff management (TASK-011)

`AuthenticatedUser.superAdmin() || hasMembership(businessId, OWNER)` —
not Super Admin only this time, since it's the business's own Owner who
should manage their own Staff:

```bash
curl -X POST http://localhost:8081/businesses/new-salon/staff -H "Content-Type: application/json" \
  -H "Authorization: Bearer <owner-token>" \
  -d '{"email":"staff@new-salon.example","password":"...","displayName":"Staff Name","canViewFullAnalytics":false}'
# 201 — same idempotent re-invite behavior as creating an Owner

curl http://localhost:8081/businesses/new-salon/staff -H "Authorization: Bearer <owner-token>"
# [{"membershipId":"...","userId":"...","email":"...","displayName":"...","canViewFullAnalytics":false}]

curl -X PATCH http://localhost:8081/businesses/new-salon/staff/<membershipId> -H "Content-Type: application/json" \
  -H "Authorization: Bearer <owner-token>" -d '{"canViewFullAnalytics":true}'

curl -X DELETE http://localhost:8081/businesses/new-salon/staff/<membershipId> -H "Authorization: Bearer <owner-token>"
# 204 — removes this business's membership only, not the underlying User account
```

A signed-in Staff member's _existing_ token still shows their old
membership until it expires and they log in again — tokens embed
memberships at issue time (see above), they aren't re-checked live on
every request. Removing someone's access is real and immediate against
the database, but a token issued before the removal is only as current
as when it was issued.
