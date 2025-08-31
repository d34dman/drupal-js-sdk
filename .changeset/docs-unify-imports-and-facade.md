---
"drupal-js-sdk": minor
"@drupal-js-sdk/menu": patch
---

Unify docs import style and add top-level DrupalSDK facade.

- Aggregator now exports `DrupalSDK` facade exposing `auth`, `menu`, and `entities` for a smoother DX.
- Docs updated to prefer `import { DrupalSDK } from "drupal-js-sdk"` and facade usage.
- Menu adds verb-style aliases: `list()` for `getMenu()` and `raw()` for `getMenuRaw()`.

No breaking changes; previous APIs remain available.

