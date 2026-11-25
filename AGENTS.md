# TypeScriptDocs: agent notes

## Kadarla platform

- Product slug: `typescriptdocs` (kadarla.com/apps/typescriptdocs), site typescriptdocs.com (GitHub Pages via
  `.github/workflows/deploy.yaml` on push to main).
- Tracked: the cookieless kadarla beacon, added in `docs/.vitepress/config.mts` (`head` → `https://kadarla.com/k.js`):
  pageviews (VitePress client navigation included), referrers, countries, devices, outbound clicks, time on page.
- For traffic, reviews, uptime or releases use the kadarla skill:
  /Users/saichandankadarla/Code/active/kadarla-platform/skills/kadarla/SKILL.md (CLI: `kp`).
