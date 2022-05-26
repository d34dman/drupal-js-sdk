# Authentication

Default authentication service is provided via `DrupalAuth`.
It provides helper method to do cookie based authentication with Drupal backend.

::: tip

Authentication calls requires some persistent data to be maintained.
Hence we need to set a session service in our sdk.

<CodeGroup>
  <CodeGroupItem title="Memory" active>

```js {6,7,8}
import {Drupal} from 'drupal-js-sdk';
import { DrupalAuth } from '@drupal-js-sdk/auth';
import { StorageInMemory } from '@drupal-js-sdk/storage';

const sdk = new Drupal({baseURL: 'http://example.com'});
// Awailable in Node and Browser environments.
const sessionStorage = new StorageInMemory();
sdk.setSessionService(sessionStorage);
const auth = new DrupalAuth(sdk);
```

  </CodeGroupItem>
  <CodeGroupItem title="localStorage">

```js {6,7,8}
import {Drupal} from 'drupal-js-sdk';
import { DrupalAuth } from '@drupal-js-sdk/auth';
import { StorageInWeb } from '@drupal-js-sdk/storage';

const sdk = new Drupal({baseURL: 'http://example.com'});
// Awailable only in Browser environments.
const sessionStorage = new StorageInWeb(() => window.localStorage);
sdk.setSessionService(sessionStorage);
const auth = new DrupalAuth(sdk);
```

  </CodeGroupItem>
  <CodeGroupItem title="sessionStorage">

```js {6,7,8}
import {Drupal} from 'drupal-js-sdk';
import { DrupalAuth } from '@drupal-js-sdk/auth';
import { StorageInWeb } from '@drupal-js-sdk/storage';

const sdk = new Drupal({baseURL: 'http://example.com'});
// Awailable only in Browser environments.
const sessionStorage = new StorageInWeb(() => window.sessionStorage);
sdk.setSessionService(sessionStorage);
const auth = new DrupalAuth(sdk);
```

  </CodeGroupItem>
</CodeGroup>

:::

## Login status

```js {2}
let logged_in = false;
auth.loginStatus()
    .then(status => logged_in)
    .catch(error) {
        // Display message that login status check failed. 
    }
````

## Login

```js {2}
let user_info = {};
auth.login('admin', 'Z1ON0101')
    .then(data => user_info)
    .catch(error) {
        // Display message that login failed. 
    }
```
## Logout <Badge type="warning" text="experimental" vertical="top" />

```js {2}
let logged_in = true;
auth.logout()
    .then(() => {logged_in = false})
    .catch(error) {
        // Display message that logout failed. 
    }
```
## Password Reset <Badge type="warning" text="experimental" vertical="top" />

Password reset request using username

```js {1}
auth.passwordResetByUserName('admin')
    .then(() => { 
        // Show some message about password reset was success.
    })
    .catch(error) {
        // Display message that password reset failed. 
    }
```
Password reset request using user mail

```js {1}
auth.passwordResetByMail('admin@example.com')
    .then(() => { 
        // Show some message about password reset was success.
    })
    .catch(error) {
        // Display message that password reset failed. 
    }
```
## Register <Badge type="warning" text="experimental" vertical="top" />

::: warning
**Some extra configuration has to be performed on Drupal side for registration to work**
:::

### Drupal Side configuration
- Install [restui](https://www.drupal.org/project/restui) module and enable User registration resource.
    - Download and enable [restui](https://www.drupal.org/project/restui) module
    - Enable User registration (/user/register: POST) resource
    - Configure User registration resource as follows
      - Method POST : enabled
      - Accepted Request format json : checked
    - Authentication provider cookie : checked
- Allow Permission `Access POST on User registration resource` for Anonymous users.
  
```js {3}
let user_info = {};
// Returns a promise that is fulfilled with the user when the registration completes.
auth.register('admin', 'admin@example.com')
    .then(data => {
        // Succesfully registered.
    })
    .catch(error) {
        // Display message that login failed. 
    }
```

::: details References

**On Drupal.org**
- [Additional RPC endpoints: user/login user/login/status user/logout user/password
| Change record](https://www.drupal.org/node/2720655)
- [REST - Gettings started](https://www.drupal.org/docs/8/core/modules/rest/1-getting-started-rest-configuration-rest-request-fundamentals)
- [JavaScript and Drupal 8 RESTful Web Services](https://www.drupal.org/docs/8/core/modules/rest/javascript-and-drupal-8-restful-web-services#s-login)
- [Anonymous users can register via REST | Change Record](https://www.drupal.org/node/2752071)
- [restui](https://www.drupal.org/project/restui) drupal module.

**Others**

:::