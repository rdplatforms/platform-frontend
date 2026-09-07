# Appointment Booking

A config-driven section (`type: 'appointment'`) that lets a website visitor
request an appointment — which service, preferred date/time — and both
persists it as a real `Booking` on the backend **and** hands it to the
business owner via a prefilled WhatsApp message (TASKS.md Milestone 3,
TASK-013/014). See
[adr/0010-whatsapp-appointment-handoff.md](adr/0010-whatsapp-appointment-handoff.md)
for why the WhatsApp side is shaped the way it is, and
[business-hours.md](business-hours.md) for how the date/time picker is
driven entirely by the business's own hours data.

## What it does today

1. Visitor fills in name, a service (pulled from the business's real
   `ServiceItem` list via `useServices` — never free text), a date, a time
   slot, and an optional note. **No phone field** — WhatsApp already shows
   the business owner the sender's number, so asking again is redundant.
2. The date can't be before today (enforced both by the picker's `min` and
   a real Zod validation, not just the browser UI).
3. Time is a dropdown of slots generated from that date's actual business
   hours (`BusinessHours` + `BusinessSettings.appointmentSlotMinutes`) —
   not freeform text. Picking a day the business is closed (e.g. Monday
   for Swami Hair Salon) disables the time field with an explanatory
   message instead of offering slots that don't exist.
4. On submit, `useCreateBooking` (`packages/hooks/src/useCreateBooking.ts`)
   POSTs the request to the backend (`bookingService`/
   `HttpBookingDataSource`, `packages/services`) — a real, persisted
   `Booking` with `source: 'ONLINE'`, `status: 'PENDING'`, visible to
   staff in `apps/portal`'s booking queue (TASK-015). This is
   **best-effort**: if it fails, or no backend is configured at all
   (`VITE_API_BASE_URL` unset), the error is logged and swallowed —
   it must never block the next step, which is unchanged from before
   this existed.
5. `buildAppointmentMessage()` (`packages/utils/src/appointment.ts`)
   formats the same details into a plain-text message, localized to the
   visitor's current locale, and `useWhatsAppSubmit`
   (`packages/hooks/src/useWhatsAppSubmit.ts`) opens it in WhatsApp —
   still a real-time notification to the owner, not just a database row
   they'd have to remember to check.
6. **The visitor still has to tap Send** on the WhatsApp message. That
   part hasn't changed — the backend save happens regardless of whether
   they do.

## Where it lives

`packages/ui/src/sections/Appointment.tsx` — a normal section component
following the same `{ business, config }` contract as every other section
(see
[COMPONENT_GUIDELINES.md](../COMPONENT_GUIDELINES.md#section-component-contract)),
registered in `SectionRenderer`. Any business can enable it via
`static-data/pages.json` — it isn't specific to Swami Hair Salon, even
though that's the first business using it.

`useWhatsAppSubmit` is shared with the `Contact` section (also WhatsApp-
based now — see below) so the "build a message, open WhatsApp, show a
sent state" flow exists in exactly one place.

## Turning it on for a business

Add a `SectionConfig` entry with `type: "appointment"` to that business's
page in `pages.json`, same as any other section:

```json
{ "type": "appointment", "enabled": true, "order": 4 }
```

It needs `business.contact.whatsapp` (or at minimum `.phone`), a non-empty
`business.hours` (otherwise every date shows no time slots), and a
non-empty service list (`useServices`) to be useful.

## The "Get In Touch" section is WhatsApp-based too

`Contact` (`packages/ui/src/sections/Contact.tsx`) uses the same handoff —
`buildContactMessage()` + `useWhatsAppSubmit` — for general inquiries
(name, optional email, message) rather than a structured booking. Both
submit buttons are horizontally centered.

## Known limitations

- **Silent drop-off, still.** A visitor without WhatsApp installed, or
  who navigates away before hitting send, still produces a real
  `Booking` row (`status: PENDING`) — that part's fixed — but the owner
  gets no real-time notification unless they happen to check the
  portal's booking queue. The WhatsApp message is still the only
  "someone wants this now" signal; the backend record is the durable
  one.
- **No backend requires no booking, silently.** If `VITE_API_BASE_URL`
  is unset (e.g. a preview running purely against `static-data/`), the
  booking is never saved — by design (see `BookingService`'s comment),
  but worth remembering if bookings seem to be "missing" from a
  particular deployment.
- **Slots don't check existing bookings.** A time slot being offered only
  means it falls within business hours — there's no check against
  already-booked slots yet, even though the data to do that now exists
  (`GET /businesses/{id}/bookings`). A reasonable follow-up once the
  booking queue (TASK-015) is in daily use.
