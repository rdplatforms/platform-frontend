# 0002: Business Resolver as an Ordered Strategy List

## Status

Accepted

## Context

The website is one deployment serving many businesses. Something has to
decide, per request, which business is being rendered — using different
signals depending on environment: a real hostname in production, a
developer override locally, and a fallback when neither is available. That
logic needs to be testable without a browser and extensible without
touching a growing `if/else` chain.

## Decision

Model resolution as an ordered list of independent, pure `BusinessResolverStrategy`
objects (`packages/business/src/resolvers/*`), each with a single
`resolveSlug(context, businesses) => string | undefined` method:

1. `queryParamBusinessResolver` — `?business=<slug>` (dev/staging override)
2. `hostnameBusinessResolver` — matches `Business.domains[]`
3. `envBusinessResolver` — `VITE_DEFAULT_BUSINESS_SLUG` fallback

`BusinessResolver.resolve()` runs them in order, taking the first slug that
maps to an **active** business, rather than any single strategy trying to
handle every case itself.

## Consequences

- Each strategy is a pure function — no I/O, no mocking required — so
  `packages/business/tests/resolvers.test.ts` tests them in complete
  isolation.
- Adding a new resolution signal (e.g. a signed preview token, or a
  server-side header once SSR exists) is a new strategy inserted at the
  right priority — no existing strategy changes.
- Priority order is explicit and centralized
  (`DEFAULT_STRATEGIES` in `BusinessResolver.ts`), not implied by code
  layout.
- `BusinessResolver` itself stays a thin orchestrator; all business logic
  about _what counts as a match_ lives in the strategies, and _what counts
  as resolvable_ (must be active) lives in the resolver's final check.
