# Business Data Model

"Business" is the platform's core entity — everything else (theme,
services, gallery, testimonials, pages) hangs off a `businessId`. This
document explains the shape and the reasoning behind it. For resolution
(how a request maps to a business), see
[../ARCHITECTURE.md](../ARCHITECTURE.md#4-packagesbusiness--the-business-resolver).
For the runtime types themselves, see `packages/types/src/business.ts`.

## The `Business` shape

| Field                       | Purpose                                                                                                                                                                |
| --------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `id` / `slug`               | Stable identifier and URL-safe key (today, `id === slug`; kept separate so a future backend can assign a durable numeric/UUID `id` independent of a renameable `slug`) |
| `legalName` / `displayName` | Legal name (footer/copyright) vs. marketing name (headings, nav)                                                                                                       |
| `tagline`                   | Optional short hero copy override                                                                                                                                      |
| `category`                  | One of a growing `BusinessCategory` union — see below                                                                                                                  |
| `logoUrl` / `faviconUrl`    | Brand assets                                                                                                                                                           |
| `description`               | Used in About section and as SEO fallback                                                                                                                              |
| `contact`                   | Phone, optional email, optional WhatsApp, and a structured `address` — see below on why most of these are optional                                                     |
| `hours`                     | Seven-day schedule, each day independently open/closed — an empty array is valid (hours not yet confirmed)                                                             |
| `social`                    | Optional links per platform                                                                                                                                            |
| `domains`                   | Every hostname this business should resolve on (custom domain + platform subdomain)                                                                                    |
| `isActive`                  | A business `BusinessResolver` will never resolve to when `false` — the mechanism for suspending a tenant without deleting its data                                     |
| `brandNote`                 | Optional short line shown near the logo (a motto, invocation, founding note) — localizable                                                                             |
| `supportedLocales`          | Ordered locales this business's content is available in; absent means single-language — see [i18n.md](i18n.md)                                                         |

`tagline` and `description` are `LocalizableText` (a plain string, or a
per-locale object) — see [i18n.md](i18n.md) for how that resolves.
`displayName`/`legalName` are always plain strings: a business's actual
name is never translated per locale, only the surrounding content is.

### Contact info is deliberately lenient

Real small businesses often don't have every field a Western business
form assumes — many have a phone number and nothing else. So
`BusinessContact.email` is optional, and every field on `BusinessAddress`
except the map/coordinate fields is optional. Render defensively (see
`formatAddressLine` in `@rdplatforms/utils`) rather than assuming any
particular field is present — a missing street address shouldn't produce
`"undefined, undefined"` in the UI.

## Categories are additive, not exhaustive

`BusinessCategory` (`packages/types/src/business.ts`) currently lists:
`salon`, `restaurant`, `design-studio`, `gym`, `dental-clinic`, `hotel`,
`interior-design`, `photography`, `legal`, `architecture`, `ecommerce`,
`real-estate`. Only the first three have demo content today (Swami Hair
Salon, Urban Bistro, Vision3D Studio); the rest are reserved so the type doesn't
need a breaking change as the platform grows into them.

**Category is metadata, not a behavior switch.** Nothing in `packages/ui`
or `apps/website` should branch on `category` — it exists for
categorization (future admin filtering, template galleries) not for
choosing which sections/components render. Section composition is
controlled entirely by `PageConfig`/`SectionConfig`, independent of
category. A gym and a hotel can enable the exact same sections if that's
what fits their content.

## Content is separate from identity

Services, gallery items, testimonials, FAQs, and team members are their
own types (`packages/types/src/content.ts`), each keyed by `businessId`,
not nested inside `Business`. This keeps the core `Business` record small
(cheap to load for resolution) and lets each content type evolve, paginate,
or move to its own backend table independently.

## One business, one site, one theme

The model is deliberately **one business → one website → one theme**.
There is currently no concept of a business having multiple sites/brands or
a website spanning multiple businesses (e.g. a multi-location franchise
shown as one site) — if that need arises, it should be modeled explicitly
(e.g. a `parentBusinessId` or a `Location` type) rather than overloading
`domains[]` or `Business` itself.

## Toward a marketplace (Phase 7)

The fields already in place anticipate self-serve onboarding:
`isActive` supports trial/suspended states, `domains[]` supports
bring-your-own-domain, and `category` supports a template gallery. What's
missing for a real marketplace — billing/subscription state, ownership
(which platform user administers a business), and usage limits — is
intentionally not modeled yet; adding it is Phase 7 work, not a foundation
concern. See [../ROADMAP.md](../ROADMAP.md#phase-7--marketplace-⬜-not-started).
