# 0005: Config-Driven Page Sections via SectionRenderer

## Status

Accepted

## Context

Different businesses need different pages — Urban Bistro doesn't want a
FAQ section, Vision3D Studio wants a Team section that a salon doesn't need,
and section order should be adjustable per business. Hardcoding page
composition per business (a `RoyalSalonHomePage`, a `UrbanBistroHomePage`,
...) would mean every new business is a new page component, defeating the
platform's core premise.

## Decision

A business's page is described entirely by data: `PageConfig.sections`
(`packages/types/src/content.ts`) is an ordered list of `SectionConfig { type,
enabled, order, title?, subtitle? }`. `PageService.getEnabledSections()`
filters to `enabled: true` and sorts by `order`. `SectionRenderer`
(`packages/ui/src/sections/SectionRenderer.tsx`) maps each `SectionConfig.type`
to a component via a fixed lookup table and renders them in sequence, in the
uniform `{ business, config }` prop contract described in
[../../COMPONENT_GUIDELINES.md](../../COMPONENT_GUIDELINES.md).

## Consequences

- `HomePage` (`apps/website/src/pages/HomePage.tsx`) is the same 20 lines
  regardless of which business is loaded — it never enumerates sections
  itself.
- Turning a section on/off, reordering it, or overriding its title is a
  `static-data/pages.json` edit (soon: an admin action) — never a code
  change or deploy.
- Adding a genuinely new section _type_ (not just toggling an existing one)
  is additive: a new `SectionType` union member, a new component
  implementing the `{ business, config }` contract, one new entry in
  `SECTION_COMPONENTS`. No existing section or page is touched.
- The uniform section prop contract is a real constraint — a section can't
  demand extra props from its caller. Any additional data it needs, it
  fetches itself via a hook. This is what keeps `SectionRenderer` simple
  (`sections.map(...)`, no per-type wiring) as the section list grows.
