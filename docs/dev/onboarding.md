### Onboarding for Contributors

Quick orientation to the codebase and development flow.

#### Monorepo layout

- `packages/` contains publishable packages (core, interfaces, xhr, storage, auth, entity, jsonapi, menu, error).
- `drupal-js-sdk/` package re-exports most public APIs for convenience.
- `docs/` MkDocs site with guides and module docs.

#### Build and test

- Install: `pnpm i`
- Build all: `pnpm -r build`
- Test all: `pnpm -r test`
- Lint: `pnpm -r lint`

#### Key packages

- `@drupal-js-sdk/interfaces`: shared types and contracts.
- `@drupal-js-sdk/core`: wires config, session and transport; exposes `Drupal`.
- `@drupal-js-sdk/xhr`: `FetchClient` and `AxiosClient` implementing `XhrInterface`.
- `@drupal-js-sdk/auth`: `DrupalAuth` (login/logout, session token, CSRF header).
- `@drupal-js-sdk/entity` + `@drupal-js-sdk/jsonapi`: entity loading via adapters.

#### Development tips

- Prefer `interfaces` types over widening types to keep boundaries clean.
- `DrupalError` should be thrown from transport boundaries for consistent error handling.
- For browser apps, set session via `drupal.setSessionService(new StorageInWeb())`.

See also:

- [System Architecture](architecture.md)
- [Runtime Architecture](runtime.md)
- [Login Sequence](sequence-login.md)
