---
"@drupal-js-sdk/core": minor
---

Add default browser session store with in-memory fallback.

- `Drupal` now initializes `SessionInterface` automatically:
  - Uses `StorageInWeb(window.localStorage)` in browsers when available
  - Falls back to `StorageInMemory` otherwise (SSR, tests)
- Accepts optional `session` in `DrupalConfig` to override the default.
- `CoreInterface` now includes `getSessionService()`.

This improves DX by ensuring `DrupalAuth` and other consumers have a session by default.

