# @drupal-js-sdk/interfaces

## Overview

Canonical TypeScript interfaces used across the SDK to guarantee compatibility between packages.

## Usage

```js
import type { XhrInterface, CoreInterface, EntityIdentifier } from "@drupal-js-sdk/interfaces";

const id = { entity: "node", bundle: "article" };
// Use types to annotate your code or implement custom adapters.
```

## Public API (types)

- xhr: `XhrInterface`, `XhrRequestConfig`, `XhrResponse`, `XhrMethod`, headers/params types
- client: high-level client-related types
- core: `CoreInterface`
- error: `DrupalErrorInterface`
- session: `SessionInterface`
- storage: `StorageInterface`, `StorageRecordInterface`, `StorageValueType`
- entity: `EntityIdentifier`, `EntityAttributes`, `EntityRecord`, `EntityLoadOptions`, `EntityAdapter*`, `EntityAdapterContext`

Notes

- Consumed across all packages to keep public contracts consistent and decoupled.
