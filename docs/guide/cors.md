---
title: CORS
---

# CORS  <Badge type="warning" text="draft" vertical="top" />

::: tip Note
You don't need to bother about this section if your application is living under
the same domain as Drupal installation.
:::
## What and Why?

## Drupal configuration

```yml
# Configure Cross-Site HTTP requests (CORS).
  # Read https://developer.mozilla.org/en-US/docs/Web/HTTP/Access_control_CORS
  # for more information about the topic in general.
  # Note: By default the configuration is disabled.
 cors.config:
   enabled: false
   # Specify allowed headers, like 'x-allowed-header'.
   allowedHeaders: []
   # Specify allowed request methods, specify ['*'] to allow all possible ones.
   allowedMethods: []
   # Configure requests allowed from specific origins.
   allowedOrigins: ['*']
   # Sets the Access-Control-Expose-Headers header.
   exposedHeaders: false
   # Sets the Access-Control-Max-Age header.
   maxAge: false
   # Sets the Access-Control-Allow-Credentials header.
   supportsCredentials: false
```

## Common Pitfalls

### Basic Auth breaks CORS

### Cookie Policy Lax

::: details References

**On Drupal.org**
- [Opt-in CORS support
| Change record](https://www.drupal.org/node/2715637)

**Others**
- [Cross-Origin Resource Sharing (CORS)](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS) in MDN Web Docs
:::