# @drupal-js-sdk/xhr

## Overview

HTTP client abstractions with a unified interface, supporting native fetch or Axios. Used by all SDK packages for requests.

## Usage

```js hl_lines="3-4 6"
import { FetchClient } from "@drupal-js-sdk/xhr";

const client = new FetchClient({ baseURL: "https://example.com" })
  .addDefaultHeaders({ "X-App": "docs" });

const response = await client.call("GET", "/jsonapi/node/article");
```

## Public API

### class `FetchClient` implements `XhrInterface`

#### Constructor

```js title=""
constructor(config?: XhrRequestConfig)
```

#### setClient

```js title=""
setClient(client: typeof fetch): this
```
??? example
    ```js hl_lines="1"
    client.setClient(fetch);
    ```

#### getClient

```js title=""
getClient(): typeof fetch
```

#### addDefaultHeaders

```js title=""
addDefaultHeaders(headers: Record<string, any>): XhrInterface
```
??? example
    ```js hl_lines="1"
    client.addDefaultHeaders({ Authorization: "Bearer token" });
    ```

#### call

```js title=""
call(method: XhrMethod, path: string, config?: XhrRequestConfig): Promise<XhrResponse>
```
??? example
    ```js hl_lines="1"
    const res = await client.call("GET", "/jsonapi/node/article");
    ```

### class `AxiosClient` implements `XhrInterface`

#### Constructor

```js title=""
constructor(client: { request(config: XhrRequestConfig): Promise<XhrResponse> })
```

#### setClient

```js title=""
setClient(client: { request(config: XhrRequestConfig): Promise<XhrResponse> }): this
```

#### getClient

```js title=""
getClient(): { request(config: XhrRequestConfig): Promise<XhrResponse> }
```

#### addDefaultHeaders

```js title=""
addDefaultHeaders(headers: Record<string, any>): XhrInterface
```

#### call

```js title=""
call(method: XhrMethod, path: string, config?: Record<string, any>): Promise<XhrResponse>
```

Notes

- Both clients adhere to `XhrInterface` from `@drupal-js-sdk/interfaces`.
