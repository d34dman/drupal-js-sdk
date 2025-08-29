# CORS (draft)

!!! note
    You don't need to bother about this section if your application is living under the same domain as the Drupal installation.

## What and Why?

Cross-Origin Resource Sharing (CORS)[^1] controls which websites can call your Drupal backend from the browser.
If your frontend runs on a different origin (scheme/host/port), you must enable and configure CORS on the Drupal side.

[^1]: Cross-Origin Resource Sharing (CORS): [https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)



## Configure Drupal (services.yml)

CORS in Drupal is configured[^2] in `sites/default/services.yml` (or an environment-specific override).

[^2]:
    Opt-in CORS support (Change record on Drupal.org): [https://www.drupal.org/node/2715637](https://www.drupal.org/node/2715637)

Minimal example (GET only, public APIs):

```yaml
# sites/default/services.yml
cors.config:
  enabled: true
  allowedOrigins: ['^https?://localhost(:[0-9]+)?$', '^https://app\.example\.com$']
  allowedHeaders: ['x-requested-with', 'content-type', 'accept']
  allowedMethods: ['GET', 'OPTIONS']
  exposedHeaders: []
  maxAge: 86400
  supportsCredentials: false
```

Cookie/session-based example (credentials, unsafe methods):

```yaml
# sites/default/services.yml
cors.config:
  enabled: true
  # EXACT origins only when credentials are involved (no '*')
  allowedOrigins: ['^https://app\.example\.com$']
  allowedHeaders: ['x-csrf-token', 'content-type', 'accept', 'authorization', 'x-requested-with']
  allowedMethods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS']
  exposedHeaders: ['x-csrf-token']
  maxAge: 86400
  supportsCredentials: true
```

!!! warning
    **Wildcard origins + credentials**

    Browsers reject `Access-Control-Allow-Origin: *` when `Access-Control-Allow-Credentials: true`.
    Use explicit origins (exact host, protocol and port) via regex patterns.

!!! tip
    **CSRF tokens for write requests**

    For `POST/PATCH/DELETE`, include an `X-CSRF-Token` header. Drupal exposes a token endpoint at `/session/token` by default.

---

## Frontend configuration


=== "SDK (FetchClient)"

    ```js hl_lines="4"
    import { Drupal } from "drupal-js-sdk";
    import { FetchClient } from "@drupal-js-sdk/xhr";

    const client = new FetchClient({ baseURL: "https://api.example.com", withCredentials: true });
    const drupal = new Drupal({ baseURL: "https://api.example.com" });

    drupal.setClientService(client);
    ```

=== "Fetch API (vanilla)"

    ```js hl_lines="4"
    // Include credentials for cookie-based auth
    await fetch("https://api.example.com/jsonapi/node/article", {
      method: "GET",
      credentials: "include", // important
      headers: { "Accept": "application/vnd.api+json" }
    });
    ```

=== "Axios"

    ```js hl_lines="5"
    import axios from "axios";

    const api = axios.create({
      baseURL: "https://api.example.com",
      withCredentials: true, // important
    });

    await api.get("/jsonapi/node/article");
    ```


!!! note
    **SameSite cookies**

    When using cross-site cookies, ensure your session cookie is set with `SameSite=None; Secure` and served over HTTPS. Otherwise, browsers will not send the cookie.


## Getting a CSRF token (Drupal)

```js
const res = await fetch("https://api.example.com/session/token", {
  credentials: "include",
});
const token = await res.text();

await fetch("https://api.example.com/jsonapi/node/article", {
  method: "POST",
  credentials: "include",
  headers: {
    "Content-Type": "application/vnd.api+json",
    "X-CSRF-Token": token,
  },
  body: JSON.stringify({
    data: {
      type: "node--article",
      attributes: { title: "Hello world" }
    }
  }),
});
```

---

## Verify and troubleshoot

- Preflight (OPTIONS) must succeed with:
  - `Access-Control-Allow-Origin` matching your exact origin
  - `Access-Control-Allow-Methods` including the intended verb
  - `Access-Control-Allow-Headers` including custom headers (e.g., `authorization`, `x-csrf-token`)
  - `Access-Control-Allow-Credentials: true` if using cookies

- Quick checks:
  - Origins must match (protocol + host + port). `http://localhost:5173` ≠ `http://localhost:3000`.
  - Don’t use `*` with credentials.
  - Ensure reverse proxies/CDNs preserve the `Origin` header and CORS response headers.
  - Clear caches (`drush cr`) after changing `services.yml`.

- Curl preflight example:

```bash
curl -i -X OPTIONS \
  -H "Origin: https://app.example.com" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: content-type, x-csrf-token" \
  https://api.example.com/jsonapi/node/article
```

---

## Common pitfalls

- Using `*` for origins while sending cookies or Authorization
- Missing `OPTIONS` in `allowedMethods`
- Forgetting `authorization` or `x-csrf-token` in `allowedHeaders`
- Cookie `SameSite=Lax` preventing cross-site requests (use `SameSite=None; Secure` over HTTPS)

---
