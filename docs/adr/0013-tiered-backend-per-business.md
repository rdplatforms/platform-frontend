# 0013: Three Backend Tiers, Selected Per Deployment, Never Mixed

## Status

Accepted

## Context

Not every business the platform serves wants, or can pay for, the same
backend. ADR 0010 already established WhatsApp handoff as a real,
sufficient channel for a business happy to work it manually. Some
businesses want more (real persisted bookings/messages, a real
dashboard) without any hosting cost; others are ready for the full
`platform-backend` (Milestones 1–6) and its real hosting cost.

## Decision

Three tiers (see [../backend-tiers.md](../backend-tiers.md) for the
full picture):

1. **WhatsApp only** — today's default, unchanged, $0.
2. **Google Apps Script** — a business's *own* free Google account runs
   the backend (a Sheet + a small Apps Script Web App,
   `integrations/apps-script/`), $0, no infrastructure for us to run.
3. **`platform-backend`** — the real Postgres/Spring Boot backend,
   real hosting cost, full portal capability.

Selection is a **deployment-time env var**, not a per-business data
field or runtime choice — `VITE_API_BASE_URL` (Tier 3) or
`VITE_APPS_SCRIPT_URL` (Tier 2), checked in that order by
`BookingService`/`ContactService`. This fits how businesses are already
deployed (ADR 0009: one separate build/deploy per business), so no
per-business runtime branching is needed in a single shared build.

`BookingDataSource`/`ContactDataSource` interfaces
(`packages/services/src/dataSource/types.ts`) are the seam — every tier's
implementation satisfies the same one, so `Appointment.tsx`/`Contact.tsx`
never know or care which tier is active. A Tier 2/3 backend save is
always best-effort and additive — the WhatsApp handoff still fires
regardless of tier, exactly as ADR 0010 already established for
bookings; a failed/unconfigured backend save must never block it.

**Tier 2's Google account is owned by the business, not rdplatforms** —
a deliberate choice over one shared rdplatforms-controlled account with
per-business sheets. They can open their own data in Google Sheets on
their own phone, and nothing about their data depends on the platform
relationship continuing.

## Consequences

- Tier 2 covers bookings and contact messages only, by design — a
  Sheet+Apps Script setup was never meant to grow into billing/staff/
  analytics; a business that wants those moves to Tier 3, a real
  migration (their Sheet data doesn't carry over automatically), not a
  config flip.
- Tier 3 has no `ContactMessage` equivalent yet — `platform-backend`
  never built one (only `Booking`/`Sale`/`Product` exist). `ContactService`
  has no Tier 3 branch as a result; a Tier 3 business's contact messages
  stay WhatsApp-only until/unless that's built.
- Apps Script Web Apps can't return a real non-200 HTTP status — every
  response is HTTP 200 with success/failure carried in the JSON body
  instead (`{ok: boolean, error?: string}`). `AppsScriptClient.ts`
  encodes this; a naive `res.ok` check would be wrong here.
- A CORS preflight (triggered by an `application/json` Content-Type)
  isn't handled by Apps Script Web Apps — requests use
  `Content-Type: text/plain` instead, with the body still JSON-parsed
  server-side. An `exec` URL also replies with an internal redirect the
  client has to follow. Both non-obvious; documented at the point they
  matter (`AppsScriptClient.ts`, `integrations/apps-script/README.md`,
  verified against real-world writeups rather than assumed) so they
  aren't silently "fixed" back to something that looks more normal by
  someone who doesn't know why they're there.
