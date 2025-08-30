---
"@drupal-js-sdk/interfaces": minor
"@drupal-js-sdk/entity": minor
"@drupal-js-sdk/jsonapi": minor
"@drupal-js-sdk/xhr": patch
---

Improve developer experience for entity loading and listing.

- interfaces (minor):
  - Add `EntityListOptions` and extend `EntityAdapter` with `list()`.
- entity (minor):
  - Add `EntityLoader.list(options)` and convenience `EntityService.list(...)` / `EntityService.load(...)` methods.
- jsonapi (minor):
  - Implement `list()` to GET collection results and normalize to `EntityRecord[]`.
- xhr (patch):
  - Bind global `fetch` in `FetchClient` to avoid "Illegal invocation" errors in browsers.
  - Ensure request body from `config.data` is sent (JSON by default, preserves FormData/URLSearchParams/Blob).

These changes enable cleaner collection queries and single-record loads (with optional `jsonapi.query`) and fix POST body handling.

