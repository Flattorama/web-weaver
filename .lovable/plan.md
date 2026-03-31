

## GitHub Pages Deployment via GitHub Actions

### Problem
GitHub Pages serves from a subpath (`/repo-name/`), not root. Vite needs a matching `base` config, and the router needs a matching `basename`. But Lovable preview must keep serving from `/`.

### Changes

**1. Update `vite.config.ts`**
- Add a conditional `base` property: use env var `GITHUB_PAGES_BASE` or default to `"/"`.
- In the GitHub Actions workflow, we'll set this to the repo name.
- This way Lovable preview stays at `/` (no env var set), while GH Pages builds get the correct subpath.

**2. Update `src/App.tsx`**
- Pass `basename` to `BrowserRouter` that reads from `import.meta.env.BASE_URL` (Vite injects the `base` value automatically). This keeps routing working on both Lovable and GitHub Pages.

**3. Create `.github/workflows/deploy.yml`**
- Triggers on push to `main`.
- Steps: checkout → setup Node 20 → install deps → build with `GITHUB_PAGES_BASE` set to `/${{ github.event.repository.name }}/` → upload artifact → deploy to GitHub Pages.
- Uses the official `actions/deploy-pages` action.

### Technical Details

```
vite.config.ts:
  base: process.env.GITHUB_PAGES_BASE || "/"

App.tsx:
  <BrowserRouter basename={import.meta.env.BASE_URL}>

deploy.yml:
  - env: GITHUB_PAGES_BASE: /${{ github.event.repository.name }}/
  - npm ci && npm run build
  - actions/upload-pages-artifact (path: dist)
  - actions/deploy-pages
```

The user will need to enable GitHub Pages in their repo settings (Settings → Pages → Source: GitHub Actions) after the first push.

