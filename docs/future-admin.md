# Future Admin

`apps/admin` is intentionally scaffolded, not built — routing and page
structure exist so real functionality has somewhere correct to land,
without speculative code sitting unused in the meantime. This document is
the spec for what each placeholder becomes.

## Current state

`AdminLayout` (`apps/admin/src/layout/AdminLayout.tsx`) provides the
sidebar/top-bar shell. Every route under it (`apps/admin/src/routes/router.tsx`)
renders a `PlaceholderPage` with a title, a "Coming Soon" badge, and a
one-line description of its future purpose. See [../ROUTES.md](../ROUTES.md)
for the full route table.

The admin runs its own fixed theme (`apps/admin/src/App.tsx`) rather than
the per-business theme engine — it manages every business at once, so
there is no single business context to theme against. A future "preview
this business's site" feature inside the Theme page would render inside an
iframe or isolated subtree using `createAppTheme` directly, not by
re-theming the whole admin shell.

## What each page becomes

| Page          | Becomes                                                                                                        | Backed by                                                       |
| ------------- | -------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------- |
| **Dashboard** | Platform health summary: active business count, recent content changes, system status                          | New aggregate endpoint(s), not a 1:1 `*Service` mapping         |
| **Pages**     | Enable/disable/reorder sections per business page — editing `PageConfig`/`SectionConfig` directly              | `PageDataSource` write endpoints                                |
| **Media**     | Upload/manage logos, gallery photos, service images                                                            | New media storage service (not modeled in `packages/types` yet) |
| **Services**  | CRUD for a business's service catalog                                                                          | `ServiceCatalogDataSource` write endpoints                      |
| **Business**  | Edit core identity: contact, hours, domains, social                                                            | `BusinessDataSource` write endpoints                            |
| **Theme**     | Adjust colors/typography/button style/border radius with a live preview rendered via the real `createAppTheme` | `ThemeDataSource` write endpoints                               |
| **Users**     | Manage platform operators and per-business access                                                              | Requires auth + roles (not built)                               |
| **Settings**  | Per-business operational toggles (currency, locale, timezone, booking, WhatsApp)                               | `SettingsDataSource` write endpoints                            |

## Prerequisites before any page goes from placeholder to real

1. **Authentication.** Nothing in the admin should call a write endpoint
   without a logged-in session — this blocks every page above except a
   read-only Dashboard.
2. **Write endpoints.** Every `*DataSource` interface in
   `packages/services/src/dataSource/types.ts` is read-only today
   (`list*`/`get*`). Admin functionality needs matching `create*`/`update*`/
   `delete*` methods added to those interfaces (and implemented by
   `HttpDataSource` — see [future-backend-contract.md](future-backend-contract.md)),
   not a separate, parallel admin-only data layer.
3. **Multi-business context.** The admin needs its own notion of "which
   business am I currently editing" — deliberately not
   `@rdplatforms/business`'s `BusinessResolver`, which resolves _one_
   business from a _public request's_ hostname. The admin instead needs an
   explicit business switcher (a dropdown/URL param over the full business
   list), since an operator moves between many businesses in one session.

## Non-goals

- The admin will not reuse `@rdplatforms/providers`'s `BusinessProvider`/
  `AppThemeProvider` as-is — those model "one business per page load,"
  which doesn't fit an operator switching between businesses. A parallel,
  explicit business-selection mechanism belongs in the admin app itself
  (or a new shared package if genuinely reusable later) rather than forcing
  the website's resolution model to fit both use cases.
