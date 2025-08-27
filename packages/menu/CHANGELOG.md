# @drupal-js-sdk/menu

## 0.5.1

### Patch Changes

- 87d9ff8: Remove hard dependency on axios
- Updated dependencies [87d9ff8]
  - @drupal-js-sdk/interfaces@0.5.1
  - @drupal-js-sdk/core@0.5.1
  - @drupal-js-sdk/xhr@0.5.1
  - @drupal-js-sdk/error@0.5.1
  - @drupal-js-sdk/storage@0.5.1

## 0.5.0

### Minor Changes

- Revert to pnpm. BunTime is over.

### Patch Changes

- Updated dependencies
  - @drupal-js-sdk/interfaces@0.5.0
  - @drupal-js-sdk/storage@0.5.0
  - @drupal-js-sdk/error@0.5.0
  - @drupal-js-sdk/core@0.5.0
  - @drupal-js-sdk/xhr@0.5.0

## 0.4.2

### Patch Changes

- Fix dependency declaration
- Updated dependencies
  - @drupal-js-sdk/interfaces@0.4.2
  - @drupal-js-sdk/storage@0.4.2
  - @drupal-js-sdk/error@0.4.2
  - @drupal-js-sdk/core@0.4.2
  - @drupal-js-sdk/xhr@0.4.2

## 0.4.1

### Patch Changes

- Fix version issues
- Updated dependencies
  - @drupal-js-sdk/interfaces@0.4.1
  - @drupal-js-sdk/storage@0.4.1
  - @drupal-js-sdk/error@0.4.1
  - @drupal-js-sdk/core@0.4.1
  - @drupal-js-sdk/xhr@0.4.1

## 0.4.0

### Minor Changes

- Switched to Bun. Its Buntime!

### Patch Changes

- Updated dependencies
  - @drupal-js-sdk/xhr@0.4.0
  - @drupal-js-sdk/core@0.4.0
  - @drupal-js-sdk/error@0.4.0
  - @drupal-js-sdk/interfaces@0.4.0
  - @drupal-js-sdk/storage@0.4.0

## 0.3.16

### Patch Changes

- Fix version dependencies by moving them from "devdependenceis" to "dependencies"
- Updated dependencies
  - @drupal-js-sdk/storage@0.3.14
  - @drupal-js-sdk/error@0.3.14
  - @drupal-js-sdk/core@0.3.15
  - @drupal-js-sdk/xhr@0.3.14

## 0.3.15

### Patch Changes

- Fix missing package dependencies on "error" and "storage" packages

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

- 7aeaa4c: Moved "DrupalMenu" into its own package "@drupal-js-sdk/menu"
