# Drupal JS SDK – Svelte Demo

This demo app lives inside the monorepo and consumes local workspace packages.

## Run locally

```bash
pnpm i
pnpm -r build   # build SDK packages
pnpm dev:demo:svelte
```

Set the backend:

```bash
export VITE_DRUPAL_BASE_URL="https://example-drupal.local"
```

## Scripts

- `pnpm dev:demo:svelte` – start dev server
- `pnpm build:demo:svelte` – build demo
- `pnpm preview:demo:svelte` – preview build

## Notes

- Dependencies are linked to `workspace:^` so the demo always runs against your local packages.
- Session is handled by `svelte-kit-cookie-session`. Update `SESSION_SECRET`/`SESSION_KEY` as needed.
