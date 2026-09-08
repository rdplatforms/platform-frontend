# 0014: Multi-host deployment templates (Vercel, GitHub Pages)

## Status

Accepted. Extends
[0009-netlify-interim-deployment.md](0009-netlify-interim-deployment.md),
which still stands — the per-business, `VITE_DEFAULT_BUSINESS_SLUG`-forced
deployment model is unchanged. This ADR only adds hosts.

## Context

Only Netlify was wired up (`netlify.toml`, one business per site). Real
businesses will land on a mix of hosts — free subdomains for some, a
custom domain for others, occasionally a preference for GitHub Pages
specifically. All three needed a documented, repeatable recipe rather
than being figured out ad hoc per business.

Netlify and Vercel share a model: many independent sites/projects can all
point at this one repo, each configured (env vars, subdomain) entirely in
that host's own dashboard, with one shared build-config file at the repo
root (`netlify.toml`, `vercel.json`). GitHub Pages does not fit that
model — a GitHub Pages deployment is tied to exactly one repo (and, with
a custom domain, exactly one domain). It cannot host several businesses
out of this one shared repo the way the other two can.

## Decision

- **Vercel**: add `vercel.json` as a direct analogue of `netlify.toml` —
  same build command, same output directory, same SPA-fallback rewrite.
  No new architecture; it's the same "one shared config file, many
  dashboard-configured sites" pattern already established for Netlify.
- **GitHub Pages**: since one repo maps to one site, give each business
  its **own thin repo** rather than trying to force GitHub Pages into the
  Netlify/Vercel shape. That thin repo holds no app code — only a
  GitHub Actions workflow (from
  [templates/github-pages-business-repo/](../../templates/github-pages-business-repo/))
  that calls a **reusable workflow** defined once in `platform-frontend`
  itself
  ([.github/workflows/deploy-business-github-pages.yml](../../.github/workflows/deploy-business-github-pages.yml)).
  The reusable workflow checks out `platform-frontend`, builds
  `apps/website` with that business's env vars, and deploys the result to
  the _calling_ repo's Pages site. This mirrors the pattern already used
  for Tier 2 ([0013](0013-tiered-backend-per-business.md)) — a template
  deployed unmodified per business, with the real logic centralized in
  one place, not copy-pasted.
- `apps/website/vite.config.ts` reads `base` from a `VITE_BASE_PATH` env
  var (default `'/'`), needed only for a GitHub Pages _project page_ URL
  (`<org>.github.io/<repo-name>/`), since that's the one host that serves
  from a sub-path rather than a domain root.

## Consequences

- Netlify/Vercel: adding a business is dashboard-only, no repo changes,
  clean free subdomain, no CI/CD gate before deploy.
- GitHub Pages: adding a business means creating a new repo — real setup
  overhead per business, and no clean free subdomain without a custom
  domain (only a sub-path project-page URL) — a genuine tradeoff against
  the other two hosts, not a strictly better option. Documented in
  [deployment.md#picking-a-host](../deployment.md#picking-a-host) so this
  is a deliberate per-business choice, not a default.
- The GitHub Pages path is the only one of the three with a real CI
  pipeline (a GitHub Actions workflow) — but it still only builds and
  deploys, it doesn't run `pnpm lint`/`typecheck`/`test` first. A
  pre-deploy quality gate is a reasonable follow-up, not built here.
