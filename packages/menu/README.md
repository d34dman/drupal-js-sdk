# @drupal-js-sdk/menu

## Overview

Fetches Drupal menu linkset and returns a normalized tree suitable for rendering. Also exposes helpers for validation and transformation.

## Usage

```js hl_lines="4-5 6"
import { Drupal } from "@drupal-js-sdk/core";
import { DrupalMenu } from "@drupal-js-sdk/menu";

const drupal = new Drupal({ baseURL: "https://example.com" });
const menu = new DrupalMenu(drupal);
const items = await menu.getMenu("main");
```

## Public API

### class `DrupalMenu`

#### Constructor

```js title=""
constructor(drupal: CoreInterface)
```

#### getMenu

```js title=""
getMenu(menuName: string): Promise<any[]>
```

??? example
    ```js hl_lines="1"
    const items = await menu.getMenu("main");
    ```

#### getMenuRaw

```js title=""
getMenuRaw(menuName: string): Promise<any>
```

#### normalizeListItems

```js title=""
normalizeListItems(data: object): any[]
```

#### convertFlatListItemsToTree

```js title=""
convertFlatListItemsToTree(list: any[]): any[]
```

#### checkIfDrupalMenuDataIsValid

```js title=""
checkIfDrupalMenuDataIsValid(data?: object): boolean
```

Notes

- Uses the HTTP client from `CoreInterface` and returns a normalized tree.
