# GitHub Pages business repo — template

GitHub Pages ties one deployment to one repo (and one custom domain), so
unlike Netlify/Vercel — where many businesses' sites can all live in this
one `platform-frontend` repo as separate dashboard-configured
sites/projects — a business deployed on GitHub Pages needs its **own**,
otherwise-empty repo. This folder is what goes in it. The repo holds no
app code, just a workflow that calls back into `platform-frontend`'s
build.

## Setup (repeat once per business)

1. Create a new **public** GitHub repo for this business, e.g.
   `printforge-3d-site` (public — GitHub Pages on a private repo needs
   GitHub Pro/Team; a public repo is free and is also what keeps this
   free-tier-only).
2. Copy this folder's contents into that repo's root
   (`.github/workflows/deploy.yml`, and `CNAME.example` if using a custom
   domain).
3. Edit `.github/workflows/deploy.yml`:
   - `business-slug`: the business's slug, matching
     `static-data/businesses/<slug>.json` in `platform-frontend`.
   - `base-path`:
     - No custom domain → `/<repo-name>/` (GitHub Pages serves a
       project-page repo at `<org>.github.io/<repo-name>/`).
     - Custom domain → `/` (see step 5).
   - Uncomment `apps-script-url`/`google-analytics-id` if this business
     uses Tier 2 ([docs/backend-tiers.md](../../docs/backend-tiers.md))
     or has its own GA4 property
     ([docs/analytics.md](../../docs/analytics.md)).
4. In the new repo: **Settings → Pages → Source → GitHub Actions.**
5. **Custom domain (optional):** rename `CNAME.example` to `CNAME`,
   replace its contents with the real domain, point that domain's DNS at
   GitHub Pages (a `CNAME` record to `<org>.github.io`, or the documented
   `A`/`AAAA` records for an apex domain), and add it under
   Settings → Pages → Custom domain. Switch `base-path` to `/` once this
   is live, since the site now serves from the domain's root.
6. Push to `main`. The Action builds `platform-frontend`'s `apps/website`
   for this business and deploys it — no code in this repo ever changes
   except the one `deploy.yml` file.

See [docs/deployment.md](../../docs/deployment.md) for how this compares
to the Netlify/Vercel setup and which one to pick for a given business.
