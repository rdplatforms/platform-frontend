# Contributing

## Setup

```bash
pnpm install
pnpm dev:website   # http://localhost:5173
pnpm dev:admin     # http://localhost:5174
```

Copy `apps/website/.env.example` to `apps/website/.env` if you want a
different default business than `swami-hair-salon` when no hostname/query
override applies.

## Before opening a PR

```bash
pnpm typecheck
pnpm lint
pnpm format:check
pnpm test
pnpm build
```

All five must pass. None of them are optional — CI enforces the same set.

## Workflow

1. Read [ARCHITECTURE.md](ARCHITECTURE.md) if you haven't — most PRs that
   "add a special case" are solving the wrong layer, and it's cheaper to
   catch that before writing code than in review.
2. Make your change following [CODING_STANDARDS.md](CODING_STANDARDS.md)
   and, for UI work, [COMPONENT_GUIDELINES.md](COMPONENT_GUIDELINES.md) /
   [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md).
3. Add or update tests for any logic in `packages/business`,
   `packages/services`, or `packages/utils`.
4. Update [TODO.md](TODO.md) (status/priority) and append an entry to
   [PROGRESS.md](PROGRESS.md) for anything user-visible or architecturally
   notable. Update [CHANGELOG.md](CHANGELOG.md) under `[Unreleased]`.
5. If you made an architectural decision (not just an implementation
   choice), add an ADR under `docs/adr/` — see the existing ones for the
   format.

## Commit messages

[Conventional Commits](https://www.conventionalcommits.org/), one logical
change per commit:

```
feat: add pricing section component
fix: correct hostname normalization for www-prefixed domains
refactor: extract shared PageSection spacing logic
docs: document the theme engine
test: add BusinessResolver priority-order tests
chore: bump vite to 6.1
```

Keep messages concise and scoped to what changed — a commit body is
welcome for the "why" when it isn't obvious from the diff.

## Adding a business (today, static data)

1. Add `static-data/businesses/<slug>.json` following the existing shape.
2. Add the slug to `static-data/businesses/index.json`.
3. Add entries for that business in `services.json`, `gallery.json`,
   `testimonials.json`, `theme.json`, `seo.json`, `pages.json`,
   `settings.json`, and (if used) `faq.json` / `team.json`.
4. Register the business's JSON in
   `packages/services/src/dataSource/JsonDataSource.ts`'s
   `BUSINESSES_BY_SLUG` map (this is the one place that will disappear once
   `HttpDataSource` exists).
5. Add placeholder assets under
   `apps/website/public/assets/businesses/<slug>/...` matching the paths
   used in the JSON.

## Adding a new section type

See [COMPONENT_GUIDELINES.md](COMPONENT_GUIDELINES.md#section-component-contract).

## Reporting issues

Open a GitHub issue against `rdplatforms/platform-frontend` describing the
problem, expected behavior, and which business/app it reproduces on.
