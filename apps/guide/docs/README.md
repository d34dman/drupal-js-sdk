---
home: true
title: Home
heroImage: /svg/decoupled-drupal.svg
actions:
  - text: Get Started
    link: /guide/getting-started.html
    type: primary
  - text: Introduction
    link: /guide/
    type: secondary
features:
  - title: Guide
    details: Guide to walk you through most common scenarious
  - title: Examples
    details: Ample example to jumpstart your developmnent
  - title: Showcase
    details: A real world examples using the SDK.
footer: MIT Licensed | Copyright © 2021-present D34dMan
---

### As Easy as 1, 2, 3

#### 1. Install
<CodeGroup>
  <CodeGroupItem title="YARN" active>

```bash
# install in your project
yarn add -D drupal-js-sdk
```
  </CodeGroupItem>

  <CodeGroupItem title="NPM">
  
```bash
# install in your project
npm install -D drupal-js-sdk
# install the authentication package for example.
npm install -D @drupal-js-sdk/auth
```

  </CodeGroupItem>
</CodeGroup>

#### 2. Import
<CodeGroup>
  <CodeGroupItem title="ES Module" active>

```js
import { Drupal } from 'drupal-js-sdk';
import { DrupalAuth } from '@drupal-js-sdk/auth';
```
  </CodeGroupItem>

  <CodeGroupItem title="Require">
  
```js
const Drupal = require('drupal-js-sdk')
const DrupalAuth = require('@drupal-js-sdk/auth')
```

  </CodeGroupItem>
</CodeGroup>

#### 3. Use
```js
const api = new Drupal({baseURL: 'http://example.com'});
const auth = new DrupalAuth(api);
auth.login('admin', 'Z1ON0101');
```