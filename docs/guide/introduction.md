# Introduction

!!! warning
    This project is in an early phase and APIs can evolve.

**Drupal JavaScript SDK** helps JavaScript apps connect to a Drupal backend.

You can benefit if your app:

- Connects to a decoupled Drupal site
- Authenticates with Drupal
- Uses decoupled menus
- Needs clearer error handling
- Prefers practical guides and examples

### Architecture

- Core: configuration, session, HTTP client plumbing
- Feature packages: `@drupal-js-sdk/auth`, `@drupal-js-sdk/menu`, etc.
- Entity (opt-in): `@drupal-js-sdk/entity` facades + adapters like `@drupal-js-sdk/jsonapi`

![Architecture Diagram](/assets/svg/Architecture.svg)

### Contribute

Development is on GitHub. For issues and credits, use the Drupal issue queue: https://www.drupal.org/project/issues/drupal_js_sdk?categories=All

### Supported Drupal Versions

- Drupal 8
- Drupal 9
