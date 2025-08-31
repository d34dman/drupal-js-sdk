---
"@drupal-js-sdk/entity": minor
---

Add relationship loader and pagination passthrough.

- Attach non-enumerable `rel(name).load()` to loaded/listed records; coalesces concurrent loads
- Add `EntityService.listPage()` and `FluentEntity.listPage()` that return `{ items, page }` when adapter supports it

Backwards compatible; existing `list()`/`load()` unaffected.

