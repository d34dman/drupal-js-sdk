# @drupal-js-sdk/core

## 0.4.0

### Minor Changes

- bbef32f: Switched to Bun. Its Buntime!

### Patch Changes

- Updated dependencies [bbef32f]
  - @drupal-js-sdk/error@0.4.0
  - @drupal-js-sdk/interfaces@0.4.0
  - @drupal-js-sdk/storage@0.4.0
  - @drupal-js-sdk/xhr@0.4.0

## 0.3.15

### Patch Changes

- Fix version dependencies by moving them from "devdependenceis" to "dependencies"
- Updated dependencies
  - @drupal-js-sdk/storage@0.3.14
  - @drupal-js-sdk/error@0.3.14
  - @drupal-js-sdk/xhr@0.3.14

## 0.3.14

### Patch Changes

- Remove postinstall script from package.json

## 0.3.13

### Patch Changes

- 3c9c115: Create separate build for node and browser.
- 419dbf3: Use rollup instead of siroc and tsc for compiling typscript
- 3c9c115: Dropped CommonJS exports
- 419dbf3: Switched to pnpm package manager (discontinued yarn berry)

## 0.3.12

### Patch Changes

- Added type 'module' to package.json

## 0.3.11

### Patch Changes

- 7aeaa4c: Moved "DrupalRole" to its own package "@drupal-js-sdk/role"
- 7aeaa4c: Moved "DrupalSettings" to its own package "@drupal-js-sdk/settings"
- 7aeaa4c: Moved "DrupalMenu" into its own package "@drupal-js-sdk/menu"
- 7aeaa4c: Moved "DrupalAuth" to its own package "@drupal-js-sdk/auth"

## 0.3.10

### Patch Changes

- ec139b1: Extract Xhr functionality into its own module
- ec139b1: Improved robustnuss of fetch client
- 18c367c: Refactored code to move all interefaces into @drupal-js-sdk/interfaces
- ec139b1: Bumped axios version to 0.26.1

## 0.3.9

### Patch Changes

- Introduce package dependency

## 0.3.8

### Patch Changes

- 5be26d8: Moved error and storage into its own sub packages
- 1e93c59: Migrated to yarn berry
