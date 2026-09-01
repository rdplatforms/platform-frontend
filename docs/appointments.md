# Appointment Booking

A config-driven section (`type: 'appointment'`) that lets a website visitor
request an appointment — which service, preferred date/time — and hands
that request to the business owner via a prefilled WhatsApp message. See
[adr/0010-whatsapp-appointment-handoff.md](adr/0010-whatsapp-appointment-handoff.md)
for why it's shaped this way instead of a real backend submission, and
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
4. On submit, `buildAppointmentMessage()`
   (`packages/utils/src/appointment.ts`) formats those into a plain-text
   message, localized to the visitor's current locale, and
   `useWhatsAppSubmit` (`packages/hooks/src/useWhatsAppSubmit.ts`) opens
   it in WhatsApp.
5. **The visitor still has to tap Send.** Nothing is delivered
   automatically — there's no backend to submit to, so this is a handoff,
   not a submission. The UI says so explicitly after opening the link.

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

- **No record on the platform side.** The request lives only in the
  owner's WhatsApp chat. There's no admin view, no count, no export. If
  that's needed later, the natural next step is a `BookingDataSource`
  following the exact pattern `SalesDataSource` already established (see
  [business-dashboard.md](business-dashboard.md)) — deliberately not built
  yet, to keep the first version shippable same-day.
- **Silent drop-off.** A visitor without WhatsApp installed, or who
  navigates away before hitting send, produces nothing — not even a
  platform-side signal that someone tried to book. Worth knowing before
  treating "no bookings" as "no interest."
- **Slots don't check existing bookings.** A time slot being offered only
  means it falls within business hours — there's no calendar checking
  whether that slot is already taken, since there's nowhere bookings are
  recorded yet (see the point above).
