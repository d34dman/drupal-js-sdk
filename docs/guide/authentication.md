# Authentication

Default authentication service is provided via `DrupalAuth`. It helps perform cookie-based authentication with a Drupal backend.

## Session storage

Authentication needs a session storage implementation. Examples:

### Memory

Node or Browser

```js
import { DrupalSDK } from "drupal-js-sdk";
import { StorageInMemory } from "@drupal-js-sdk/storage";

const sdk = new DrupalSDK({ baseURL: "http://example.com" });
const sessionStorage = new StorageInMemory();
sdk.setSessionService(sessionStorage);
const auth = sdk.auth;
```

### localStorage (Browser)

```js
import { DrupalSDK } from "drupal-js-sdk";
import { StorageInWeb } from "@drupal-js-sdk/storage";

const sdk = new DrupalSDK({ baseURL: "http://example.com" });
const sessionStorage = new StorageInWeb(() => window.localStorage);
sdk.setSessionService(sessionStorage);
const auth = sdk.auth;
```

### sessionStorage (Browser)

```js
import { DrupalSDK } from "drupal-js-sdk";
import { StorageInWeb } from "@drupal-js-sdk/storage";

const sdk = new DrupalSDK({ baseURL: "http://example.com" });
const sessionStorage = new StorageInWeb(() => window.sessionStorage);
sdk.setSessionService(sessionStorage);
const auth = sdk.auth;
```

## Login status

```js
let logged_in = false;
auth
  .loginStatus()
  .then((status) => (logged_in = status))
  .catch(() => {
    // Display message that login status check failed.
  });
```

## Login

```js
let user_info = {};
auth
  .login("admin", "Z1ON0101")
  .then((data) => (user_info = data))
  .catch(() => {
    // Display message that login failed.
  });
```

## Logout (experimental)

```js
let logged_in = true;
auth
  .logout()
  .then(() => {
    logged_in = false;
  })
  .catch(() => {
    // Display message that logout failed.
  });
```

## Password Reset (experimental)

Password reset request using username:

```js
auth
  .passwordResetByUserName("admin")
  .then(() => {
    // Password reset request accepted.
  })
  .catch(() => {
    // Display message that password reset failed.
  });
```

Password reset request using email:

```js
auth
  .passwordResetByMail("admin@example.com")
  .then(() => {
    // Password reset request accepted.
  })
  .catch(() => {
    // Display message that password reset failed.
  });
```

## Register (experimental)

Some Drupal-side configuration is required:

- Install and enable the `restui` module
- Enable the User registration resource (POST /user/register)
- Configure accepted formats and authentication (cookie)
- Grant "Access POST on User registration resource" to Anonymous users

```js
let user_info = {};
auth
  .register("admin", "admin@example.com")
  .then((data) => {
    // Successfully registered
    user_info = data;
  })
  .catch(() => {
    // Display message that registration failed.
  });
```

### References

- Additional RPC endpoints change record: https://www.drupal.org/node/2720655
- REST getting started: https://www.drupal.org/docs/8/core/modules/rest/1-getting-started-rest-configuration-rest-request-fundamentals
- Anonymous users can register via REST (Change record): https://www.drupal.org/node/2752071
- restui module: https://www.drupal.org/project/restui
