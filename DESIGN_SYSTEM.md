# Design System

The platform doesn't have one fixed look — it has a **theme engine** that
derives a look from data. This document describes the inputs, the engine,
and the rules for using the output correctly.

## The theme contract: `BusinessTheme`

Defined in `packages/types/src/theme.ts`. Every business declares:

| Field                                                     | Purpose                                               |
| --------------------------------------------------------- | ----------------------------------------------------- |
| `primaryColor` / `secondaryColor` / `accentColor`         | Brand colors                                          |
| `backgroundColor` / `textColor`                           | Optional overrides of the default surface/text colors |
| `typography.fontFamily` / `headingFontFamily` / `pairing` | Body and heading fonts                                |
| `borderRadius`                                            | Base corner radius used across components             |
| `buttonStyle`                                             | `'square' \| 'rounded' \| 'pill'`                     |
| `backgroundStyle`                                         | `'solid' \| 'soft-gradient' \| 'image-overlay'`       |
| `darkModeEnabled`                                         | Whether this business's site runs in dark mode        |

See `static-data/theme.json` for the three demo businesses' values.

## The engine: `createAppTheme`

`packages/providers/src/theme/createAppTheme.ts` takes a `BusinessTheme`
and returns a real MUI `Theme` via `createTheme()`. It:

- Sets `palette.mode` from `darkModeEnabled`.
- Maps `primaryColor` / `secondaryColor` straight to `palette.primary.main`
  / `palette.secondary.main`.
- Sets `shape.borderRadius` from the business's value.
- Maps `buttonStyle` to a concrete pixel radius for `MuiButton` overrides
  (`square` → 4, `rounded` → 12, `pill` → 999).
- Sets `typography.fontFamily` and per-heading-variant `fontFamily` from
  `headingFontFamily` (falling back to the body font).

If a business has no theme yet (e.g. mid-resolution), a `DEFAULT_THEME`
constant keeps the app from rendering unstyled.

`AppThemeProvider` (`packages/providers/src/AppThemeProvider.tsx`) is the
only place this function is called in the running app: it loads the
resolved business's theme via `ThemeService`, derives the MUI theme, and
wraps children in MUI's `ThemeProvider` + `CssBaseline`.

## Rules for consuming the theme

1. **Never hardcode a color, font, or radius in a component.** Always read
   from `theme.palette.*` / `theme.typography.*` / `theme.shape.borderRadius`
   via the `sx` prop or `useTheme()`.
2. **Never brand-check.** No `if (business.slug === 'royal-salon') return
<PinkButton />`. If a business needs a visual capability the theme
   doesn't support yet, add a field to `BusinessTheme` — don't special-case
   the component.
3. **Primitives set defaults, not final answers.** `packages/ui/src/primitives/Button.tsx`
   defaults `variant="contained"` but never a color — that always comes
   from the active theme.
4. **The admin does not use this engine.** `apps/admin` runs its own fixed
   platform theme (`apps/admin/src/App.tsx`) because it operates across
   every business at once — see [docs/future-admin.md](docs/future-admin.md).

## Typography pairings

`typography.pairing` (`'modern-sans' | 'classic-serif' | 'editorial'`) is
currently descriptive metadata paired with an explicit `fontFamily` /
`headingFontFamily` — useful for an eventual admin theme picker ("choose a
pairing" UI) without hardcoding font names in the picker itself. It doesn't
drive behavior on its own today.

## Demo business themes at a glance

| Business        | Mode  | Buttons | Heading style                      |
| --------------- | ----- | ------- | ---------------------------------- |
| Royal Salon     | Light | Pill    | Editorial serif (Playfair Display) |
| Urban Bistro    | Light | Square  | Classic serif (Fraunces)           |
| Vision3D Studio | Dark  | Square  | Modern sans (Sora)                 |

## Spacing & layout

- Vertical rhythm between sections comes from `PageSection` (`py: { xs: 6,
md: 10 }` by default) — don't add ad hoc margin to a section's root.
- Horizontal containment comes from `Container` (`maxWidth="lg"`) — don't
  set a custom max-width in a section.
- Alternate `tone="subtle"` on `PageSection` to get a soft background tint
  between sections for visual separation, rather than introducing a new
  background color.
