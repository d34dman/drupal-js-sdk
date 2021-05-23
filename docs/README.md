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
  - title: Demo
    details: A real world example showcasing all the features of sdk.
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
```

  </CodeGroupItem>
</CodeGroup>

#### 2. Import
<CodeGroup>
  <CodeGroupItem title="ES Module" active>

```js
import {Drupal, DrupalAuth} from 'drupal-js-sdk'
```
  </CodeGroupItem>

  <CodeGroupItem title="Require">
  
```js
const Drupal = require('drupal-js-sdk')
```

  </CodeGroupItem>
</CodeGroup>

#### 3. Use
```js
const api = new Drupal().initialize({baseURL: 'http://example.com'});
const auth = new DrupalAuth(api);
auth.login({username: 'admin', password: 'Z1ON0101'});
```