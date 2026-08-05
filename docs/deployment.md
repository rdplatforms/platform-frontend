# Deployment (Future)

Not yet implemented — this documents the target shape so early decisions
(separate admin app, hostname-based resolution, services abstraction) are
made with it in mind.

## Shape

```
                         ┌─────────────────────────┐
                         │   api.rdplatforms.com    │   Spring Boot backend
                         │   (not in this repo)     │
                         └────────────┬─────────────┘
                                      │
                 ┌────────────────────┼────────────────────┐
                 │                    │                     │
     ┌───────────▼──────────┐ ┌───────▼────────┐  ┌─────────▼─────────┐
     │ admin.rdplatforms.com│ │ royalsalon.com  │  │ *.rdplatforms.dev │
     │  apps/admin build    │ │ apps/website    │  │ apps/website       │
     │                       │ │ build, resolved │  │ build, resolved by │
     │                       │ │ by hostname     │  │ hostname/subdomain │
     └───────────────────────┘ └─────────────────┘  └────────────────────┘
```

One frontend build of `apps/website`, deployed once, served for every
business's domain. `BusinessResolver` (see
[../ARCHITECTURE.md](../ARCHITECTURE.md)) is what makes a single build
render differently per hostname — there is no per-business build or
deploy.

## Domains

| Domain pattern                                         | Serves         | Resolution                                         |
| ------------------------------------------------------ | -------------- | -------------------------------------------------- |
| `admin.rdplatforms.com`                                | `apps/admin`   | N/A — single tenant-agnostic app                   |
| `api.rdplatforms.com`                                  | Backend        | N/A                                                |
| `<business>.rdplatforms.dev`                           | `apps/website` | Subdomain matches a `Business.domains[]` entry     |
| A business's own custom domain (e.g. `royalsalon.com`) | `apps/website` | Custom domain matches a `Business.domains[]` entry |

Adding a business's custom domain is a `Business.domains[]` update (today:
JSON; later: an admin action) plus the usual DNS/TLS provisioning for that
domain pointed at the same `apps/website` deployment — never a new
deployment.

## Environments

| Env        | Website default business                                       | Notes                                                                                             |
| ---------- | -------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| Local dev  | `VITE_DEFAULT_BUSINESS_SLUG` (`.env`) or `?business=` override | See `apps/website/.env.example`                                                                   |
| Staging    | TBD per staging domain mapping                                 | Should mirror production's hostname-based resolution                                              |
| Production | N/A — always resolved by real hostname                         | `?business=` override should be disabled or restricted in production once real users are involved |

## CI/CD (future)

Not implemented yet. Expected shape once it exists:

1. `pnpm install --frozen-lockfile`
2. `pnpm typecheck && pnpm lint && pnpm format:check && pnpm test`
3. `pnpm --filter @rdplatforms/website build` → deploy `apps/website/dist`
   to the website hosting target
4. `pnpm --filter @rdplatforms/admin build` → deploy `apps/admin/dist` to
   `admin.rdplatforms.com`

Both apps are static builds (no SSR) — any static host or CDN works;
hostname-based business resolution happens entirely client-side at runtime
via `BusinessResolver`, so no server-side routing logic is required beyond
serving `index.html` for all paths (SPA fallback).
