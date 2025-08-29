# @drupal-js-sdk/storage

## Overview

Simple storage adapters for in-memory and Web Storage use cases. Useful for persisting session/config data across requests.

## Usage

```js hl_lines="3-4 6-7"
import { StorageInMemory, StorageInWeb } from "@drupal-js-sdk/storage";

const mem = new StorageInMemory();
mem.setItem("token", { value: "abc" });

const web = new StorageInWeb(() => window.localStorage);
web.setString("app", "docs");
```

## Public API

### class `StorageInMemory`

#### Constructor

```js title=""
constructor()
```

#### getString

```js title=""
getString(keyName: string): string | null
```

#### setString

```js title=""
setString(keyName: string, keyValue: string): void
```

#### isAvailable

```js title=""
isAvailable(): boolean
```

#### getItem

```js title=""
getItem(keyName: string): StorageValueType
```

#### setItem

```js title=""
setItem(keyName: string, keyValue: StorageValueType): void
```

#### removeItem

```js title=""
removeItem(keyName: string): void
```

#### clear

```js title=""
clear(): void
```

#### get

```js title=""
get(): StorageRecordInterface
```

#### set

```js title=""
set(data: StorageRecordInterface): void
```

### class `StorageInWeb`

#### Constructor

```js title=""
constructor(getStorage?: () => Storage)
```

#### getString

```js title=""
getString(keyName: string): string | null
```

#### setString

```js title=""
setString(keyName: string, keyValue: string): void
```

#### isAvailable

```js title=""
isAvailable(): boolean
```

#### getItem

```js title=""
getItem(keyName: string): StorageValueType
```

#### setItem

```js title=""
setItem(keyName: string, keyValue: StorageValueType): void
```

#### removeItem

```js title=""
removeItem(keyName: string): void
```

#### clear

```js title=""
clear(): void
```

#### get

```js title=""
get(): StorageRecordInterface
```

#### set

```js title=""
set(data: StorageRecordInterface): void
```

Notes

- Implements `StorageInterface` from `@drupal-js-sdk/interfaces`.
