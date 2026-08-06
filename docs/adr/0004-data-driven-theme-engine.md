# 0004: Data-Driven Theme Engine Instead of Per-Business Stylesheets

## Status

Accepted

## Context

Swami Hair Salon, Urban Bistro, and Vision3D Studio need visibly distinct
brands (colors, typography, button shape, light/dark mode) from the same
component code. The obvious-but-wrong approaches are per-business CSS
files/overrides, or components that branch on which business is rendering.
Both don't scale past a handful of businesses and couple visual identity to
code changes.

## Decision

Businesses declare a `BusinessTheme` (`packages/types/src/theme.ts`) as
data: colors, a typography pairing, border radius, button style,
background style, dark mode flag. `createAppTheme()`
(`packages/providers/src/theme/createAppTheme.ts`) is a pure function that
turns that data into a real MUI `Theme`. `AppThemeProvider` is the only
caller — it loads the resolved business's theme and wraps the app in MUI's
`ThemeProvider`. Every component reads colors/typography/radius from the
active theme (`sx` prop, `useTheme()`) — never a hardcoded value, never a
branch on which business is active.

## Consequences

- A new business's visual identity is a `theme.json` entry — no CSS, no
  component change.
- Components are truly reusable across businesses because they have no way
  to know which business they're rendering for, visually — they only know
  the theme in scope.
- Design range is bounded by what `BusinessTheme` + `createAppTheme` can
  express. Extending that range (a new button style, a new background
  treatment) means extending the type and the engine, in one place — not
  patching individual components.
- The admin's future Theme page (see
  [../future-admin.md](../future-admin.md)) can offer a live preview by
  calling `createAppTheme()` directly with edited values, guaranteeing the
  preview matches production exactly, since it's the same function.
