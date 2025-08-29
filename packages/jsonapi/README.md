# @drupal-js-sdk/jsonapi

## Overview

Entity adapter that loads records from Drupal's JSON:API using the shared XHR client. Normalizes minimal shape: id, type, attributes, relationships.

## Usage

```js hl_lines="6 9-10"
import { Drupal } from "@drupal-js-sdk/core";
import { EntityService } from "@drupal-js-sdk/entity";
import { JsonApiEntityAdapter } from "@drupal-js-sdk/jsonapi";

const drupal = new Drupal({ baseURL: "https://example.com" });
const service = new EntityService(drupal).registerAdapter("jsonapi", (ctx) => new JsonApiEntityAdapter(ctx));

const loader = service.entity({ entity: "node", bundle: "page" }, "jsonapi");
const page = await loader.load("abcd", { jsonapi: { query: { include: "uid" } } });
```

## Public API

### class `JsonApiEntityAdapter<T>`

#### Constructor

```js title=""
constructor(context: EntityAdapterContext)
```
??? example
    ```js hl_lines="1"
    const adapter = new JsonApiEntityAdapter(context);
    ```

#### load

```js title=""
load(entityId: string, options?: EntityLoadOptions): Promise<EntityRecord<T>>
```
??? example
    ```js hl_lines="1"
    const record = await adapter.load("123", { jsonapi: { query: { include: "uid" } } });
    ```

Alias

- `Adapter = JsonApiEntityAdapter`

Notes

- Implements the EntityAdapter interface for JSON:API.
- Respects query options: `options.jsonapi.query` or generic `options.params`.
