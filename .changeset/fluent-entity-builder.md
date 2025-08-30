---
"@drupal-js-sdk/entity": minor
---

Add fluent entity builder for improved DX.

- New `FluentEntity` with chainable API: `select`, `include`, `sort`, `page`, filters (`whereEq`, `whereContains`, `whereIn`, `whereRange`).
- Add `DrupalEntity.node(bundle)` to obtain a fluent builder.
- Support `id(...).get()` for single record and `.list()` for collections.
- Export `FluentEntity` from `@drupal-js-sdk/entity`.

These changes enable concise, discoverable entity queries while remaining adapter-agnostic.

