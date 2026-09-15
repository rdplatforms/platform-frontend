# Deployment

The long-term shape below is still not implemented — this documents it so
early decisions (separate admin app, hostname-based resolution, services
abstraction) are made with it in mind. What's actually live today is a
set of smaller, per-business interim deployments — see
[Deployment options today](#deployment-options-today) if you're looking
for how to actually get a business's site online right now.

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

## Deployment options today

Before there are real custom domains to route by hostname (the long-term
shape above), each business gets deployed as its **own separate site**,
forced to a single business via the `VITE_DEFAULT_BUSINESS_SLUG` env var
rather than `Business.domains[]` matching — see
[adr/0009-netlify-interim-deployment.md](adr/0009-netlify-interim-deployment.md)
and [adr/0014-multi-host-deployment-templates.md](adr/0014-multi-host-deployment-templates.md).
Every host below deploys the same thing: a static build of
`apps/website`, config'd only by env vars — no host-specific code.

**Every business a site needs, together:**

| Env var                                                  | Tier   | Doc                                  |
| -------------------------------------------------------- | ------ | ------------------------------------ |
| `VITE_DEFAULT_BUSINESS_SLUG`                             | —      | this doc                             |
| `VITE_APPS_SCRIPT_URL` or `VITE_API_BASE_URL` (optional) | 2 or 3 | [backend-tiers.md](backend-tiers.md) |
| `VITE_GOOGLE_ANALYTICS_ID` (optional)                    | —      | [analytics.md](analytics.md)         |

Three hosts are supported today, all free at the scale a small local
business needs. Which one to use per business is a judgment call (see
[Picking a host](#picking-a-host)), not a fixed rule.

### Netlify

`netlify.toml` at the repo root carries only what's genuinely identical
across _every_ app deployed from this repo:

- **SPA redirect**: `/* → /index.html` (200) — every app here is a
  client-side-routed SPA, so this is safe to share
- **`NODE_VERSION`**: `20`

It deliberately does **not** set `[build] command`/`publish` — a
project-wide build command doesn't make sense once this repo deploys
more than one app (`apps/website` per business, `apps/rtsh-info`, ...),
and Netlify's own documented precedence is that `netlify.toml` **always
overrides each site's own dashboard settings**, not the other way
around. An earlier version of this doc got that backwards (assumed
dashboard settings would win), which silently broke the first attempt
at a second site (`rtsh-info`) built from this repo — its dashboard
build command/publish directory were configured correctly but
`netlify.toml`'s (`apps/website`-only) command overrode them every
build, so it kept deploying the wrong app. See
[rtsh-info.md](rtsh-info.md#deployment) for that specific case.

**Many free sites from one repo, each with its own Build command.**
Netlify's free tier has no limit on the number of sites — each is its
own "Add new site" import of this same repo, with its own env vars
_and now its own explicit Build command/Publish directory_, and gets
its own free `<site-name>.netlify.app` subdomain (e.g.
`swami-hair-salon.netlify.app`, `rtsh-info.netlify.app`).

**Per-site setup** (repeat once per business/app):

1. Netlify → "Add new site" → "Import an existing project" → GitHub →
   `rdplatforms/platform-frontend`.
2. Site settings → Build & deploy → **explicitly set**:
   - **Build command**: `pnpm install && pnpm build:website` (a
     business) or `pnpm install && pnpm build:<app>` (a different app,
     e.g. `build:rtsh-info`)
   - **Publish directory**: `apps/website/dist` or `apps/<app>/dist`
     to match
   - Leave "Base directory" empty/repo root either way — it's a pnpm
     workspace, the build needs the whole monorepo present
3. Site environment variables → add whichever table above applies
   (a business's `VITE_DEFAULT_BUSINESS_SLUG` etc., or nothing at all
   for a platform-owned app like `rtsh-info`).
4. Deploy, then rename the site (Site settings → Site details → Change
   site name) to something recognizable.

**If a site was created before this changed** (i.e. it was relying on
`netlify.toml`'s now-removed `[build]` block instead of its own
explicit dashboard settings — this includes the original Swami Hair
Salon site): go set its Build command/Publish directory explicitly too,
via step 2 above, before its next deploy — otherwise its _next_ build
has nothing telling it what to build at all.

Connecting GitHub to Netlify is a one-time OAuth step only whoever
administers the Netlify account can do in Netlify's own dashboard.

### Vercel

`vercel.json` at the repo root carries only the SPA fallback rewrite —
same reasoning as `netlify.toml` above, and the same real bug that
motivated it: `vercel.json`'s `buildCommand`/`outputDirectory`
**override each project's own dashboard settings**, not the other way
around (Vercel's own documented precedence). A project-wide build
command doesn't make sense once this repo deploys more than one app, so
it isn't set here — every project configures its own Build
command/Output directory entirely via its own dashboard.

**Many free sites from one repo**, same model as Netlify: Vercel's free
Hobby plan has no limit on the number of _projects_, each importing this
same repo with its own env vars _and its own explicit Build
command/Output directory_, each getting its own free
`<project-name>.vercel.app` subdomain (e.g. `swami-hair-salon.vercel.app`,
`rtsh-info.vercel.app`).

**Per-project setup** (repeat once per business/app):

1. Vercel → "Add New..." → "Project" → import
   `rdplatforms/platform-frontend` (leave "Root Directory" as the repo
   root — it's a pnpm workspace, so the build needs the whole monorepo
   present).
2. Project → Settings → General → **explicitly set**:
   - **Build Command**: `pnpm install && pnpm build:website` (a
     business) or `pnpm install && pnpm build:<app>` (a different app)
   - **Output Directory**: `apps/website/dist` or `apps/<app>/dist` to
     match
3. Project → Settings → Environment Variables → add the table above (a
   business's env vars, or nothing at all for a platform-owned app).
4. Deploy, then rename the project (Settings → General → Project Name) to
   set its `<name>.vercel.app` subdomain.

### GitHub Pages

The odd one out: a GitHub Pages site is tied to one repo (and, if you add
a custom domain, exactly one). It can't host many businesses out of one
shared repo the way Netlify/Vercel can, so instead **each business gets
its own small repo** whose only job is a GitHub Actions workflow that
builds `platform-frontend` on that business's behalf and deploys the
result. The reusable build/deploy logic itself lives once, in this repo,
at
[.github/workflows/deploy-business-github-pages.yml](../.github/workflows/deploy-business-github-pages.yml)
— nothing is duplicated per business except a handful of workflow input
values.

**Per-business setup**: follow
[templates/github-pages-business-repo/README.md](../templates/github-pages-business-repo/README.md)
— create a new public repo, copy the template's `deploy.yml` in with this
business's slug, enable Pages (Settings → Pages → Source → GitHub
Actions), push.

**Free URL shape**, since this is the one host where it isn't automatic:

- No custom domain → `<org>.github.io/<repo-name>/` (a "project page").
  This is a **sub-path**, not a subdomain — GitHub only gives one
  clean root `<org>.github.io` per account/org, so with several
  businesses on GitHub Pages they share that org and each gets its own
  path instead. The build needs `base-path: /<repo-name>/` set
  (already wired into the workflow input) so its assets resolve
  correctly under that sub-path.
- Custom domain (still free on GitHub's side — you only pay for the
  domain itself elsewhere) → serves from the domain's root, no sub-path,
  set `base-path: /`. This is the closer analogue to Netlify/Vercel's
  clean subdomains.

### Picking a host

- **Netlify or Vercel** for the common case — a clean free subdomain with
  zero GitHub Actions setup, matching what's already live for Swami Hair
  Salon.
- **GitHub Pages** when you specifically want the deployment to live in
  its own repo (e.g. handing a business or its own dev partial ownership
  of _just_ their deployment config, without touching `platform-frontend`
  itself), or you're already out of patience for Netlify/Vercel's UI —
  the tradeoff is real setup work (a new repo, a workflow file, no clean
  free subdomain without a custom domain).

## CI/CD

- **Netlify/Vercel**: no GitHub Actions involved — each host's own git
  integration builds and deploys directly on every push to `main`. Not
  "CI" in the check-before-merge sense; there's no lint/typecheck/test
  gate before a deploy on either host today.
- **GitHub Pages**: real CI, via
  [.github/workflows/deploy-business-github-pages.yml](../.github/workflows/deploy-business-github-pages.yml)
  — a reusable workflow, called from each business's thin repo (see
  above). It builds and deploys only; it does not currently run
  `pnpm lint`/`pnpm typecheck`/`pnpm test` first.
- Neither of the above gates a deploy on the test suite passing. Adding
  a real pre-deploy CI gate (`pnpm typecheck && pnpm lint && pnpm test`
  before any of the above) is a reasonable follow-up, not yet built.

Both `apps/website` and `apps/admin` are static builds (no SSR) — any
static host or CDN works; hostname-based business resolution happens
entirely client-side at runtime via `BusinessResolver`, so no
server-side routing logic is required beyond serving `index.html` for
all paths (SPA fallback) — handled per-host above (Netlify's
`[[redirects]]`, Vercel's `rewrites`, GitHub Pages' `404.html` copy).

**Moving to the long-term shape**: once a business has a real custom
domain, add it to that business's `domains[]` in `static-data/`, point
its DNS at wherever it's deployed (or migrate to a single shared
deployment), and the `VITE_DEFAULT_BUSINESS_SLUG` override becomes
redundant rather than required — hostname resolution takes over with no
code change.
