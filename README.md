# Drupal JavaScript SDK

** Undergoing heavy refactor to introduce "context api" to use shared context among various modules. ** 

[![codecov](https://img.shields.io/codecov/c/github/d34dman/drupal-js-sdk?style=flat-square&token=KVXZUI3JLK)](https://codecov.io/gh/d34dman/drupal-js-sdk)

Monorepo for Drupal Javascript SDK.

**This Project is in a very early phase of its development. Things are very volatile and evolving.**

**Drupal JavaScript SDK** is an SDK for JavaScript developers for creating applications that connect to a Drupal backend.

You can benefit from this SDK if you are developing a JavaScript application that:

- Connects to a Decoupled Drupal Application
- Authenticates with Drupal 
- Use experimental features of the decoupled menu
- Handle error messages while interacting with Drupal more gracefully
- Can use some guides and API that can help you with many common scenarios

This project feature overlaps with a lot of other open-source projects. The primary goal of this SDK would be to treat guides and examples as first-class citizen and not as an afterthought.

## Resources

  [![GitHub Pages Workflow Status](https://img.shields.io/github/actions/workflow/status/d34dman/drupal-js-sdk/github-pages.yml?branch=main&style=for-the-badge&logo=github&label=Github%20Pages)](https://d34dman.github.io/drupal-js-sdk/)
  
## Contribute

Development is happening in [GitHub](https://github.com/d34dman/drupal-js-sdk). However, if you like to get involved or suggest improvements, please use the [Drupal Issue queue](https://www.drupal.org/project/issues/drupal_js_sdk?categories=All) so that we can provide proper issue credits.

## Supported Drupal Versions

- Drupal 10
- Drupal 11

## Related Projects

Even after we have a proper release for Drupal JavaScript SDK, it might not suite your need. In case one or more of these project suits your user case, it is recommended to use them instead.

- [api_client](https://www.drupal.org/project/api_client) - The Drupal API Client is a set of JavaScript packages that simplify the process of interacting with common Drupal APIs.
- [drupal-sdk](https://gitlab.com/VoidE/drupal-sdk) - The Drupal SDK is a helper package for calling Drupal endpoints, like the JSON:API, in a more efficient and easy way.
- [Drupal State](https://www.drupal.org/project/drupal_state) - A simple data store to manage application state sourced from Drupal's JSON:API.
- DruxClient which is part of [DruxtJS](https://github.com/druxt/druxt.js) - DruxtJS provides an easy connection between a Drupal JSON:API backend and Nuxt.js frontend application.
- [jDrupal](https://github.com/signalpoint/jDrupal) - A simple Vanilla JavaScript Library and API.
- [js-client](https://github.com/jsdrupal/js-client) - This is the client that would ship to npm. Run yarn build to generate it at client/index.js. Currently this is being automatically published to the GitHub npm package registry when you create a release 
- [Juissy](https://github.com/gabesullice/juissy) - Juissy is a minimal experimental JSON API client for Drupal.
- [Waterwheel](https://github.com/kylebrowning/waterwheel-js) - A generic JavaScript helper library to query and manipulate Drupal 8 via core REST
