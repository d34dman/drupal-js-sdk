---
title: Menu
---

# Menu  <Badge type="warning" text="draft" vertical="top" />

::: warning 

**Experimental feature**

Drupal JavaScript SDK relies on the drupal module [Decoupled Menus](https://www.drupal.org/project/decoupled_menus) installed along with relevant patch.
:::

## Basic Usage

```js {8}
import {Drupal, DrupalMenu} from 'drupal-js-sdk'
const api = new Drupal().initialize({baseURL: 'http://example.com'});
const menu = new DrupalMenu(api);

let menuTreeData = [];

// Fetch `main` menu in Drupal.
menu.getMenu('main')
    .then((data) => menuTreeData)
    .catch(error) {
        // Handle error. 
    }
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