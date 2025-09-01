# @drupal-js-sdk/error

## Overview

Shared error primitive with stable codes for consistent error handling across SDK packages.

## Usage

```js
import { DrupalError } from "@drupal-js-sdk/error";

try {
  throw new DrupalError(DrupalError.INVALID_JSON, "Malformed response");
} catch (e) {
  if (e instanceof DrupalError) {
    console.log(e.getErrorCode());
  }
}
```

## Public API

### class `DrupalError` extends `Error`

#### Constructor

```js title=""
constructor(code: number, message: string)
```

#### static codes (subset)

```js title=""
DrupalError.CONNECTION_FAILED;
DrupalError.INVALID_JSON;
DrupalError.MISSING_IMPLEMENTATION_ERROR;
DrupalError.STORAGE_IN_MEMORY_FAIL;
DrupalError.STORAGE_IN_WEB_FAIL;
```

#### getErrorCode

```js title=""
getErrorCode(): number
```

Notes

- Thrown by SDK modules; check `getErrorCode()` for handling.
