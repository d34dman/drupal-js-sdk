import {
  EntityAttributes,
  EntityIdentifier,
  EntityListOptions,
  EntityRecord,
} from "@drupal-js-sdk/interfaces";

import { EntityService } from "./EntityService";

type RelationAccessor = {
  load: <TRel extends EntityAttributes = EntityAttributes>(
    options?: EntityListOptions
  ) => Promise<Array<EntityRecord<TRel>>>;
};

type RelationFunction = (name: string) => RelationAccessor;

/** Simple in-memory coalescing cache for relationship loads. */
const relationPromiseCache: Map<string, Promise<Array<EntityRecord<EntityAttributes>>>> = new Map();

const createCacheKey = (
  identifier: EntityIdentifier,
  entityId: string,
  relationName: string
): string => {
  return `${identifier.entity}--${identifier.bundle}:${entityId}:${relationName}`;
};

/**
 * Attach a non-enumerable `rel(name).load()` helper to an entity record.
 */
export const attachRelations = <TAttr extends EntityAttributes>(
  record: EntityRecord<TAttr>,
  service: EntityService,
  identifier: EntityIdentifier,
  adapterKey?: string
): EntityRecord<TAttr> & { rel: RelationFunction } => {
  const rel: RelationFunction = (name: string): RelationAccessor => {
    return {
      load: async <TRel extends EntityAttributes = EntityAttributes>(
        options?: EntityListOptions
      ): Promise<Array<EntityRecord<TRel>>> => {
        const key = createCacheKey(identifier, record.id, name);
        const existing = relationPromiseCache.get(key) as
          | Promise<Array<EntityRecord<TRel>>>
          | undefined;
        if (existing) return existing;

        // Try to use relationship linkage when available to avoid extra requests
        const relObj =
          record.relationships && typeof record.relationships === "object"
            ? (record.relationships as Record<string, { data?: unknown }>)[name]
            : undefined;
        const linkage = relObj && typeof relObj === "object" ? relObj.data : undefined;

        let promise: Promise<Array<EntityRecord<TRel>>>;
        if (Array.isArray(linkage) && linkage.length > 0) {
          // Multiple linked entities: load individually for now
          promise = Promise.all(
            linkage.map((lnk: { type?: string; id?: string }) => {
              const typeStr = String(lnk.type ?? "");
              const idStr = String(lnk.id ?? "");
              const [entity, bundle] = typeStr.includes("--")
                ? typeStr.split("--")
                : [identifier.entity, identifier.bundle];
              return service.load<TRel>({ entity, bundle }, idStr, options, adapterKey);
            })
          );
        } else if (
          linkage !== null &&
          typeof linkage === "object" &&
          typeof (linkage as { id?: string }).id === "string" &&
          (linkage as { id: string }).id.length > 0
        ) {
          // Single linked entity
          const typedLinkage = linkage as { type?: string; id: string };
          const typeStr = String(typedLinkage.type ?? "");
          const idStr = String(typedLinkage.id);
          const [entity, bundle] = typeStr.includes("--")
            ? typeStr.split("--")
            : [identifier.entity, identifier.bundle];
          promise = service
            .load<TRel>({ entity, bundle }, idStr, options, adapterKey)
            .then((rec) => [rec]);
        } else {
          // Fallback: include-based fetch for relation via adapter listPage or list
          const opts: EntityListOptions = {
            ...options,
            jsonapi: { query: { ...(options?.jsonapi?.query ?? {}), include: name } },
          };
          promise = service
            .list<{ [key: string]: unknown }>(identifier, opts, adapterKey)
            .then(() => [] as Array<EntityRecord<TRel>>);
        }

        relationPromiseCache.set(
          key,
          promise as unknown as Promise<Array<EntityRecord<EntityAttributes>>>
        );
        try {
          const res = await promise;
          return res;
        } finally {
          relationPromiseCache.delete(key);
        }
      },
    };
  };

  // Attach non-enumerable property
  Object.defineProperty(record, "rel", {
    value: rel,
    enumerable: false,
    configurable: false,
    writable: false,
  });

  return record as EntityRecord<TAttr> & { rel: RelationFunction };
};
