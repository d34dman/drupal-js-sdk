# drupal-js-sdk (aggregator)

## Overview

Convenience bundle that re-exports the public APIs of all SDK subpackages for quick prototyping.

## Usage

```js hl_lines="1 5-6 9 12-13 16-18 19-23"
import { Drupal, DrupalAuth, DrupalMenu, DrupalEntity } from "drupal-js-sdk";
import { JsonApiEntityAdapter } from "drupal-js-sdk";

const drupal = new Drupal({ baseURL: "https://example.com" });

const auth = new DrupalAuth(drupal);
await auth.getSessionToken();

const menu = new DrupalMenu(drupal);
const items = await menu.getMenu("main");

const entities = new DrupalEntity(drupal)
  .registerAdapter("jsonapi", (ctx) => new JsonApiEntityAdapter(ctx));
const node = await entities.entity({ entity: "node", bundle: "article" }).load("1");
```

## Public API (re-exports)

- `@drupal-js-sdk/core` (Core, Drupal)
- `@drupal-js-sdk/auth` (DrupalAuth)
- `@drupal-js-sdk/menu` (DrupalMenu)
- `@drupal-js-sdk/entity` (EntityService, EntityLoader, DrupalEntity)
- `@drupal-js-sdk/jsonapi` (JsonApiEntityAdapter, Adapter)
- `@drupal-js-sdk/storage` (StorageInMemory, StorageInWeb)
- `@drupal-js-sdk/xhr` (FetchClient, AxiosClient)
- `@drupal-js-sdk/error` (DrupalError)
- `@drupal-js-sdk/interfaces` (types)

Notes

- This package provides a single entry point that re-exports public APIs from all subpackages.
