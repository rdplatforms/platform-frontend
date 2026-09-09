# 0015: WhatsApp checkout fallback for Tier 1 e-commerce

## Status

Accepted. Supersedes the "deliberately not best-effort" checkout decision
recorded in [shop.md](../shop.md) when Milestone 6 shipped —
`CheckoutService`'s own code comment at the time explained the reasoning
being reversed here.

## Context

Milestone 6 built `apps/website`'s cart/checkout on the assumption that a
business selling products would have a real backend (`platform-backend`,
Tier 3) to persist a `Sale` against — `CheckoutService` rejected outright
with no fallback when no backend was configured, on the reasoning that
"there's no WhatsApp-style fallback channel for an order the way there
is for an appointment."

That assumption stopped holding once a Tier 1 (WhatsApp-only, no backend
at all — see [0013](0013-tiered-backend-per-business.md)) business needs
e-commerce too: an imitation-jewellery business taking orders entirely
over WhatsApp, the same way Swami Hair Salon takes appointment requests.
Under the old design, `apps/website`'s shop/cart UI would render for such
a business, but every checkout attempt would hard-fail with a visible
error — there was no way to actually complete a purchase.

## Decision

Give checkout the same best-effort shape `BookingService`/`ContactService`
already have, but at the UI layer rather than inside `CheckoutService`
itself: `CheckoutService`/`useCheckout` are unchanged (still reject on
failure or a missing backend) — `CartPage` is what changed. It now
`await`s the checkout mutation, swallows any error (console-logged, never
shown to the customer), and _always_ builds an order summary
(`buildCartOrderMessage`, `@rdplatforms/utils`, mirroring
`buildAppointmentMessage`) and hands it to WhatsApp via the same
`useWhatsAppSubmit` hook `Appointment`/`Contact` already use.

This is a platform-wide capability, not specific to any one business —
every e-commerce business's checkout now behaves this way, regardless of
tier:

- **Tier 1** (no backend): the WhatsApp handoff is the entire checkout —
  nothing is persisted, matching how bookings/contact already work for a
  WhatsApp-only business.
- **Tier 2/3** (a backend is configured): the `Sale` is still saved as
  before, _and_ the customer also gets the WhatsApp handoff as a
  real-time confirmation channel — additive, never a replacement for the
  backend save.

## Consequences

- No business is prevented from selling products just because it hasn't
  set up Tier 2/3 — `commerceEnabled: true` alone is enough, the same as
  it always was for `bookingEnabled`.
- `CartPage` no longer shows a visible checkout error — a failed backend
  save is now silent by design (logged, not surfaced), matching
  `Appointment`'s existing behavior. A business that _does_ have Tier
  2/3 configured and wants to know about save failures needs to look at
  server-side logs/monitoring, not the customer-facing error state that
  used to exist here.
- `CheckoutService.createSale` still throws/rejects exactly as before —
  nothing about the service or its tests changed, only how its one
  caller (`CartPage`) treats the result.
