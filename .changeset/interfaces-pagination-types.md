---
"@drupal-js-sdk/interfaces": minor
---

Add pagination result types and optional listPage API.

- New types: `EntityPageInfo`, `EntityListResult<T>`
- `EntityAdapter` gains optional `listPage(options?)` returning `{ items, page }`

These are additive and backward compatible.

