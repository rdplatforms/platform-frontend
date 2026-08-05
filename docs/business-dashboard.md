# Business Owner Dashboard

A basic, owner-facing tool at `/dashboard` on each business's own site for
logging sales (services rendered, products sold) and seeing totals. See
[adr/0007-per-business-owner-dashboard.md](adr/0007-per-business-owner-dashboard.md)
for why it's shaped this way.

## What it does today

- **Log a sale** — service or product, name, quantity, unit price,
  optional customer name/note, date (defaults to today).
- **Totals** — Today / This Week / This Month / All Time, computed
  client-side from the full sales list.
- **Sales history** — newest first, with delete.

What it deliberately does _not_ do yet: edit an existing entry, a real
product catalog (products are free-text on the entry, not their own
type), reporting/exports, or multi-user access.

## Where it lives

`apps/website/src/dashboard/` — an app-local feature, not part of
`@rdplatforms/ui`, because it's specific to this one app's page
composition (see
[COMPONENT_GUIDELINES.md](../COMPONENT_GUIDELINES.md#where-a-component-belongs)).
It's a sibling route to `HomePage`
(`apps/website/src/routes/router.tsx`), not linked from the public
`Navbar` — an owner reaches it by navigating to `<their-domain>/dashboard`
directly.

```
apps/website/src/dashboard/
├── dashboardAuth.ts       sessionStorage helpers for the passcode gate
├── DashboardGate.tsx       passcode form; renders children once unlocked
├── DashboardPage.tsx       composes gate + content, top bar with logout
├── StatCard.tsx            one totals tile
├── SummaryCards.tsx        the four StatCards, computed from the sales list
├── SaleForm.tsx            React Hook Form + Zod entry form
└── SalesHistoryList.tsx    newest-first list with delete
```

Because `apps/website` already resolves to exactly one business per
domain, none of this needs a business switcher — `useBusiness()` gives it
the one business it's already scoped to.

## Data model and access

- Type: `SaleEntry` (`packages/types/src/commerce.ts`) — `kind: 'service'
| 'product'`, `label`, `quantity`, `unitPrice`, `currency`, optional
  `customerName`/`note`, `occurredAt` (owner-entered date),
  `createdAt` (system-assigned, for ordering).
- Data source: `SalesDataSource`
  (`packages/services/src/dataSource/types.ts`) —
  `listSalesByBusiness`/`createSale`/`deleteSale`. This is the platform's
  **first write-capable** data source; every other `*DataSource` so far has
  been read-only.
- Implementation: `LocalStorageSalesDataSource`
  (`packages/services/src/dataSource/LocalStorageDataSource.ts`) — reads
  and writes a JSON array per business under
  `rdplatforms:sales:<businessId>` in `localStorage`. It takes an
  injectable `StorageLike` so tests run against an in-memory fake instead
  of a real browser API.
- Service: `SalesService` (`packages/services/src/SalesService.ts`), the
  same thin-wrapper-over-a-data-source pattern as every other service.
- Hooks: `useSales`, `useCreateSale`, `useDeleteSale`
  (`packages/hooks/src/`) — TanStack Query, with the two mutations
  invalidating the `['sales', businessId]` query on success so the list and
  totals stay in sync without manual refetching.

## The localStorage tradeoff

**localStorage is per-browser, per-device.** A sale logged on the owner's
laptop won't show up on their phone, and clearing browser data deletes
everything. That's a deliberate, temporary tradeoff to ship something
useful with zero backend infrastructure — not a recommendation to rely on
it for real bookkeeping.

### Migrating to MongoDB Atlas (or any real backend)

A browser can never talk to MongoDB directly — there's no secure driver
for that, so a small API always sits in front of it (Express, a serverless
function, or a slice of the eventual Spring Boot backend from
[future-backend-contract.md](future-backend-contract.md)). The migration
is the same shape already documented there:

1. Stand up write endpoints matching `SalesDataSource`'s three methods
   (`GET /businesses/{id}/sales`, `POST /businesses/{id}/sales`, `DELETE
/businesses/{id}/sales/{saleId}`), backed by MongoDB.
2. Implement an `HttpSalesDataSource` against the same `SalesDataSource`
   interface.
3. Swap `SalesService`'s constructor argument from
   `localStorageSalesDataSource` to the new instance.

Nothing in `packages/hooks` or `apps/website/src/dashboard` changes.

## Auth: what exists and what doesn't

Access is gated by `BusinessSettings.dashboardPasscode` — a plain string
compared client-side, remembered for the browser tab via `sessionStorage`
(`isDashboardAuthed`/`setDashboardAuthed`/`clearDashboardAuthed` in
`dashboardAuth.ts`). **This is not authentication.** The passcode ships
inside the JavaScript bundle (via `static-data/settings.json`), so it only
deters a casual visitor, not a determined one. A business with no
`dashboardPasscode` set sees a warning instead of a passcode form — the
dashboard is off by default, not "protected by an empty password."

Real auth (sessions, hashed credentials, ideally per-staff-member access
rather than one shared passcode) is required before this dashboard — or
`apps/admin`, which has the identical prerequisite, see
[future-admin.md](future-admin.md) — handles anything an owner would
actually consider sensitive.

## Demo passcodes

For the three demo businesses (`static-data/settings.json`):

| Business        | Passcode |
| --------------- | -------- |
| Royal Salon     | `1234`   |
| Urban Bistro    | `5678`   |
| Vision3D Studio | `9999`   |
