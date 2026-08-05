# Folder Structure

```
platform-frontend/
├── apps/
│   ├── website/            Public multi-tenant business website
│   │   ├── public/assets/businesses/<slug>/...   Per-business static assets
│   │   └── src/
│   │       ├── components/     App-local components (BusinessGate)
│   │       ├── pages/          HomePage, NotFoundPage
│   │       ├── routes/         router.tsx
│   │       ├── seo/            DocumentHead
│   │       ├── App.tsx
│   │       └── main.tsx
│   └── admin/               Platform operator console (scaffolded)
│       └── src/
│           ├── layout/         AdminLayout (sidebar + top bar)
│           ├── pages/          Dashboard/Pages/Media/Services/Business/Theme/Users/Settings
│           ├── routes/         router.tsx
│           ├── App.tsx
│           └── main.tsx
├── packages/
│   ├── types/               Shared TypeScript contracts
│   ├── utils/                Pure helpers: formatters, slug, validators (+ tests)
│   ├── services/             Data access layer
│   │   └── src/dataSource/     *DataSource interfaces + JsonDataSource
│   ├── business/             BusinessResolver
│   │   └── src/resolvers/      Pure resolution strategies (+ tests)
│   ├── contexts/             React context definitions only — no logic
│   ├── providers/            Context providers + theme engine
│   │   └── src/theme/          createAppTheme.ts
│   ├── hooks/                 TanStack Query hooks over the services layer
│   └── ui/                    Reusable, business-agnostic UI
│       └── src/
│           ├── primitives/       Button, Card, Badge, Container, PageSection, SectionTitle
│           ├── layout/            Navbar, Footer
│           └── sections/          Hero, About, Services, Gallery, Testimonials,
│                                   Faq, Cta, Contact, MapSection, Pricing, Team,
│                                   SectionRenderer
├── static-data/               Temporary JSON data source (see future-backend-contract.md)
│   └── businesses/              One JSON file per business + an index manifest
├── docs/                       Deep-dive documentation (this folder)
│   └── adr/                       Architecture Decision Records
└── <root docs>                README, ARCHITECTURE, ROADMAP, TODO, PROGRESS,
                                CHANGELOG, CODING_STANDARDS, COMPONENT_GUIDELINES,
                                DESIGN_SYSTEM, ROUTES, CONTRIBUTING,
                                AI_OPERATING_INSTRUCTIONS
```

## Why this shape, not `src/` for everything

Two apps and eight packages share code in a way a single `src/` tree can't
express cleanly: `apps/website` and `apps/admin` are independent
deployables with their own `package.json`, `vite.config.ts`, and dependency
graph, while `packages/*` are internal libraries consumed by both (or by
each other). A pnpm workspace is what makes `import { Business } from
'@rdplatforms/types'` resolve correctly across that boundary without a
publish step, while keeping each package's dependencies explicit in its own
`package.json` — no package silently relies on something hoisted from a
sibling.

## Package dependency direction

Dependencies only flow one way — there is no cycle:

```
types  →  utils  →  services  →  business
                         │            │
                         ▼            │
                     contexts ◄───────┘
                         │
                         ▼
                     providers  →  hooks  →  ui
                                              │
                                              ▼
                                    apps/website, apps/admin
```

`apps/admin` currently only depends on `types` and `ui` (for shared
primitives in its placeholder pages) — it intentionally does not depend on
`business`/`providers`/`hooks` yet, since it has no per-business rendering
to do until Phase 3 work begins.

## `static-data` as its own workspace package

`static-data/` has its own `package.json` (`@rdplatforms/static-data`) with
an `exports` map, rather than being consumed via ad hoc relative paths. That
makes the temporary-JSON boundary a real package boundary: only
`packages/services` depends on it, which is enforced by every other
package's `package.json` simply not listing it as a dependency.
