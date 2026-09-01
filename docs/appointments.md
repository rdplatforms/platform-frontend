# Appointment Booking

A config-driven section (`type: 'appointment'`) that lets a website visitor
request an appointment — which service, preferred date/time — and hands
that request to the business owner via a prefilled WhatsApp message. See
[adr/0010-whatsapp-appointment-handoff.md](adr/0010-whatsapp-appointment-handoff.md)
for why it's shaped this way instead of a real backend submission.

## What it does today

1. Visitor fills in name, phone, a service (pulled from the business's
   real `ServiceItem` list via `useServices` — never free text), preferred
   date, preferred time, and an optional note.
2. On submit, `buildAppointmentMessage()`
   (`packages/utils/src/appointment.ts`) formats those into a plain-text
   message, localized to the visitor's current locale.
3. `toWhatsAppLink(business.contact.whatsapp ?? business.contact.phone,
message)` opens in a new tab with the message prefilled.
4. **The visitor still has to tap Send.** Nothing is delivered
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

## Turning it on for a business

Add a `SectionConfig` entry with `type: "appointment"` to that business's
page in `pages.json`, same as any other section:

```json
{ "type": "appointment", "enabled": true, "order": 4 }
```

It needs `business.contact.whatsapp` (or at minimum `.phone`) and a
non-empty service list (`useServices`) to be useful — an empty service
list still renders the form, just with nothing to select.

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
- **No real availability checking.** Date/time are freeform inputs, not
  slots checked against the business's actual hours or existing bookings
  — there's no calendar/scheduling system behind this yet.
