# Mobile Responsiveness

A pass through the shared `packages/ui` section/layout components to fix
small-screen issues found by inspecting the site at phone widths. Nothing
here is business-specific — every business sharing these components
benefits, not just Swami Hair Salon.

## What was wrong

- **Side-by-side CTA buttons wrapped awkwardly on narrow screens.** `Hero`,
  `Cta`, and `ClosedNoticeBanner` all had a `Stack direction="row"` of two
  buttons that, below ~360px, either wrapped mid-button or squeezed both
  buttons uncomfortably narrow.
- **Grid spacing was too generous for small screens.** `About` and
  `Contact` used a flat `spacing={6}` (48px) between grid items — on a
  phone, where columns stack vertically, that's 48px of pure vertical gap
  doing nothing but push content down.
- **`Appointment`'s date/time fields broke to `sm` (600px), not `md`
  (900px).** On mid-size phones in landscape or small tablets, this left
  the two fields uncomfortably cramped side by side before they had room.
- **Card images weren't lazy-loaded.** `CardMedia` (services, gallery,
  team cards) loaded eagerly regardless of viewport, which matters more on
  mobile data connections.

## What changed

| Component                  | Change                                                                                                |
| -------------------------- | ----------------------------------------------------------------------------------------------------- |
| `Hero.tsx`                 | CTA button `Stack`: `direction={{ xs: 'column', sm: 'row' }}`, full-width buttons on `xs`             |
| `Cta.tsx`                  | Same stacked-button fix for the Call Us / WhatsApp Us buttons                                         |
| `ClosedNoticeBanner.tsx`   | "Get In Touch" button and its wrapping `Stack` go full-width on `xs`                                  |
| `About.tsx`, `Contact.tsx` | `Grid container spacing={{ xs: 3, md: 6 }}` instead of a flat `spacing={6}`                           |
| `Appointment.tsx`          | Date/time field `Grid item` breakpoint moved from `sm` to `md`, so they stack until there's real room |
| `Card.tsx` (`primitives`)  | `CardMedia` now has `loading="lazy"`                                                                  |

None of this touches business content or JSON data — it's all `sx`
breakpoint tuning on shared components, verified with
`pnpm -r typecheck && pnpm lint && pnpm test && pnpm build`.

## Follow-up: Appointment fields sitting asymmetrically on mobile

The first attempt at this (padding on the wrapping `Stack`) turned out to
be based on an incomplete read of how MUI's `Grid` applies its spacing:
`@mui/material` at the version installed here (6.5.0) still ships the
**legacy** `Grid`, which uses a `marginLeft: calc(-1 * spacing)` +
`width: calc(100% + spacing)` trick — negative margin on the **left only**,
not both sides. A flat compensating `px` on the parent doesn't reliably
cancel that in every case, and in practice the fields still rendered with
visibly uneven left/right padding on real mobile widths.

Fixed properly by removing the legacy `Grid` from `Appointment.tsx`
entirely, replacing it with a `Box` using native CSS Grid
(`display: 'grid'`, `gridTemplateColumns`, `gap: 2`). CSS `gap` has no
margin trick to get wrong — it can't produce asymmetric padding by
construction, so there's nothing left to compensate for. Field placement:
name/service/note each span the full row (`gridColumn: '1 / -1'`); date
and time sit in the two columns on `md`+ and stack on `xs` (single-column
grid there, so they're full width automatically, no explicit span
needed).
