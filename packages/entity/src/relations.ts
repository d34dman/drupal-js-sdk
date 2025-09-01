import { EntityAttributes, EntityIdentifier, EntityListOptions, EntityRecord } from "@drupal-js-sdk/interfaces";
import { EntityService } from "./EntityService";

type RelationAccessor = {
  load: <TRel extends EntityAttributes = EntityAttributes>(options?: EntityListOptions) => Promise<Array<EntityRecord<TRel>>>;
};

type RelationFunction = (name: string) => RelationAccessor;

/** Simple in-memory coalescing cache for relationship loads. */
const relationPromiseCache: Map<string, Promise<Array<EntityRecord<EntityAttributes>>>> = new Map();

function createCacheKey(identifier: EntityIdentifier, entityId: string, relationName: string): string {
  return `${identifier.entity}--${identifier.bundle}:${entityId}:${relationName}`;
}

/**
 * Attach a non-enumerable `rel(name).load()` helper to an entity record.
 */
export function attachRelations<TAttr extends EntityAttributes>(
  record: EntityRecord<TAttr>,
  service: EntityService,
  identifier: EntityIdentifier,
  adapterKey?: string
): EntityRecord<TAttr> & { rel: RelationFunction } {
  const rel: RelationFunction = (name: string): RelationAccessor => {
    return {
      load: async <TRel extends EntityAttributes = EntityAttributes>(options?: EntityListOptions) => {
        const key = createCacheKey(identifier, record.id, name);
        const existing = relationPromiseCache.get(key) as Promise<Array<EntityRecord<TRel>>> | undefined;
        if (existing) return existing;

        // Try to use relationship linkage when available to avoid extra requests
        const relObj = (record.relationships && typeof record.relationships === "object")
          ? (record.relationships as Record<string, any>)[name]
          : undefined;
        const linkage = relObj && typeof relObj === "object" ? relObj.data : undefined;

        let promise: Promise<Array<EntityRecord<TRel>>>;
        if (Array.isArray(linkage) && linkage.length > 0) {
          // Multiple linked entities: load individually for now
          promise = Promise.all(linkage.map((lnk: any) => {
            const typeStr = String(lnk.type ?? "");
            const idStr = String(lnk.id ?? "");
            const [entity, bundle] = typeStr.includes("--") ? typeStr.split("--") : [identifier.entity, identifier.bundle];
            return service.load<TRel>({ entity, bundle }, idStr, options, adapterKey);
          }));
        } else if (linkage && typeof linkage === "object" && linkage.id) {
          // Single linked entity
          const typeStr = String(linkage.type ?? "");
          const idStr = String(linkage.id); // Removed ?? "" since linkage.id is guaranteed to be truthy here
          const [entity, bundle] = typeStr.includes("--") ? typeStr.split("--") : [identifier.entity, identifier.bundle];
          promise = service.load<TRel>({ entity, bundle }, idStr, options, adapterKey).then((rec) => [rec]);
        } else {
          // Fallback: include-based fetch for relation via adapter listPage or list
          const opts: EntityListOptions = {
            ...options,
            jsonapi: { query: { ...(options?.jsonapi?.query ?? {}), include: name } },
          } as any;
          promise = service
            .list<{ [key: string]: unknown }>(identifier, opts, adapterKey)
            .then(() => [] as Array<EntityRecord<TRel>>);
        }

        relationPromiseCache.set(key, promise as unknown as Promise<Array<EntityRecord<EntityAttributes>>>);
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
  Object.defineProperty(record as any, "rel", {
    value: rel,
    enumerable: false,
    configurable: false,
    writable: false,
  });

  return record as any;
}


