# 0001: pnpm Workspace Monorepo

## Status

Accepted

## Context

The platform needs a public website, an admin console, and a substantial
amount of shared code (types, services, business logic, UI) between them,
plus room to add more apps later (see ROADMAP Phase 4+). We need to share
TypeScript code across app boundaries without publishing internal packages
to a registry, while keeping each app's dependency graph explicit.

## Decision

Use a single repository with pnpm workspaces: `apps/*` for deployable
applications, `packages/*` for internal libraries, and `static-data` as its
own workspace package. Internal packages are consumed directly from source
(`"main": "./src/index.ts"`, no build step) — Vite transforms them as part
of each app's own build, and each package type-checks independently via
`tsc --noEmit`.

## Consequences

- Adding a package is cheap (a `package.json` + `tsconfig.json` + `src/`);
  no publish/version/bump cycle for internal-only code.
- Every package must declare its actual dependencies in its own
  `package.json` — no relying on hoisting from a sibling. pnpm's strict
  `node_modules` enforces this.
- No project-references build graph (`tsc -b`) is needed since nothing
  needs compiled `.d.ts` output for internal consumption — simpler
  tooling, at the cost of not being able to `tsc -b` the whole repo in one
  pass (we run `pnpm -r typecheck` instead, which is equivalent in
  practice).
- If a package is ever published externally (e.g. `@rdplatforms/ui` as a
  public design system), it will need a real build step added at that
  point — not before.
