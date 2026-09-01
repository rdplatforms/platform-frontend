# Business Hours

`Business.hours` (`BusinessHours[]`, `packages/types/src/business.ts`) is
the single source of truth for when a business is open — it now actually
drives behavior, not just display text. See
[adr/0011-hours-driven-slots-and-closed-banner.md](adr/0011-hours-driven-slots-and-closed-banner.md).

## What reads `business.hours`

| Consumer                                                               | What it does                                                                 |
| ---------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| `Footer` (`packages/ui/src/layout/Footer.tsx`)                         | Lists each day + formatted range (unchanged — this already existed)          |
| `Appointment` section                                                  | Generates that day's time slots; disables the time field on a closed day     |
| `ClosedNoticeBanner` (`packages/ui/src/layout/ClosedNoticeBanner.tsx`) | Shows a dismissible "we're closed" modal if the business is closed right now |

None of these hardcode a business's hours — everything here is a demo
business showing what happens once `hours` is populated. Editing hours for
a real business is a JSON change in `static-data/businesses/<slug>.json`,
nothing else.

## The pure functions (`packages/utils/src/businessHours.ts`)

- **`getDayOfWeek(dateStr)`** — turns a `"YYYY-MM-DD"` string into a
  `BusinessHours['day']`, built from local date components
  (`new Date(year, month, day)`) rather than parsing the string as UTC —
  `Date.parse` on a bare date string is midnight UTC, which lands on the
  _previous_ calendar day in any timezone behind UTC (all of India, for
  instance) and would silently pick the wrong day's hours.
- **`getBusinessHoursForDate(hours, dateStr)`** — the `BusinessHours` entry
  matching that date's day of week.
- **`generateTimeSlots(opensAt, closesAt, slotMinutes = 60)`** — start
  times between open and close. For Swami Hair Salon's 10:00–22:00 at the
  default 60-minute slots, this produces the 12 slots without "12" being
  written anywhere — it falls out of the hours and slot length. Change
  `BusinessSettings.appointmentSlotMinutes` to 30 and the same function
  produces 24 slots, no code change.
- **`isBusinessOpenNow(hours, now = new Date())`** — whether the business
  is open at this exact moment. **A business with no hours configured (or
  no entry for today) is treated as open, not closed** — absence of data
  must never produce a false "we're closed" claim. This is why
  `ClosedNoticeBanner` never appears for Urban Bistro or Vision3D Studio
  today (their `hours` arrays exist but the banner only reacts to real
  closures) and would silently do nothing for any future business that
  hasn't filled in hours yet.

All four are unit tested in `packages/utils/tests/businessHours.test.ts`,
including the timezone-parsing pitfall and the "no data → open" default.

## `ClosedNoticeBanner`

A dismissible MUI `Dialog` (X to close, or the "Get In Touch" button),
shown once per page load when `isBusinessOpenNow(business.hours)` is
false. Rendered from `HomePage` alongside `Navbar`/`Footer`. The "Get In
Touch" button links to `#contact` and dismisses the dialog on click —
being closed shouldn't be a dead end for a visitor who still wants to
reach the business. The message text (`closedBannerTitle`/
`closedBannerMessage`) is generic, translated platform chrome
(`uiStrings.ts`) — not per-business custom copy. If a business wants its
own wording later, that's a `LocalizableText` field on `Business` (same
pattern as `brandNote`), not a change to this component.
