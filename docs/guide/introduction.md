# Introduction

Build modern, decoupled apps that talk to :fontawesome-brands-drupal: Drupal — quickly and safely.

**Drupal JavaScript SDK** gives you typed building blocks for authentication, HTTP, storage, and entities so you can focus on product, not plumbing.

---

### What problems does it solve?

- **HTTP without ceremony**: A simple `XhrInterface` with `fetch` or `axios` clients.
- **Session & CSRF handled**: `DrupalAuth` manages login, CSRF token, and logout.
- **Typed errors**: Consistent `DrupalError` codes you can rely on.
- **Entities when you need them**: `EntityService` + `JsonApiEntityAdapter` to load content via JSON:API.

See the big picture:
- [System Architecture](../dev/architecture.md)
- [Runtime Architecture](../dev/runtime.md)
- [Login Sequence](../dev/sequence-login.md)

---

### Quick look

```ts
import { Drupal } from "drupal-js-sdk";
import { DrupalAuth } from "@drupal-js-sdk/auth";

const drupal = new Drupal({ baseURL: "https://example.com" });
// In browser apps provide a session store (e.g. localStorage wrapper)
// drupal.setSessionService(new StorageInWeb());

const auth = new DrupalAuth(drupal);
await auth.getSessionToken();
const isLoggedIn = await auth.loginStatus();
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
