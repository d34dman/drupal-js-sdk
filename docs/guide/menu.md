---
title: Menu
---

# Menu (draft)

Drupal JavaScript SDK relies on the Drupal module [Decoupled Menus](https://www.drupal.org/project/decoupled_menus).

## Basic Usage

```js
import { DrupalSDK } from 'drupal-js-sdk'

const sdk = new DrupalSDK({ baseURL: 'http://example.com' });
const menu = sdk.menu;

let menuTreeData = [];

// Fetch `main` menu in Drupal.
menu.list('main')
  .then((data) => {
    menuTreeData = data;
  })
  .catch(() => {
    // Handle error.
  });
```

To get the flat menu data as returned from Drupal, use `raw` (alias for `getMenuRaw`):

```js
menu.raw('main')
  .then((res) => {
    menuData = res.data;
  })
  .catch(() => {
    // Handle error.
  });
```

## Example data structure

```json
[
  {
    "id": "main.000",
    "parentId": "0",
    "name": "Home",
    "href": "/",
    "level": 1,
    "items": []
  },
  {
    "id": "main.001",
    "parentId": "0",
    "name": "About",
    "href": "/about-us",
    "level": 1,
    "items": []
  },
  {
    "id": "main.002",
    "parentId": "0",
    "name": "Foo",
    "href": "",
    "level": 1,
    "items": [
      {
        "id": "main.002.000",
        "parentId": "main.002",
        "name": "Bar",
        "href": "",
        "level": 2,
        "items": []
      },
      {
        "id": "main.002.001",
        "parentId": "main.002",
        "name": "Baz",
        "href": "",
        "level": 2,
        "items": []
      }
    ]
  }
]
```