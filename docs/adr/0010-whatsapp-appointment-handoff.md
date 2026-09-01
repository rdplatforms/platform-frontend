# 0010: Appointment Requests Hand Off to WhatsApp, Not a Backend Submission

## Status

Accepted

## Context

Swami Hair Salon needed a way for a website visitor to request an
appointment (which service, what date/time) and have that request reach
the owner, Shankar Raut, on his phone. There is no backend — nothing can
receive a form POST, send an SMS, or call the WhatsApp Business API
(which requires a paid, verified integration and a server). The site's
"WhatsApp Us" CTA already existed as a plain, unstructured wa.me link.

## Decision

`Appointment` (`packages/ui/src/sections/Appointment.tsx`) is a new,
config-driven section type (`appointment`) — reusable by any business, not
built one-off for this salon. It collects structured booking details
(name, phone, service, date, time, optional note), formats them via
`buildAppointmentMessage()` (`packages/utils/src/appointment.ts`), and
opens a `wa.me` link to `business.contact.whatsapp` (falling back to
`business.contact.phone`) with that message prefilled. The customer still
has to tap **Send** in WhatsApp — nothing is delivered automatically.

## Consequences

- Ships with zero backend and zero third-party API cost — every other
  piece of "contact" functionality on this platform already accepts that
  constraint (see the `Contact` section, [0003](0003-static-json-behind-services-layer.md)).
- The request lives in Shankar's own WhatsApp chat history — no admin UI,
  no persistence, no way to query "how many bookings this week" from the
  platform. That's a real limitation, not an oversight — the alternative
  (logging bookings into the owner dashboard, following the exact pattern
  `SalesDataSource` already established — see [0007](0007-per-business-owner-dashboard.md))
  was deliberately deferred to keep the first version shippable same-day,
  not ruled out.
- Because the message is only _prefilled_, a customer without WhatsApp
  installed, or one who navigates away before hitting send, produces no
  request at all and no record that they tried. This is worth surfacing to
  the business owner directly, not just documenting here.
- `serviceId` is resolved against the business's real `ServiceItem` list
  (via `useServices`) rather than free text, so the message always names
  an actual bookable service — consistent with the rest of the platform's
  "read from data, don't invent copy" discipline.
