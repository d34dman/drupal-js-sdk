---
"@drupal-js-sdk/jsonapi": minor
---

Implement structured pagination via `listPage()`.

- New `listPage(options?)` parses JSON:API `meta`/`links` and returns `{ items, page }`
- Respects existing query params and typing

Non-breaking; `list()` remains unchanged.

