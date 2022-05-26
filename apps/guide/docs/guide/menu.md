---
title: Menu
---

# Menu  <Badge type="warning" text="draft" vertical="top" />

::: warning 

**Experimental feature**

Drupal JavaScript SDK relies on the drupal module [Decoupled Menus](https://www.drupal.org/project/decoupled_menus) installed along with relevant patch.
:::

## Basic Usage

```js {9}
import { Drupal } from 'drupal-js-sdk'
import { DrupalMenu } from '@drupal-js-sdk/menu'
const api = new Drupal({baseURL: 'http://example.com'});
const menu = new DrupalMenu(api);

let menuTreeData = [];

// Fetch `main` menu in Drupal.
menu.getMenu('main')
    .then((data) => {
      menuTreeData = data;
    })
    .catch((error) => {
      // Handle error.
    })
```

The data returned from `getMenu` is processed and already converted to a tree structure. In case you would like to get the flat menu data as is returned from Drupal, you can use `getMenuRaw` method.
```js {3,4,5}
// Fetch `main` menu in Drupal.
menu.getMenuRaw('main')
    .then((res) => {
      menuData = res.data;
    })
    .catch((error) => {
        // Handle error. 
    }) 
```



::: details Example data structure

Consider the following menu structure.

- Home
- About
- Foo
    - Bar
    - Baz

For the above case menu tree data would resemble something like the following,
```json
[
    {
      id: 'main.000',
      parentId: '0',
      name: 'Home',
      href: '/',
      level: 1,
      items: [],
    },
    {
      id: 'main.001',
      parentId: '0',
      name: 'About',
      href: '/about-us',
      level: 1,
      items: [],
    },
    {
      id: 'main.002',
      parentId: '0',
      name: 'Foo',
      href: '',
      level: 1,
      items: [
        {
          id: 'main.002.000',
          parentId: 'main.002',
          name: 'Bar',
          href: '',
          level: 2,
          items: [],
        },
        {
          id: 'main.002.001',
          parentId: 'main.002',
          name: 'Baz',
          href: '',
          level: 2,
          items: [],
        },
      ],
    },
]
```
:::