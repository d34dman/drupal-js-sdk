# @drupal-js-sdk/entity

## Overview

Adapter-based entity loader. Register one or more adapters (e.g., JSON:API) and load entities via a single, consistent facade.

## Usage

```js hl_lines="6-7 9-10"
import { Drupal } from "@drupal-js-sdk/core";
import { DrupalEntity } from "@drupal-js-sdk/entity";
import { JsonApiEntityAdapter } from "@drupal-js-sdk/jsonapi";

const drupal = new Drupal({ baseURL: "https://example.com" });
const entities = new DrupalEntity(drupal)
  .registerAdapter("jsonapi", (ctx) => new JsonApiEntityAdapter(ctx))
  .setDefaultAdapter("jsonapi");

// Optionally type attributes in TS; in JS just call load
const loader = entities.entity({ entity: "node", bundle: "article" });
const article = await loader.load("123");
```

## Public API

### class `EntityLoader<T>`

#### load

```js title=""
load(id: string, options?: EntityLoadOptions): Promise<EntityRecord<T>>
```
??? example
    ```js hl_lines="1"
    const node = await loader.load("1", { jsonapi: { query: { include: "uid" } } });
    ```

### class `EntityService`

#### Constructor

```js title=""
constructor(drupal: CoreInterface)
```

#### registerAdapter

```js title=""
registerAdapter(key: string, factory: EntityAdapterFactory): this
```
??? example
    ```js hl_lines="1"
    service.registerAdapter("jsonapi", (ctx) => new JsonApiEntityAdapter(ctx));
    ```

#### setDefaultAdapter

```js title=""
setDefaultAdapter(key: string): this
```
??? example
    ```js hl_lines="1"
    service.setDefaultAdapter("jsonapi");
    ```

#### entity

```js title=""
entity<T>(id: EntityIdentifier, adapterKey?: string): EntityLoader<T>
```
??? example
    ```js hl_lines="1"
    const loader = service.entity({ entity: "node", bundle: "page" }, "jsonapi");
    ```

### class `DrupalEntity` (facade)

#### Constructor

```js title=""
constructor(drupal: CoreInterface)
```

#### registerAdapter

```js title=""
registerAdapter(key: string, factory: EntityAdapterFactory): this
```

#### setDefaultAdapter

```js title=""
setDefaultAdapter(key: string): this
```

#### entity

```js title=""
entity<T>(id: EntityIdentifier, adapterKey?: string): EntityLoader<T>
```

Types

- `EntityIdentifier`, `EntityAttributes`, `EntityRecord`, `EntityLoadOptions`
- `EntityAdapterContext`, `EntityAdapter`, `EntityAdapterFactory`

Notes

- Adapters encapsulate backend specifics (e.g., JSON:API).
- Uses the HTTP client and config from the provided `CoreInterface`.