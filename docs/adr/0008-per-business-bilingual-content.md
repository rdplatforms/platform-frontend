# 0008: Per-Business Bilingual Content via `LocalizableText`, Additive to Single-Language Businesses

## Status

Accepted

## Context

A real business onboarded to the platform (Swami Hair Salon) needed its
content in Marathi, with English also available for a broader audience.
Every existing content field (`tagline`, `description`, service names,
section titles, ...) was a plain string. The two other demo businesses,
and presumably most future businesses, are single-language — any solution
that forced every business into a translation structure would be a
needless migration for the common case.

## Decision

Content fields that plausibly need translation take a `LocalizableText`
type: `string | { en?: string; mr?: string }`
(`packages/types/src/locale.ts`). A plain string — what every
single-language business already has — continues to work completely
unchanged. `resolveLocalizedText(value, locale)`
(`packages/utils/src/locale.ts`) is the single function every consumer
calls to get a display string, regardless of which shape the field is in.

A separate, deliberately simple flat dictionary (`uiStrings.ts`) handles
generic platform chrome (section title defaults, form labels, nav items)
via `translateUi(key, locale)` — this is not business content and doesn't
belong on any `Business`/content record.

`LocaleProvider` (inside `BusinessProvider`, since it needs
`business.supportedLocales`) tracks the visitor's chosen locale and
persists it per business in `localStorage`. `LanguageSwitcher` renders
nothing unless a business declares more than one supported locale.

## Consequences

- Zero migration cost for existing/future single-language businesses —
  `LocalizableText` accepting a plain string is the whole reason for this.
- Adding a language to a business is a data change (`supportedLocales` +
  filling in translation keys), not a code change — consistent with every
  other "business needs differ" decision in this platform (see ADR 0002,
  0003, 0005).
- Resolution happens at render time, not in the data/services layer —
  `*Service` methods return the full bilingual object; components decide
  what to display. This keeps language switching instant (no refetch) and
  keeps the services layer's contract (see ADR 0003) locale-agnostic.
- This surfaced a real, unrelated gap: theme fonts were declared but never
  loaded (see [0004](0004-data-driven-theme-engine.md)). Fixed generally
  (`typography.googleFontsUrl` + `loadGoogleFont()`), not as a
  Marathi-specific patch.
- The flat `uiStrings` dictionary is intentionally not a full i18n library
  (no pluralization, no ICU message format) — proportionate to "swap this
  word for that word," not built to anticipate needs the platform doesn't
  have yet.
