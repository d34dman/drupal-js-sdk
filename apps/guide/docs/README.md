# Drupal JavaScript SDK

Welcome to the Drupal JavaScript SDK documentation.

## Get Started

### Install

=== "npm"

    ```bash
    # with npm
    npm install drupal-js-sdk @drupal-js-sdk/auth --save
    ```

=== "yarn"
    ```bash
    # with yarn
    yarn add drupal-js-sdk @drupal-js-sdk/auth
    ```

### Import

```js
import { Drupal } from 'drupal-js-sdk';
import { DrupalAuth } from '@drupal-js-sdk/auth';
```

### Use

```js
const api = new Drupal({ baseURL: 'http://example.com' });
const auth = new DrupalAuth(api);
auth.login('admin', 'Z1ON0101');
```

See the Guide for topics like authentication, menus, errors, and entities.

