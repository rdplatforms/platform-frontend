# AI Operating Instructions

Instructions for any AI coding agent (Claude Code or otherwise) working in
this repository. Read this before making changes — it encodes decisions
that are easy to accidentally undo.

## Mental model

This is a **platform**, not a website. Before writing code, ask: _"will
this still make sense with 500 businesses?"_ If the answer is no, don't
implement it as-is — find the data-driven version. Concretely:

- Never write `if (business.slug === '...')` or `if (business.category ===
'...')` in `packages/ui` or `apps/website`. If a business needs different
  behavior, that's a missing field on `Business` / `BusinessTheme` /
  `SectionConfig`, not a conditional.
- Never import from `@rdplatforms/static-data` outside of
  `packages/services`. Everything else goes through a `*Service`.
- Never add a new npm script per business (`npm run salon`, etc.) or a new
  env var per business. Business identity is data (`static-data/businesses/*.json`
  today, a database row later), resolved at runtime by
  `@rdplatforms/business`.

See [ARCHITECTURE.md](ARCHITECTURE.md) for the full layer breakdown before
touching `packages/services`, `packages/business`, or the theme engine.

## Before implementing

- Prefer reusable architecture over the fastest working version. If a task
  looks like it wants a one-off component or a hardcoded value, stop and
  check whether it should be a new field, service method, or section type
  instead.
- Don't add abstractions the task doesn't need, either — three similar
  lines beat a premature generic. The services/hooks/section patterns
  already established in this repo are the abstraction; don't invent a
  second one alongside them.
- Check [TODO.md](TODO.md) and [docs/adr/](docs/adr/) before re-deciding
  something that was already decided — if you disagree with a past
  decision, write a new ADR that supersedes it rather than silently
  diverging.

## While implementing

- Follow [CODING_STANDARDS.md](CODING_STANDARDS.md),
  [COMPONENT_GUIDELINES.md](COMPONENT_GUIDELINES.md), and
  [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md) exactly — they exist because the
  patterns they encode are what makes this repo scale to many businesses.
- Any new content type needs, in order: a type in `@rdplatforms/types`, a
  `*DataSource` interface + `JsonDataSource` implementation in
  `@rdplatforms/services`, a `*Service`, a hook in `@rdplatforms/hooks` (via
  `useBusinessScopedQuery` if it's business-scoped), and — if it's
  rendered — a section component registered in `SectionRenderer`.
- Add or update unit tests for anything in `packages/business`,
  `packages/services`, or `packages/utils`. These are the layers where a
  silent regression is expensive (wrong business resolved, wrong data
  returned) and cheap to catch.
- Run `pnpm typecheck && pnpm lint && pnpm format:check && pnpm test &&
pnpm build` before considering a change complete.
- For UI changes, actually run the dev server and look at the page (or
  drive it headlessly) — a passing typecheck is not evidence the page
  renders correctly.

## After implementing

- Update [PROGRESS.md](PROGRESS.md) with what changed, [TODO.md](TODO.md)
  status, and [CHANGELOG.md](CHANGELOG.md) under `[Unreleased]`.
- If you made an architectural decision, add an ADR under `docs/adr/`.
- Treat each completed, verified feature as a milestone: commit it with a
  [Conventional Commits](https://www.conventionalcommits.org/) message
  (see [CONTRIBUTING.md](CONTRIBUTING.md)).

## Git and commit hygiene

- **Never mention AI, Claude, ChatGPT, or code generation in a commit
  message, code comment, or docstring.** This repository is maintained like
  any other professional codebase — commit messages describe what changed
  and why, not who or what wrote it.
- No `// removed` comments, no dead code left "just in case", no
  backwards-compatibility shims for code that was never released.
- Prefer several small, well-scoped commits over one large one when a task
  naturally splits into independent milestones (foundation, then business
  resolver, then a section, etc.) — each should type-check, lint, and pass
  tests on its own.
- Never force-push, rewrite published history, or bypass hooks
  (`--no-verify`) without explicit, in-the-moment user approval — a prior
  approval does not carry forward to a later, unrelated action.

## When you're unsure

If a request conflicts with the platform's constraints (e.g. "just
hardcode it for this one business" or "add a special env var for this
client"), say so and propose the data-driven alternative rather than
silently complying — that's the difference between this staying a platform
and it drifting back into a one-off website.
