# Getting Started

The easiest way to integrate the Drupal Javascript SDK into your JavaScript project is through the npm module.

The JavaScript ecosystem is wide and incorporates a large number of platforms and execution environments. To handle this, the drupal-js-sdk npm module contains special versions of the SDK tailored to use in Node.js and Browser environments. Not all features make sense in all environments, so using the appropriate package will ensure that items like local storage, user sessions, and HTTP requests use appropriate dependencies.

To use the npm modules for a browser based application, include it as you normally would:

```js
const Drupal = require('drupal-js-sdk');
```