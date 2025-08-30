# Svelte SPA Demo (Auth + Menu)

This demo showcases authentication and menu loading with `drupal-js-sdk` in a Svelte (non-Kit) app using Vite + Tailwind + DaisyUI.

## Setup

Create `.env` in this folder with:

```
VITE_DRUPAL_BASE_URL=https://drupal-js-sdk-server.ddev.site
VITE_DEMO_USERNAME=admin
VITE_DEMO_PASSWORD=admin
```

Install dependencies and run dev server:

```
pnpm install
pnpm --filter demo-svelte-spa dev
```

Open the provided local URL.

## What it demonstrates
- Login using `@drupal-js-sdk/auth` (cookie-based)
- Menu loading using `@drupal-js-sdk/menu` from `main` menu

Ensure CORS is configured on the Drupal backend to allow this app's origin.
