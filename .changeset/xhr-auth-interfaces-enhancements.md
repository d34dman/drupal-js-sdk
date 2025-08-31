---
"@drupal-js-sdk/xhr": minor
"@drupal-js-sdk/auth": minor
"@drupal-js-sdk/interfaces": minor
---

HTTP client and auth lifecycle enhancements.

- XHR
  - Add AbortSignal and request `timeoutMs` support
  - Pass through `mode` and `cache`
  - Add retry/backoff config (`retry`) to `XhrRequestConfig`
  - Capture ETag and send `If-None-Match` on subsequent requests
  - Support ArrayBuffer, ArrayBufferView, and ReadableStream bodies
  - Add optional request/response interceptor signatures to `XhrInterface`
- Auth
  - Defer CSRF token fetch to explicit `auth.init()`
  - On logout, clear session, reset user to anonymous, and clear `X-CSRF-Token`
- Interfaces
  - Extend `XhrRequestConfig` and `XhrInterface` with the new options and interceptor hooks

Backward compatible; consumers can opt into the new features.

