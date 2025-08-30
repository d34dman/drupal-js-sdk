### System Architecture Overview

This page provides a system-level view of the monorepo packages and their dependency relationships.

<div class="grid cards" markdown>
<figure class="card" markdown>
![Dependency Diagram](../assets/svg/dependency-diagram.svg)
<figcaption>Dependency Diagram</figcaption>
</figure>
</div>


Key points:

- `@drupal-js-sdk/interfaces` defines shared types and contracts.
- `@drupal-js-sdk/core` wires configuration, session, and HTTP client.
- Transport is provided by `@drupal-js-sdk/xhr` via `FetchClient` or `AxiosClient`.
- Feature packages (`auth`, `entity`, `jsonapi`, `menu`) consume `core` and `interfaces`.
- `@drupal-js-sdk/error` centralizes error definitions used across layers.


