# @drupal-js-sdk/core

## Overview

Base SDK used by all features. Manages configuration, HTTP client, and exposes shared services for other packages.

## Usage

```js hl_lines="3 5"
import { Drupal } from "@drupal-js-sdk/core";

const drupal = new Drupal({ baseURL: "https://example.com" });
// Set a header for all subsequent requests
drupal.getClientService().addDefaultHeaders({ "X-App": "docs" });
```

## Public API

### class `Core`

#### Constructor

Instantiate Core

```js title=""
constructor(config: StorageRecordInterface)
```

??? example

````js hl_lines="3"
import { Core } from "@drupal-js-sdk/core";

    const drupal = new Core({ baseURL: "https://example.com" });
    // Set a header for all subsequent requests
    drupal.getClientService().addDefaultHeaders({ "X-App": "docs" });
    ```

#### setConfigService

```js title=""
setConfigService(config: StorageInterface): this
````

??? example

````js hl_lines="4-5"
import { Core } from "@drupal-js-sdk/core";
import { StorageInMemory } from "@drupal-js-sdk/storage";

    const core = new Core({});
    core.setConfigService(new StorageInMemory());
    ```

#### getConfigService

```js title=""
getConfigService(): StorageInterface
````

??? example
`js hl_lines="2"
    const cfg = drupal.getConfigService();
    cfg.setString("lang", "en");
    `

#### setClientService

```js title=""
setClientService(client: XhrInterface): this
```

??? example

````js hl_lines="3-4"
import { FetchClient } from "@drupal-js-sdk/xhr";

    const client = new FetchClient({ baseURL: "https://example.com" });
    drupal.setClientService(client);
    ```

#### getClientService

```js title=""
getClientService(): XhrInterface
````

??? example
`js hl_lines="1-2"
    const client = drupal.getClientService();
    const res = await client.call("GET", "/jsonapi/node/article");
    `

#### setSessionService

```js title=""
setSessionService(session: SessionInterface): this
```

??? example
`js hl_lines="2"
    // Provide your own SessionInterface implementation
    drupal.setSessionService(mySession);
    `

#### getSessionService

```js title=""
getSessionService(): SessionInterface
```

??? example
`js hl_lines="1-2"
    const session = drupal.getSessionService();
    session.setItem("token", { value: "abc" });
    `

### class `Drupal` extends `Core`

#### Constructor

```js title=""
constructor(config: {
  baseURL: string;
  auth?: XhrBasicCredentials;
  headers?: XhrRequestHeaders;
  client?: XhrInterface;
})
```

??? example

````js hl_lines="3-6"
import { Drupal } from "@drupal-js-sdk/core";

    const drupal = new Drupal({
      baseURL: "https://example.com",
      headers: { "X-App": "docs" },
    });
    ```

#### initialize

```js title=""
initialize(options): this
````

??? example
`js hl_lines="1"
    drupal.initialize({ baseURL: "https://example.com" });
    `

Notes

- Provides shared configuration, HTTP client, and session plumbing.
