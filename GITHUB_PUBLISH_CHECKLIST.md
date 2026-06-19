# GitHub Publish Checklist

Before publishing this project, keep the repository clean and demo-safe.

## Keep

- `README.md`
- `.gitignore`
- `server.py`
- `templates/`
- `assets/badge-showroom-pedestal-bg-dark-v3.png`
- `docs/showcase-hero.png`
- `figma-make-export/src/`
- `figma-make-export/public/`
- `figma-make-export/package.json`
- `figma-make-export/package-lock.json`
- `figma-make-export/index.html`
- `figma-make-export/vite.config.ts`
- `figma-make-export/postcss.config.mjs`

## Do Not Commit

- `uploads/`
- `generated/`
- `screenshots/`
- `logs/`
- `output/`
- `node_modules/`
- Real employee photos
- Generated badges with real personal information
- Local absolute paths or private test files

## Quick Test Before Commit

```bash
cd figma-make-export
npm install
npm run build
```

Optional backend smoke test:

```bash
cd ..
python3 -m py_compile server.py
```

## Suggested GitHub Description

```text
AI employee badge generator: photo standardization, badge template composition, and PNG export workflow.
```
