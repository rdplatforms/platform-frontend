# 0012: Real, Backend-Persisted Billing Supersedes the localStorage Dashboard

## Status

Accepted — supersedes [0007](0007-per-business-owner-dashboard.md).

## Context

ADR 0007 shipped a per-business owner dashboard as a stopgap: no backend
existed yet, so sales were logged as a single-line-item `SaleEntry` per
record, stored in the browser's `localStorage`, gated by a plaintext
passcode. Both tradeoffs were explicit and accepted at the time — ship
something useful with zero backend infrastructure — but were never meant
to be permanent (see ADR 0007's own "Consequences" section).

By TASKS.md Milestone 5, the prerequisites ADR 0007 was waiting on both
existed: a real backend (`platform-backend`, Milestone 1) and real
per-business-member auth (Milestone 2) via `apps/portal`.

## Decision

- A unified `Sale` entity replaces `SaleEntry` — a bill with one or more
  line items (quantity/unit price/discount/category each), not one
  record per item, matching how a walk-in customer is actually billed.
  Real backend table (`platform-backend`'s `sales`/`sale_items`), not
  `localStorage`.
- Billing and analytics move to `apps/portal` (`/billing`, `/analytics`)
  — replacing the `/dashboard` route in `apps/website` entirely, which
  is now deleted along with everything built only for it (`SaleEntry`,
  `SalesDataSource`, `LocalStorageSalesDataSource`, `SalesService`,
  `useSales`/`useCreateSale`/`useDeleteSale`,
  `BusinessSettings.dashboardPasscode`).
- Real auth (`apps/portal`'s JWT-based login, Milestone 2) replaces the
  plaintext passcode gate — the exact "real auth is a hard prerequisite"
  ADR 0007 called out.
- Reading sales (and therefore the Today/Week/Month/category analytics
  computed from that list) requires the Owner role or Staff with the
  `canViewFullAnalytics` permission (Milestone 2) — enforced server-side
  by `SaleController`, not just hidden in the UI. Logging a bill doesn't
  require that permission, since it doesn't require reading past sales.

## Consequences

- Sales data is no longer per-device — it's shared across every device
  an Owner/Staff member logs into, which was ADR 0007's whole
  known-and-accepted limitation, now resolved.
- The generic date-bucketing helpers ADR 0007's dashboard used
  (`startOfDay`/`startOfWeek`/`startOfMonth`, `packages/utils/src/sales.ts`)
  were never `SaleEntry`-specific and are kept, reused by the new
  analytics page's own totaling logic
  (`packages/utils/src/saleAnalytics.ts`).
- `docs/business-dashboard.md` is deleted; its still-relevant content
  (data model rationale, migration reasoning) is folded into
  [../portal.md](../portal.md)'s Billing/Analytics sections.
