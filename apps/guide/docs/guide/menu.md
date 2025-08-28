---
title: Menu
---

# Menu (draft)

Drupal JavaScript SDK relies on the Drupal module [Decoupled Menus](https://www.drupal.org/project/decoupled_menus).

## Basic Usage

```js
import { Drupal } from 'drupal-js-sdk'
import { DrupalMenu } from '@drupal-js-sdk/menu'

const api = new Drupal({ baseURL: 'http://example.com' });
const menu = new DrupalMenu(api);

let menuTreeData = [];

// Fetch `main` menu in Drupal.
menu.getMenu('main')
  .then((data) => {
    menuTreeData = data;
  })
  .catch(() => {
    // Handle error.
  });
```

To get the flat menu data as returned from Drupal, use `getMenuRaw`:

```js
menu.getMenuRaw('main')
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