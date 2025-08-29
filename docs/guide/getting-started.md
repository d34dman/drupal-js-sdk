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
import { Drupal } from 'drupal-js-sdk';
import { DrupalAuth } from '@drupal-js-sdk/auth';

const api = new Drupal({ baseURL: 'https://example.com' });
const auth = new DrupalAuth(api);
```

## Entities (opt-in)

```js
import { EntityService } from '@drupal-js-sdk/entity';
import { JsonApiEntityAdapter } from '@drupal-js-sdk/jsonapi';

const drupal = new Drupal({ baseURL: 'https://example.com' });
const entities = new EntityService(drupal);
entities.registerAdapter('jsonapi', (ctx) => new JsonApiEntityAdapter(ctx));

// Load node--article:123
const article = await entities
  .entity({ entity: 'node', bundle: 'article' }, 'jsonapi')
  .load('123');
```