

## Deploy to Custom Domain: event.stillliferetreat.com

When using a custom domain with GitHub Pages, the site is served from `/` (not a repo subdirectory), so the `GITHUB_PAGES_BASE` override is no longer needed. We also need a `CNAME` file.

### Changes

1. **Create `public/CNAME`** — contains `event.stillliferetreat.com`. This gets copied to `dist/` during build so GitHub Pages knows the custom domain.

2. **Update `.github/workflows/deploy.yml`** (line 32) — remove the `GITHUB_PAGES_BASE` env var from the build step, since the site will be served at `/`.

3. **Update `index.html`** — update `og:url` or any absolute URLs if present (quick audit needed, but likely none beyond the existing OG image URLs which are external).

### DNS setup (manual, on your domain registrar)
You'll need to add a `CNAME` record for `event` pointing to `<your-github-username>.github.io` at your DNS provider for `stillliferetreat.com`.

### Files
- `public/CNAME` (new)
- `.github/workflows/deploy.yml` (edit line 30-32)

