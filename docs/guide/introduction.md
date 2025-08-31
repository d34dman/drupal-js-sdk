# Introduction

The Drupal JavaScript SDK provides a small core, optional feature packages, and a high-level facade to build decoupled frontends quickly.

```js
import { DrupalSDK } from "drupal-js-sdk";

const sdk = new DrupalSDK({ baseURL: "https://example.com" });
```

Next, follow the [Getting started](getting-started.md) guide for install and setup.

---

### How it’s structured

- `@drupal-js-sdk/core`: wires config, session, and transport; exposes `Drupal`.
- `@drupal-js-sdk/xhr`: `FetchClient` and `AxiosClient` implementations.
- `@drupal-js-sdk/auth`: login/logout, CSRF/session management.
- `@drupal-js-sdk/entity` + `@drupal-js-sdk/jsonapi`: adapter-based entity access.
- `@drupal-js-sdk/storage`: in-memory and web storage utilities.
- `@drupal-js-sdk/error`: typed errors shared across packages.

Use the umbrella package `drupal-js-sdk` to import common pieces, or install individual packages as needed.

---

### Compatibility

- **Environments**: Browser and Node.js
- **Drupal**: Drupal 10 and 11

For CORS and cookie-based sessions, see [CORS](../guide/cors.md) and [Authentication](authentication.md).

---

### Contributing

We welcome issues and PRs on GitHub. For issue credit on Drupal.org, please use the Drupal issue queue[^1]




[^1]: Issue queue on Drupal.org for Drupal JS SDK: [https://www.drupal.org/project/issues/drupal_js_sdk?categories=All](https://www.drupal.org/project/issues/drupal_js_sdk?categories=All)
