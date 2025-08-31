---
"@drupal-js-sdk/interfaces": minor
"@drupal-js-sdk/entity": minor
"@drupal-js-sdk/jsonapi": minor
---

Entity layer enhancements: optional list/count, fluent builder params interop.

- Interfaces:
  - Make `EntityAdapter.list` optional so custom adapters are not forced to implement it.
  - Add optional `EntityAdapter.count(options?)` for adapters that can return a total.
- Entity package:
  - Expose `count()` via `EntityLoader` and `EntityService`.
  - Fluent builder adds `.params(obj)` and `.fromParams(instance)` interop (duck-type `.getQueryObject()`).
  - New helpers: `.findOne()` and `.count()`.
- JSON:API adapter:
  - Implements optional `count()` using `meta.count` when available, falling back to `data.length`.

These are additive changes designed to be backward compatible.

