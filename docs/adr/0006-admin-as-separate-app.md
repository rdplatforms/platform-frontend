# 0006: Admin as a Separate App and Deployment, Not a `/admin` Route

## Status

Accepted

## Context

The platform needs an operator-facing admin console eventually managing
every business, alongside the public, single-business-per-request website.
These have different audiences, different auth requirements, different
theming needs (the website is per-business themed; the admin manages all
businesses and shouldn't inherit any one business's brand), and different
release cadences.

## Decision

`apps/admin` is its own Vite application with its own router, build, and
(future) deployment to `admin.rdplatforms.com` — not a `/admin` route
nested inside `apps/website`. See [../deployment.md](../deployment.md) and
[../ROUTES.md](../ROUTES.md).

## Consequences

- The admin can add authentication, its own dependency set, and its own
  release cycle without any risk of affecting the public website's bundle
  size or behavior.
- The admin correctly has no per-business theme — it runs a fixed platform
  theme (`apps/admin/src/App.tsx`) instead of `@rdplatforms/providers`'s
  business-scoped `AppThemeProvider`, since it isn't rendering on behalf of
  one resolved business.
- Shared UI (`@rdplatforms/ui` primitives) is still reused between the two
  apps — separation is at the app/deployment level, not a fork of the
  design system.
- This does introduce two deployments to manage instead of one; accepted
  as the right tradeoff given how different the two audiences and access
  models are (see [../future-admin.md](../future-admin.md) for what the
  admin still needs — auth, in particular — before it can go beyond
  placeholders).
