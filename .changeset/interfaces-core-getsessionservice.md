---
"@drupal-js-sdk/interfaces": minor
---

Expose `getSessionService()` on `CoreInterface`.

- Adds `getSessionService()` so consumers can access the configured `SessionInterface` directly from core.
- Aligns interfaces with the default session store initialization in core for better DX and SSR safety.

Backward compatible; additive interface surface.


