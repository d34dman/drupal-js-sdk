# Authentication

Default authentication service is provided via `DrupalAuth`.
It provides helper method to do cookie based authentication with Drupal backend.

::: tip
Authentication calls requires some persistent data to be maintained.

For doing so, use the same `api` and `auth` instance for making subsequent calls.
```js
import {Drupal, DrupalAuth} from 'drupal-js-sdk'
const api = new Drupal().initialize({baseURL: 'http://example.com'});
const auth = new DrupalAuth(api);
```
:::

## Login status <Badge type="tip" text="ok" vertical="top" />

```js {2}
let logged_in = false;
auth.loginStatus()
    .then(status => logged_in)
    .catch(error) {
        // Display message that login status check failed. 
    }
```

## Login <Badge type="tip" text="ok" vertical="top" />
```js {2}
let user_info = {};
auth.login({username: 'admin', password: 'Z1ON0101'})
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
## Register <Badge type="danger" text="Not implemented" vertical="top" />


::: details References

**On Drupal.org**
- [Additional RPC endpoints: user/login user/login/status user/logout user/password
| Change record](https://www.drupal.org/node/2720655)
- [REST - Gettings started](https://www.drupal.org/docs/8/core/modules/rest/1-getting-started-rest-configuration-rest-request-fundamentals)
- [JavaScript and Drupal 8 RESTful Web Services](https://www.drupal.org/docs/8/core/modules/rest/javascript-and-drupal-8-restful-web-services#s-login)

**Others**

:::