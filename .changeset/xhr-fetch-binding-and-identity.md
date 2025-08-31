---
"@drupal-js-sdk/xhr": patch
---

Fetch client: bind for safety, preserve identity for tests.

- Ensure the internal fetch function is bound to the global to avoid illegal invocation errors.
- Expose the original (unbound) client via `getClient()` so identity comparisons in tests continue to work.

No API changes; behavior is safer across environments.

