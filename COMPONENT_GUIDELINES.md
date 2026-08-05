# Component Guidelines

## The rule

Every component in `@rdplatforms/ui` must work for a business that doesn't
exist yet. If a component only makes sense for Royal Salon, it doesn't
belong in `packages/ui` — and if you find yourself branching on
`business.category` inside one, stop and reconsider the data model instead.

## Where a component belongs

| If it...                                                    | It belongs in                |
| ----------------------------------------------------------- | ---------------------------- |
| Is a generic, styled MUI wrapper (Button, Card, Badge)      | `packages/ui/src/primitives` |
| Renders the site-wide chrome (Navbar, Footer)               | `packages/ui/src/layout`     |
| Renders one full-width page section (Hero, Services, ...)   | `packages/ui/src/sections`   |
| Is specific to one app's page composition (e.g. `HomePage`) | that app's `src/pages`       |
| Is a one-off, non-reusable admin placeholder                | `apps/admin/src/pages`       |

## Section component contract

Every section component has exactly this signature:

```tsx
import type { SectionProps } from './types';

export function MySection({ business, config }: SectionProps) {
  // ...
}
```

- `business` is the fully resolved `Business` — read contact info, id, etc.
  from it directly.
- `config` is that section's `SectionConfig` — use `config.title` /
  `config.subtitle` as overrides with a sensible default (`config.title ??
'Our Services'`), never assume they're set.
- If the section needs content beyond `business`/`config` (services,
  gallery items, testimonials, ...), fetch it itself via a hook from
  `@rdplatforms/hooks` (`useServices(business.id)`, etc.) — don't expect the
  caller to pass it in as a prop.
- Register it in `SECTION_COMPONENTS` in
  `packages/ui/src/sections/SectionRenderer.tsx` and in the `SectionType`
  union in `packages/types/src/content.ts`.

This uniform contract is what lets `SectionRenderer` map a `SectionConfig[]`
straight to rendered output with no per-section special-casing.

## Styling

- Use MUI's `sx` prop and theme tokens (`theme.palette.primary.main`,
  `theme.spacing()`, etc.) — never hardcode a hex color or pixel value that
  should come from the business's theme.
- Layout spacing goes through `PageSection` (vertical rhythm) and
  `Container` (max width) — a section should not manage its own top-level
  margin or max-width.
- See [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md) for the full theming contract.

## Props

- Keep props minimal and typed — no `[key: string]: any` escape hatches.
- Prefer composition (children, render props via a `footer`/`action` slot)
  over boolean flags that fork rendering internally (`showFooter` /
  `hideFooter` style props multiply fast and get out of sync).

## Loading & empty states

- Any component that fetches data must render a loading state (an MUI
  `Skeleton`, matched roughly to the shape of the loaded content) and
  degrade gracefully to an empty state (render nothing or a minimal
  message) rather than crashing on `undefined`.

## Accessibility

- Every interactive element needs an accessible name (`aria-label` on
  icon-only buttons, real `<label>`/`TextField label` on form fields).
- Images always get `alt` text — fall back to the business's display name,
  never leave it empty for a content image.
