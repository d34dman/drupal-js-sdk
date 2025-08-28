---
"@drupal-js-sdk/interfaces": minor
"@drupal-js-sdk/entity": minor
"@drupal-js-sdk/jsonapi": minor
"@drupal-js-sdk/core": patch
"drupal-js-sdk": minor
---

Introduce explicit Entity loading layer with pluggable adapters and cleanup of unused core code.

Highlights:
- New "@drupal-js-sdk/entity" package providing EntityService and EntityLoader (adapter registry).
- New "@drupal-js-sdk/jsonapi" adapter for JSON:API entity loading (explicit opt-in).
- Aggregator now re-exports the new packages.
- Core cleaned up: removed unused resource/entity handlers; removed the entities() convenience from core.

Breaking note (interfaces):
- Removed export of ResourceHandlerInterface from "@drupal-js-sdk/interfaces".

Migration:
- If you previously relied on ResourceHandlerInterface, remove those imports.
- For entity loading, opt-in explicitly:
  1) import { EntityService } from "@drupal-js-sdk/entity";
  2) import { JsonApiEntityAdapter } from "@drupal-js-sdk/jsonapi";
  3) const svc = new EntityService(drupal);
  4) svc.registerAdapter("jsonapi", (ctx) => new JsonApiEntityAdapter(ctx));
  5) const loader = svc.entity({ entity: "node", bundle: "article" }, "jsonapi");
     await loader.load("<id>");


