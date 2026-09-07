# Digital Business Card (`apps/rtsh-info`)

A platform-owned product, not a per-tenant business site: one shared app
serving a mobile-first personal profile page at `<domain>/<identifier>`,
opened by scanning a QR code printed on someone's physical business
card. `rtsh-info` is a placeholder app/package name — expected to
change once a real product name/domain is picked. See
[TASKS.md](../TASKS.md) Milestone 4.

## Routing

Path-based, not hostname-based (unlike `apps/website`'s
`BusinessResolver`) — one domain serves every card via `/:identifier`.

- **MVP**: the identifier is a phone number, in whatever format the QR
  code happens to encode (`+919322527567`, `919322527567`,
  `9322527567`, ...). `findCardByIdentifier` (`src/data/cardRegistry.ts`)
  matches on the **last 10 digits** rather than an exact string, so
  format inconsistency at QR-generation time doesn't 404 people.
- **Future** (past ~100 cards): identifiers move to an opaque `uid`.
  `findCardByIdentifier` already handles this — an identifier that
  isn't 10 phone-shaped digits is matched against `Card.id` directly
  instead. Every `Card` record already carries a permanent `id`, so this
  is a routing/QR-regeneration change only, not a data migration.
- A bad identifier still matches the `/:identifier` route — `CardPage`
  renders a "Card not found" state inline rather than redirecting.
  `NotFoundPage` only handles genuinely unmatched paths (e.g. bare `/`).

## Data

Frontend-only for now, same static-JSON-registry pattern
`packages/services`' `JsonDataSource` uses for businesses, just kept
local to this app (`src/data/cardRegistry.ts`) since a `Card` isn't
part of the business-content domain — see `static-data/package.json`'s
updated description for that distinction.

- Type: `Card` / `CardLink` (`packages/types/src/card.ts`)
- Files: `static-data/cards/index.json` (list of ids) +
  `static-data/cards/<id>.json` (one per person)
- Registry: `CARDS_BY_ID` in `cardRegistry.ts` — statically imports
  every card JSON file and registers it, same as `JsonDataSource`'s
  `BUSINESSES_BY_SLUG`. **This registry is the seam a future
  backend/table replaces** — adding a card today means one JSON file +
  one registry line; a real backend swap later means pointing
  `findCardByIdentifier` at an HTTP call instead, with no change to any
  component.

### Adding a new card

1. Add `static-data/cards/<id>.json` (see `ritesh-dhekane.json` for the
   shape).
2. Add `<id>` to `static-data/cards/index.json`'s `ids` array.
3. Add one line to `CARDS_BY_ID` in `cardRegistry.ts`, with a matching
   static import.

### Adding a new link type

`CardLink.type` is an open string on purpose — a new platform (Telegram,
X, ...) needs no schema change:

1. Add an entry to `ICONS` in `src/linkPresentation.ts` (pick any
   `@mui/icons-material` icon).
2. Optionally add a display-label override to `LABELS` (falls back to
   the raw `type` string otherwise).
3. If the link needs special `href` handling (not "treat `value` as a
   URL"), add a case to `hrefForLink`'s `switch` — see `call`/
   `whatsapp`/`email`/`maps` for examples. `whatsapp` reuses
   `@rdplatforms/utils`' `toWhatsAppLink`, the same helper
   `apps/website`'s Appointment section uses. `maps` treats `value` as a
   free-text address/place name and builds a Google Maps search URL
   from it, not a raw URL passthrough — see `Card.location` on the
   seeded `ritesh-dhekane.json` for the convention (same text, used as
   a `maps` link's `value`).

An unrecognized `type` still renders correctly — generic link icon, the
raw `type` string as its label, `value` treated as a URL.

## Visual styles

`Card.style` picks one of five predefined visual templates
(`src/cardStyles.ts`) — Linktree-inspired backgrounds/button treatments,
selected entirely from data, no code change needed per card:

| style key | look |
| --- | --- |
| `style1` (default) | Classic — light background, solid dark pill buttons |
| `style2` | Midnight — dark gradient, translucent outlined buttons |
| `style3` | Sunset — warm gradient, frosted white buttons |
| `style4` | Minimal — white background, outlined buttons |
| `style5` | Ocean — teal/blue gradient, translucent buttons |

A missing or unrecognized `style` value falls back to `style1`
(`resolveCardStyle`), same tolerance as an unrecognized link `type`.
Adding a 6th style is one new entry in `CARD_STYLES` — `CardPage` never
changes.

## Avatar initials/color

`getInitials`/`getAvatarColors` (`@rdplatforms/utils`, not local to this
app — deliberately shared since any future avatar in the platform, e.g.
a staff list in `apps/portal`, can reuse the same "no photo yet" look)
derive a two-letter initials badge and a deterministic background/text
color pair from a person's name alone, so the same name always renders
the same badge with no stored color field needed.

## Looking a card up without a QR code

`NotFoundPage` (shown for any path that isn't `/:identifier` — e.g. a
bare `/`) includes a mobile-number input that navigates to
`/<number>`, landing back on the same identifier resolution
`CardPage`/`findCardByIdentifier` already do.

## Local development

```bash
pnpm dev:rtsh-info
# open http://localhost:5176/9322527567
```

Port **5176** — 5173 website, 5174 admin, 5175 portal.
