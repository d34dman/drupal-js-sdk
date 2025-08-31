---
"@drupal-js-sdk/menu": patch
---

Type menu linkset response and fix tree conversion loops.

- Add `MenuLinkset` and `MenuLinksetItem` types and guard against legacy/current keys.
- `getMenuRaw()` is now typed; `normalizeListItems()` uses a type guard.
- Replace side-effectful `map` with `forEach` when building the tree.

No breaking changes to the public API.

