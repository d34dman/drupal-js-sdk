---
"@drupal-js-sdk/entity": patch
"@drupal-js-sdk/jsonapi": patch
---

Strengthen generics and remove `any` in entity and JSON:API layers.

- EntityLoader: replace `(as any)` with typed narrowing for optional adapter methods.
- FluentEntity: add precise filter value typing and safer param building; remove `any`.
- JsonApiEntityAdapter: parse response with type guards and return `EntityRecord<T>` with stricter attributes/relationships typing.

No breaking API changes; improvements are internal typing and safety.
