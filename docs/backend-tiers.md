# Backend tiers

Not every business needs (or can pay for) the same backend. Three
tiers, matched to what a business actually needs and can pay for —
selected per deployment (each business gets its own separate
`apps/website` build/deploy, see [deployment.md](deployment.md)), never
mixed within one.

| Tier | Backend | Cost | Fits |
| --- | --- | --- | --- |
| **1 — WhatsApp** | None | $0 | Happy to work WhatsApp manually (e.g. Swami Hair Salon today) — see [adr/0010-whatsapp-appointment-handoff.md](adr/0010-whatsapp-appointment-handoff.md) |
| **2 — Apps Script** | Google Sheets + Apps Script, on the business's *own* free Google account | $0 | Wants bookings/messages logged somewhere real, without paying for infrastructure |
| **3 — Java backend** | `platform-backend` (Postgres + Spring Boot) | Real hosting cost | Wants the full portal — billing, analytics, staff, product catalog |

## How tier selection actually works

One env var per deployment, checked in this order (see
`packages/services/src/BookingService.ts`):

1. `VITE_API_BASE_URL` set → **Tier 3**, `HttpBookingDataSource`.
2. Else `VITE_APPS_SCRIPT_URL` set → **Tier 2**, `AppsScriptBookingDataSource`
   (posts to that business's own Apps Script Web App — see
   [../integrations/apps-script/README.md](../integrations/apps-script/README.md)).
3. Else → **Tier 1**, no data source at all — `BookingService`/
   `ContactService` resolve to a no-op, exactly today's behavior for
   every business before this existed.

Every tier still fires the WhatsApp handoff (`Appointment.tsx`/
`Contact.tsx`) regardless — a Tier 2/3 backend save is *best-effort*,
additive, never a replacement. Same reasoning bookings already
established: WhatsApp is a real, independent notification channel that
must never be blocked by a failed/skipped backend call.

## What's covered per tier today

| | Bookings | Contact messages | Billing/analytics/staff/products |
| --- | --- | --- | --- |
| Tier 1 | WhatsApp only | WhatsApp only | Not applicable |
| Tier 2 | ✅ `AppsScriptBookingDataSource` | ✅ `AppsScriptContactDataSource` | Not built — Tier 2 is bookings/contact only, by design |
| Tier 3 | ✅ `HttpBookingDataSource` | ❌ not built yet — `platform-backend` has no `ContactMessage` entity; `ContactService` currently has no Tier 3 branch | ✅ (Milestones 5/6) |

A business that outgrows Tier 2 (wants billing/analytics) moves to
Tier 3 — that's a real backend migration (their Sheet data doesn't
carry over automatically), not a config flip.

## Costs, verified (not assumed)

- Apps Script itself is **always free**, no billing ever required, on
  a plain personal Google account.
- Free-tier daily ceilings that actually apply to this use case: **100
  notification emails/day**, **90 minutes of total script execution/day**
  (each request here takes a fraction of a second, so that's realistically
  thousands of submissions/day of headroom). [Google Apps Script Quotas
  & Limits 2026](https://modelmonkey.io/blog/google-apps-script-quotas-limits-2026)
- Paid Google Workspace (business email) starts around **$7/mo
  annual** and raises those ceilings, but is not required for Apps
  Script itself — only recommend it if the business separately wants
  professional email. [Google Workspace Pricing
  2026](https://www.name.com/blog/google-workspace-pricing)
- Tier 3 (`platform-backend`) needs real Postgres + JVM hosting — cost
  depends on the host chosen, not fixed here.

## Frontend architecture

`BookingDataSource`/`ContactDataSource` interfaces
(`packages/services/src/dataSource/types.ts`) — `HttpBookingDataSource`
(Tier 3) and `AppsScriptBookingDataSource` (Tier 2) both implement the
same one; `BookingService`/`ContactService` pick whichever applies (or
neither) and are the only thing `Appointment.tsx`/`Contact.tsx` ever
talk to. Adding a tier means adding one new `*DataSource` implementing
the existing interface — no change to the section components, same "one
seam, swap the implementation" shape `activeDataSource.ts` already
established for the read-only content types.
