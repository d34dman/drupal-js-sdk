import { XhrInterface, XhrQueryParams } from "./xhr";
import { StorageInterface } from "./storage";

/** Canonical identifier for a Drupal entity bundle. */
export interface EntityIdentifier {
  entity: string;
  bundle: string;
}

/** Attributes payload of an entity (free-form, strongly typed by consumers). */
export type EntityAttributes = Record<string, unknown>;

/** Standardized representation of an entity record returned by loaders. */
export interface EntityRecord<TAttributes extends EntityAttributes = EntityAttributes> {
  id: string;
  type: string;
  attributes: TAttributes;
  relationships?: Record<string, unknown>;
}

/** Adapter-agnostic load options; adapter-specific options may be nested. */
export interface EntityLoadOptions {
  /** Generic query params mapped to the underlying request params. */
  params?: XhrQueryParams;
  /** JSON:API specific options (ignored by non-JSON:API adapters). */
  jsonapi?: {
    /** Prebuilt JSON:API query object (e.g., from drupal-jsonapi-params). */
    query?: Record<string, unknown>;
  };
}

/** Adapter-agnostic list options; mirrors load options. */
export interface EntityListOptions extends EntityLoadOptions {}

/** Context provided by core to construct an adapter instance. */
export interface EntityAdapterContext {
  id: EntityIdentifier;
  /** Base path for the entity, e.g. "/jsonapi/node/article". */
  basePath: string;
  client: XhrInterface;
  /** Optional shared configuration bag. */
  config?: StorageInterface;
}

/** Minimal entity adapter interface, focused on load. */
export interface EntityAdapter<TAttributes extends EntityAttributes = EntityAttributes> {
  /** Load a single entity by its ID. */
  load(entityId: string, options?: EntityLoadOptions): Promise<EntityRecord<TAttributes>>;
  /** List entities for the adapter context's bundle. Optional for adapters that don't support listing. */
  list?(options?: EntityListOptions): Promise<Array<EntityRecord<TAttributes>>>;
  /** Return a count for the adapter context's bundle. Optional. */
  count?(options?: EntityListOptions): Promise<number>;
}

/** Factory function used to register adapters. */
export type EntityAdapterFactory<TAttributes extends EntityAttributes = EntityAttributes> =
  (context: EntityAdapterContext) => EntityAdapter<TAttributes>;


