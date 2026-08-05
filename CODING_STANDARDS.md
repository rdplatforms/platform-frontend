# Coding Standards

## TypeScript

- Strict mode is on everywhere (`tsconfig.base.json`): `strict`,
  `noUncheckedIndexedAccess`, `noUnusedLocals`, `noUnusedParameters`. Don't
  weaken these in a package-level `tsconfig.json`.
- Prefer `type` imports (`import type { X } from '...'`) for types —
  enforced by `@typescript-eslint/consistent-type-imports`.
- No `any`. If a type is genuinely unknown, use `unknown` and narrow it.
- Every shared shape lives in `@rdplatforms/types`. Don't redefine a
  `Business`-shaped object locally — import it.

## React

- Function components only. No class components.
- Co-locate a component's own types with it; only promote a type to
  `@rdplatforms/types` when more than one package needs it.
- Hooks that fetch content go in `@rdplatforms/hooks`, built on
  `useBusinessScopedQuery`, not ad hoc `useEffect` + `useState` in
  components. `BusinessProvider`/`AppThemeProvider` are the deliberate
  exceptions — they resolve the business/theme other hooks depend on, so
  they can't depend on `@rdplatforms/hooks` themselves.
- Don't reach into `@rdplatforms/services` or `static-data` from a
  component. Go through a hook.

## Services & data access

- Every content type gets a `*DataSource` interface in
  `packages/services/src/dataSource/types.ts` before it gets a concrete
  implementation. Components depend on the `*Service`, never on
  `JsonDataSource` directly.
- `*DataSource` methods are always `Promise`-returning, even though
  `JsonDataSource` is synchronous under the hood — this is what makes the
  future `HttpDataSource` swap invisible to callers.
- Never import from `@rdplatforms/static-data` outside of
  `packages/services`.

## Business logic

- Nothing under `packages/ui` or `apps/website/src/pages` may hardcode a
  business slug, name, or category. If you're tempted to write
  `if (business.slug === 'royal-salon')`, the correct fix is a new field on
  `Business`/`BusinessTheme`/`SectionConfig`, not a conditional.
- Resolution strategies (`packages/business/src/resolvers/*`) must stay
  pure functions: same `(context, businesses)` in, same slug out, no I/O.

## Formatting & linting

- Prettier (`.prettierrc.json`) and ESLint (`eslint.config.js`) are
  non-negotiable — run `pnpm format` and `pnpm lint` before committing.
  CI treats both as failures, not warnings.
- Don't hand-format JSON in `static-data/` — let Prettier do it.

## Testing

- Pure logic (resolvers, services, utils) gets unit tests. Favor testing
  through the public API of a package (`import from '../src'`), not its
  internals.
- A new `*DataSource` method or resolution strategy is not done until it
  has a test.

## General

- No dead code, no commented-out blocks, no `// TODO` without a matching
  entry in `TODO.md`.
- Small, focused functions. If a section component's render function needs
  a code comment to explain what it's doing (not why), it's doing too much.
- See [COMPONENT_GUIDELINES.md](COMPONENT_GUIDELINES.md) for
  component-specific rules and [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md) for
  theming rules.
