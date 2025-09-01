# Drupal JavaScript SDK


<figure markdown="1">
![Decoupled Drupal](assets/svg/decoupled-drupal.svg){ width=150 }
</figure>


Build modern JavaScript apps that connect to Drupal — fast and with minimal fuss. :material-rocket:

<div class="grid cards" markdown>

-   :material-clock-fast:{ .lg .middle } __Set up in 5 minutes__

    ---


    Install, configure, and make your first request in minutes.

    [:octicons-arrow-right-24: Getting started](guide/getting-started.md)

-   :material-scale-balance:{ .lg .middle } __Open Source, MIT__

    ---

    Drupal JavaScript SDK is licensed under MIT and available on [GitHub](https://github.com/d34dman/drupal-js-sdk/blob/main/LICENSE)

    [:octicons-arrow-right-24: License](https://github.com/d34dman/drupal-js-sdk/blob/main/LICENSE)


-   :fontawesome-brands-drupal: **Decoupled Drupal**

    ---

    Tightly integrated with Drupal Core's Authentication, Menu & Entity systems.


-   :fontawesome-brands-js: **JavaScript**

    ---

    JavaScript API that works in NodeJS and Browser.




</div>

---

## Why this SDK?

- :material-check: **Simple core**: Config, session, HTTP client
- :material-check: **Pick what you need**: `@drupal-js-sdk/auth`, `@drupal-js-sdk/menu`, etc.
- :material-check: **Entities**: `@drupal-js-sdk/entity` + adapters like `@drupal-js-sdk/jsonapi`
- :material-check: **Typed**: Strict TypeScript types and clear error primitives

---

## Install

=== "npm"

    ```bash
    npm install drupal-js-sdk @drupal-js-sdk/auth
    # optional
    npm install @drupal-js-sdk/entity @drupal-js-sdk/jsonapi
    ```

=== "yarn"

    ```bash
    yarn add drupal-js-sdk @drupal-js-sdk/auth
    # optional
    yarn add @drupal-js-sdk/entity @drupal-js-sdk/jsonapi
    ```

---

## Quick start

```js
import { DrupalSDK } from "drupal-js-sdk";
import { JsonApiEntityAdapter } from "@drupal-js-sdk/jsonapi";

const sdk = new DrupalSDK({ baseURL: "https://example.com" });

// Auth
await sdk.auth.login("admin", "Z1ON0101");

// Entities via JSON:API
sdk.entities.registerAdapter("jsonapi", (ctx) => new JsonApiEntityAdapter(ctx));
const article = await sdk.entities
  .entity({ entity: "node", bundle: "article" }, "jsonapi")
  .load("123");

// Pagination
const { items, page } = await sdk.entities.node('article').page({ limit: 5 }).listPage();
```

> Note: The HTTP client supports AbortSignal, timeouts, and retry/backoff.

---

## Explore next

- [Intro & Architecture](guide/introduction.md)
- [Authentication](guide/authentication.md)
- [Menus](guide/menu.md)
