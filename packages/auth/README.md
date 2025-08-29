# @drupal-js-sdk/auth

## Overview

Helpers for Drupal core session endpoints: session token, login, logout, password reset and registration. It relies on the configured HTTP client/session in your `Drupal` instance.

## Usage

```js hl_lines="5 7-10"
import { Drupal } from "@drupal-js-sdk/core";
import { DrupalAuth } from "@drupal-js-sdk/auth";

const drupal = new Drupal({ baseURL: "https://example.com" });
const auth = new DrupalAuth(drupal);

await auth.getSessionToken();
const isLoggedIn = await auth.loginStatus();
if (!isLoggedIn) {
  await auth.login("username", "password");
}
```

## Public API

### class `DrupalAuth`

#### Constructor

```js title=""
constructor(drupal: Drupal)
```
??? example
    ```js hl_lines="3-4"
    import { Drupal } from "@drupal-js-sdk/core";
    import { DrupalAuth } from "@drupal-js-sdk/auth";

    const drupal = new Drupal({ baseURL: "https://example.com" });
    const auth = new DrupalAuth(drupal);
    ```

#### getSessionToken

```js title=""
getSessionToken(): Promise<XhrResponse>
```
??? example
    ```js hl_lines="1"
    await auth.getSessionToken();
    ```

#### login

```js title=""
login(name: string, pass: string): Promise<XhrResponse>
```
??? example
    ```js hl_lines="1"
    await auth.login("username", "password");
    ```

#### loginStatus

```js title=""
loginStatus(): Promise<boolean>
```
??? example
    ```js hl_lines="1"
    const isLoggedIn = await auth.loginStatus();
    ```

#### logout

```js title=""
logout(): Promise<XhrResponse>
```
??? example
    ```js hl_lines="1"
    await auth.logout();
    ```

#### passwordResetByUserName

```js title=""
passwordResetByUserName(name: string): Promise<XhrResponse>
```
??? example
    ```js hl_lines="1"
    await auth.passwordResetByUserName("username");
    ```

#### passwordResetByMail

```js title=""
passwordResetByMail(mail: string): Promise<XhrResponse>
```
??? example
    ```js hl_lines="1"
    await auth.passwordResetByMail("user@example.com");
    ```

#### register

```js title=""
register(name: string, mail: string): Promise<XhrResponse>
```
??? example
    ```js hl_lines="1"
    await auth.register("newuser", "newuser@example.com");
    ```

Notes

- Uses HTTP client and session from the provided `Drupal` instance.
- Errors are `DrupalError` with `getErrorCode()`.
