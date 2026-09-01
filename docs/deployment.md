# Deployment

The long-term shape below is still not implemented — this documents it so
early decisions (separate admin app, hostname-based resolution, services
abstraction) are made with it in mind. What's actually live today is a
much smaller interim setup — see
[Current interim deployment (Netlify)](#current-interim-deployment-netlify)
first if you're looking for how the site is actually deployed right now.

## Long-term shape (future)

```
                         ┌─────────────────────────┐
                         │   api.rdplatforms.com    │   Spring Boot backend
                         │   (not in this repo)     │
                         └────────────┬─────────────┘
                                      │
                 ┌────────────────────┼────────────────────┐
                 │                    │                     │
     ┌───────────▼──────────┐ ┌───────▼────────┐  ┌─────────▼─────────┐
     │ admin.rdplatforms.com│ │ a client's own  │  │ *.rdplatforms.dev │
     │  apps/admin build    │ │ custom domain   │  │ apps/website       │
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

| Domain pattern                 | Serves         | Resolution                                         |
| ------------------------------ | -------------- | -------------------------------------------------- |
| `admin.rdplatforms.com`        | `apps/admin`   | N/A — single tenant-agnostic app                   |
| `api.rdplatforms.com`          | Backend        | N/A                                                |
| `<business>.rdplatforms.dev`   | `apps/website` | Subdomain matches a `Business.domains[]` entry     |
| A business's own custom domain | `apps/website` | Custom domain matches a `Business.domains[]` entry |

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

## Current interim deployment (Netlify)

Before there are real custom domains to route by hostname, each business
gets deployed as its **own separate Netlify site**, forced to a single
business via the `VITE_DEFAULT_BUSINESS_SLUG` env var rather than
`Business.domains[]` matching. This is a deliberate, temporary
simplification — see
[adr/0009-netlify-interim-deployment.md](adr/0009-netlify-interim-deployment.md).

`netlify.toml` at the repo root configures the build:

- **Build command**: `pnpm install && pnpm build:website` — builds only
  `apps/website` and its workspace dependencies, from the repo root (a
  monorepo needs the whole workspace present, not just the app's own
  folder).
- **Publish directory**: `apps/website/dist`
- **SPA redirect**: `/* → /index.html` (200), so client-side routes like
  `/dashboard` don't 404 on a direct link or refresh.

**Per-site setup** (repeat once per business you deploy):

1. In Netlify: "Add new site" → "Import an existing project" → connect
   GitHub → select `rdplatforms/platform-frontend`. Build settings are
   picked up from `netlify.toml` automatically.
2. Add one site environment variable: `VITE_DEFAULT_BUSINESS_SLUG=<slug>`
   (e.g. `swami-hair-salon`). Netlify's own domain
   (`<site-name>.netlify.app`) won't match any `Business.domains[]` entry,
   so resolution falls through to this env var — see
   [../ARCHITECTURE.md](../ARCHITECTURE.md#4-packagesbusiness--the-business-resolver).
3. Deploy. Rename the site (Site settings → Site details → Change site
   name) to something recognizable, e.g. `swami-hair-salon.netlify.app`.

Connecting GitHub to Netlify is a step only whoever administers the
Netlify account can do (it's an OAuth authorization in Netlify's own
dashboard) — it isn't something that can be done by editing this repo.

**Moving to the long-term shape**: once a business has a real custom
domain, add it to that business's `domains[]` in `static-data/`, point its
DNS at the Netlify site (or migrate to a single shared deployment), and
the `VITE_DEFAULT_BUSINESS_SLUG` override becomes redundant rather than
required — hostname resolution takes over with no code change.
