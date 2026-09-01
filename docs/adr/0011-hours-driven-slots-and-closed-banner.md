# 0011: Appointment Slots and the Closed Banner Are Derived From BusinessHours, Never Hardcoded

## Status

Accepted

## Context

The Appointment section's original time field was freeform text. Swami
Hair Salon needed real time-slot selection (10am–10pm), a rule against
picking a closed day (Monday), and a "we're closed right now" notice on
the site itself — all things that could have been implemented as
constants (`OPEN_HOUR = 10`, `CLOSE_HOUR = 22`, `CLOSED_DAY = 'monday'`)
directly in the Appointment component. That would have been fast, but it
recreates exactly the problem [0002](0002-business-resolver-strategy-pattern.md)
and [0003](0003-static-json-behind-services-layer.md) already solved for
other business facts: hardcoding one business's specifics into shared
code doesn't scale past that one business, and the owner asked to be able
to edit this data directly, not through a code change.

## Decision

`Business.hours` (`BusinessHours[]`) — a field that already existed but
was previously only rendered as display text in the `Footer` — becomes the
single source of truth two more things read: `generateTimeSlots()`
(picking that day's slots for the Appointment form) and
`isBusinessOpenNow()` (driving `ClosedNoticeBanner`). Slot length is
`BusinessSettings.appointmentSlotMinutes`, defaulting to 60. Both are pure
functions in `packages/utils/src/businessHours.ts` — see
[../business-hours.md](../business-hours.md).

## Consequences

- Changing the salon's hours, or its slot length, is a JSON edit in
  `static-data/`, not a code change — matches the owner's explicit ask.
- `isBusinessOpenNow()` treats missing hours data as "open" rather than
  "closed" — a business that hasn't filled in `hours` yet (Urban Bistro
  and Vision3D Studio have hours from the original demo data, but any
  future business might not) never gets a false "we're closed" banner
  just because that field is empty.
- The 12-slot count for a 10am–10pm day is never written anywhere as a
  literal — it's a consequence of the hours and slot length, so it stays
  correct automatically if either changes.
- `getDayOfWeek()` deliberately avoids `new Date(dateString)` UTC parsing
  of bare date strings, because that silently shifts to the wrong calendar
  day in timezones behind UTC (all of India included) — a real bug class
  worth naming explicitly, not just avoiding by accident.
