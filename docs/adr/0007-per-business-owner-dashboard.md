# 0007: Per-Business Owner Dashboard as a Route in `apps/website`, Backed by localStorage

## Status

Accepted

## Context

Each business needs a basic, owner-facing tool to track day-to-day sales
(services rendered, products sold) — separate from the platform-operator
`apps/admin` console, which manages every business at once (see ADR 0006)
and has no auth yet. The business owner only ever needs to see _their own_
business's numbers, and there's no backend yet to persist anything server-side.

## Decision

- The dashboard is a route (`/dashboard`) inside `apps/website`, not a
  feature of `apps/admin` or a new app. `apps/website` already resolves to
  exactly one business per domain via `BusinessResolver`, so the dashboard
  is automatically scoped to that business with no switcher needed.
- Data is stored via a new `SalesDataSource` interface — the platform's
  first **write-capable** data source — implemented today by
  `LocalStorageSalesDataSource`, namespaced per business in the browser's
  `localStorage`.
- Access is gated by a plaintext passcode stored in
  `BusinessSettings.dashboardPasscode`, remembered per tab via
  `sessionStorage`. This is explicitly **not** real authentication.

## Consequences

- Ships today, no backend required, and fits the existing services/hooks
  pattern exactly — `SalesService` → `useSales`/`useCreateSale`/
  `useDeleteSale`, same shape as every read-only content type.
- **localStorage is per-browser, per-device.** Sales logged on one device
  don't appear on another, and clearing site data deletes them. This is
  acceptable for a prototype and unacceptable for a business actually
  relying on it — see [../business-dashboard.md](../business-dashboard.md)
  for the planned MongoDB-backed migration, which reuses the exact
  `HttpDataSource` swap pattern from
  [0003](0003-static-json-behind-services-layer.md).
- **The passcode gate provides no real security.** It stops a casual
  visitor from seeing the form, not a determined one — the passcode ships
  in `static-data/settings.json`, in the client bundle. Real auth is a
  hard prerequisite before this dashboard (or `apps/admin`, per ADR 0006)
  handles anything that actually needs protecting.
- Because `SalesDataSource` is the first write path in the codebase, its
  shape (`create*`/`delete*` alongside `list*`) is the template the future
  `apps/admin` write endpoints (see `docs/future-admin.md`) should follow.
