import {
  EntityAdapter,
  EntityAdapterContext,
  EntityAttributes,
  EntityLoadOptions,
  EntityListOptions,
  EntityRecord,
  EntityListResult,
} from "@drupal-js-sdk/interfaces";
import type { XhrQueryParams } from "@drupal-js-sdk/interfaces";

function toXhrParams(input?: Record<string, unknown> | XhrQueryParams): XhrQueryParams | undefined {
  if (!input) return undefined;
  const out: XhrQueryParams = {};
  for (const [key, value] of Object.entries(input)) {
    if (Array.isArray(value)) {
      out[key] = value.map((v) => String(v));
      continue;
    }
    if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
      out[key] = value;
      continue;
    }
    if (value == null) {
      continue;
    }
    out[key] = String(value);
  }
  return out;
}

/** JSON:API entity adapter. */
export class JsonApiEntityAdapter<TAttributes extends EntityAttributes = EntityAttributes>
  implements EntityAdapter<TAttributes> {

  private readonly ctx: EntityAdapterContext;

  constructor(context: EntityAdapterContext) {
    this.ctx = context;
  }

  public async load(entityId: string, options?: EntityLoadOptions): Promise<EntityRecord<TAttributes>> {
    const url = `${this.ctx.basePath}/${encodeURIComponent(entityId)}`;
    const params = toXhrParams(options?.jsonapi?.query ?? options?.params);
    const response = await this.ctx.client.call("GET", url, { params });

    const data: unknown = (response && (response as any).data && (response as any).data.data) ? (response as any).data.data : undefined;
    if (!data || typeof data !== "object") {
      return {
        id: "",
        type: `${this.ctx.id.entity}--${this.ctx.id.bundle}`,
        attributes: {} as TAttributes,
      };
    }
    const rec = data as { id?: unknown; type?: unknown; attributes?: unknown; relationships?: unknown };
    const attrs = (rec.attributes && typeof rec.attributes === "object" ? rec.attributes : {}) as TAttributes;
    const rels = (rec.relationships && typeof rec.relationships === "object" ? (rec.relationships as Record<string, unknown>) : undefined);
    return {
      id: String(rec.id ?? ""),
      type: String(rec.type ?? `${this.ctx.id.entity}--${this.ctx.id.bundle}`),
      attributes: attrs,
      relationships: rels,
    };
  }

  public async list(options?: EntityListOptions): Promise<Array<EntityRecord<TAttributes>>> {
    const params = toXhrParams(options?.jsonapi?.query ?? options?.params);
    const response = await this.ctx.client.call("GET", this.ctx.basePath, { params });
    const raw: unknown = response && (response as any).data && (response as any).data.data;
    const rows: Array<unknown> = Array.isArray(raw) ? (raw as Array<unknown>) : [];
    return rows.map((row): EntityRecord<TAttributes> => {
      const rec = (row && typeof row === "object" ? row : {}) as { id?: unknown; type?: unknown; attributes?: unknown; relationships?: unknown };
      const attrs = (rec.attributes && typeof rec.attributes === "object" ? rec.attributes : {}) as TAttributes;
      const rels = (rec.relationships && typeof rec.relationships === "object" ? (rec.relationships as Record<string, unknown>) : undefined);
      return {
        id: String(rec.id ?? ""),
        type: String(rec.type ?? `${this.ctx.id.entity}--${this.ctx.id.bundle}`),
        attributes: attrs,
        relationships: rels,
      };
    });
  }

  /** Structured list with pagination parsed from JSON:API meta/links. */
  public async listPage(options?: EntityListOptions): Promise<EntityListResult<TAttributes>> {
    const params = toXhrParams(options?.jsonapi?.query ?? options?.params);
    const response = await this.ctx.client.call("GET", this.ctx.basePath, { params });
    const raw: any = response && (response as any).data ? (response as any).data : {};
    const data: Array<unknown> = Array.isArray(raw.data) ? raw.data : [];
    const items = data.map((row): EntityRecord<TAttributes> => {
      const rec = (row && typeof row === "object" ? row : {}) as { id?: unknown; type?: unknown; attributes?: unknown; relationships?: unknown };
      const attrs = (rec.attributes && typeof rec.attributes === "object" ? rec.attributes : {}) as TAttributes;
      const rels = (rec.relationships && typeof rec.relationships === "object" ? (rec.relationships as Record<string, unknown>) : undefined);
      return {
        id: String(rec.id ?? ""),
        type: String(rec.type ?? `${this.ctx.id.entity}--${this.ctx.id.bundle}`),
        attributes: attrs,
        relationships: rels,
      };
    });
    const meta = (raw && typeof raw.meta === "object") ? raw.meta as Record<string, unknown> : {};
    const links = (raw && typeof raw.links === "object") ? raw.links as Record<string, any> : {};
    const page = {
      size: typeof meta["pageSize"] === "number" ? (meta["pageSize"] ) : undefined,
      number: typeof meta["pageNumber"] === "number" ? (meta["pageNumber"] ) : undefined,
      total: typeof meta["count"] === "number" ? (meta["count"] ) : undefined,
      next: links && links.next && typeof links.next.href === "string" ? links.next.href as string : null,
      prev: links && links.prev && typeof links.prev.href === "string" ? links.prev.href as string : null,
    };
    return { items, page };
  }

  /** Optional count implementation using JSON:API meta.count when available. */
  public async count(options?: EntityListOptions): Promise<number> {
    const params = toXhrParams(options?.jsonapi?.query ?? options?.params);
    const response = await this.ctx.client.call("GET", this.ctx.basePath, { params });
    const meta = (response && (response as any).data && (response as any).data.meta) ? (response as any).data.meta : undefined;
    const countValue = meta && typeof meta.count === "number" ? meta.count : undefined;
    if (typeof countValue === "number") {
      return countValue;
    }
    const raw: unknown = response && (response as any).data && (response as any).data.data;
    const rows: Array<unknown> = Array.isArray(raw) ? (raw as Array<unknown>) : [];
    return rows.length;
  }
}

export { JsonApiEntityAdapter as Adapter };


