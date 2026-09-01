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
