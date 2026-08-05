# Routes

The platform ships two separate single-page apps with independent routers.
They are deployed to separate subdomains (see
[docs/deployment.md](docs/deployment.md)) rather than sharing one router
under a `/admin` path — an admin console and a public business website have
different auth models, different themes, and scale independently.

## `apps/website`

Router: `apps/website/src/routes/router.tsx` (`react-router-dom`
`createBrowserRouter`, both routes lazy-loaded).

| Path | Component      | Notes                                                                                                                      |
| ---- | -------------- | -------------------------------------------------------------------------------------------------------------------------- |
| `/`  | `HomePage`     | Renders the resolved business's enabled sections via `SectionRenderer`, driven by `PageConfig` in `static-data/pages.json` |
| `*`  | `NotFoundPage` | Catch-all 404                                                                                                              |

Every demo business today only defines a single `/` page (see
`static-data/pages.json`). Adding a second page for a business is:

1. Add a new `PageConfig` entry (new `path`, its own `sections[]`) to that
   business's array in `static-data/pages.json`.
2. Add a matching route in `router.tsx` pointing at a page component that
   calls `usePageSections(business.id, '<path>')`.

No section component needs to change — `SectionRenderer` is path-agnostic.

Which business a request maps to is decided before routing even starts —
see [ARCHITECTURE.md](ARCHITECTURE.md#4-packagesbusiness--the-business-resolver).

## `apps/admin`

Router: `apps/admin/src/routes/router.tsx`, nested under `AdminLayout`
(sidebar + top bar shell).

| Path        | Component       | Status      |
| ----------- | --------------- | ----------- |
| `/` (index) | `DashboardPage` | Placeholder |
| `/pages`    | `PagesPage`     | Placeholder |
| `/media`    | `MediaPage`     | Placeholder |
| `/services` | `ServicesPage`  | Placeholder |
| `/business` | `BusinessPage`  | Placeholder |
| `/theme`    | `ThemePage`     | Placeholder |
| `/users`    | `UsersPage`     | Placeholder |
| `/settings` | `SettingsPage`  | Placeholder |

All admin routes are placeholders per the current phase — see
[ROADMAP.md](ROADMAP.md#phase-3--admin-🟡-scaffolded) and
[docs/future-admin.md](docs/future-admin.md) for what each will become.

## Deployment routing (future)

| Subdomain                                        | App                 | Notes                                              |
| ------------------------------------------------ | ------------------- | -------------------------------------------------- |
| Per-business custom domain / `*.rdplatforms.dev` | `apps/website`      | `Business.domains[]` maps a hostname to a business |
| `admin.rdplatforms.com`                          | `apps/admin`        | Single deployment, operates across all businesses  |
| `api.rdplatforms.com`                            | Spring Boot backend | Not part of this repo                              |
