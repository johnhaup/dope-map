# Demo site

The playground at https://johnhaup.github.io/dope-map. Vite + React, built on the library source in `../src` (not the published package), so it always shows the current DopeMap.

```sh
bun install
bun run dev     # http://localhost:3456/dope-map/
bun run build   # type check + production build to dist/
```

Pushing to `main` with changes under `docs/` or `src/` deploys it through `.github/workflows/docs.yml`.
