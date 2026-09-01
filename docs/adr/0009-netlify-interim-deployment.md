# 0009: Netlify Interim Deployment — One Site Per Business via Env Var, Not Hostname Yet

## Status

Accepted

## Context

The long-term deployment shape (see [../deployment.md](../deployment.md))
is one `apps/website` build serving every business, resolved by hostname
against `Business.domains[]`. That requires real custom domains DNS-pointed
at the deployment. The first real business (Swami Hair Salon) needed to go
live for an owner demo before any of that domain/DNS work exists — the
resolver's hostname path has nothing to match yet.

## Decision

Deploy `apps/website` to its own Netlify site per business, using the
existing `VITE_DEFAULT_BUSINESS_SLUG` fallback (already part of
`BusinessResolver`'s ordered strategies — see
[0002](0002-business-resolver-strategy-pattern.md)) instead of hostname
matching. A `netlify.toml` at the repo root defines the build once
(`pnpm build:website`, publish `apps/website/dist`, SPA redirect); each
site only differs by that one environment variable.

## Consequences

- Zero code or resolver changes required — the env-default strategy this
  approach relies on already existed for local dev, unchanged.
- Onboarding a demo site for a new business is a Netlify site + one env
  var, not a deploy pipeline change.
- This is explicitly not the end state: it produces one Netlify site per
  business rather than one shared deployment. Moving a business to the
  long-term hostname-resolved shape later is additive (add its real domain
  to `domains[]`, point DNS at it) — the env var simply stops being the
  thing that resolves it, nothing has to be removed first.
- Netlify's own free/default domain (`*.netlify.app`) never appears in any
  business's `domains[]`, so it can never accidentally resolve the wrong
  business — the env var is the only thing making it resolve at all.
