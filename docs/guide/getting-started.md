# Getting Started

Install the SDK and optional packages you need.

## Install

```bash
npm install drupal-js-sdk @drupal-js-sdk/auth
# Optional for entities via JSON:API
npm install @drupal-js-sdk/entity @drupal-js-sdk/jsonapi
```

## Basic usage

```js
import { DrupalSDK } from 'drupal-js-sdk';

const sdk = new DrupalSDK({ baseURL: 'https://example.com' });
// Access feature modules via facade
sdk.auth; // DrupalAuth
sdk.menu; // DrupalMenu
sdk.entities; // DrupalEntity facade/service
```

## Entities (opt-in)

```js
import { DrupalSDK } from 'drupal-js-sdk';
import { JsonApiEntityAdapter } from '@drupal-js-sdk/jsonapi';

const sdk = new DrupalSDK({ baseURL: 'https://example.com' });
// Register adapter once (if not already)
sdk.entities.registerAdapter('jsonapi', (ctx) => new JsonApiEntityAdapter(ctx));

// Load node--article:123
const article = await sdk.entities
  .entity({ entity: 'node', bundle: 'article' }, 'jsonapi')
  .load('123');
```