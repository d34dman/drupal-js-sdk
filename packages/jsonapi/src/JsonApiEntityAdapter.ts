import {
  EntityAdapter,
  EntityAdapterContext,
  EntityAttributes,
  EntityLoadOptions,
  EntityListOptions,
  EntityRecord,
} from "@drupal-js-sdk/interfaces";

/** JSON:API entity adapter. */
export class JsonApiEntityAdapter<TAttributes extends EntityAttributes = EntityAttributes>
  implements EntityAdapter<TAttributes> {

  private readonly ctx: EntityAdapterContext;

  constructor(context: EntityAdapterContext) {
    this.ctx = context;
  }

  public async load(entityId: string, options?: EntityLoadOptions): Promise<EntityRecord<TAttributes>> {
    const url = `${this.ctx.basePath}/${encodeURIComponent(entityId)}`;
    const params = options?.jsonapi?.query ?? options?.params;
    const response = await this.ctx.client.call("GET", url, { params });

    const data = (response && response.data && response.data.data) ? response.data.data : undefined;
    if (!data || typeof data !== "object") {
      return {
        id: "",
        type: `${this.ctx.id.entity}--${this.ctx.id.bundle}`,
        attributes: {} as TAttributes,
      };
    }
    return {
      id: String(data.id ?? ""),
      type: String(data.type ?? `${this.ctx.id.entity}--${this.ctx.id.bundle}`),
      attributes: (data.attributes ?? {}) as TAttributes,
      relationships: data.relationships as Record<string, unknown> | undefined,
    };
  }

  public async list(options?: EntityListOptions): Promise<Array<EntityRecord<TAttributes>>> {
    const params = options?.jsonapi?.query ?? options?.params;
    const response = await this.ctx.client.call("GET", this.ctx.basePath, { params });
    const data = (response && response.data && Array.isArray(response.data.data)) ? response.data.data : [];
    return data.map((row: any) => ({
      id: String(row.id ?? ""),
      type: String(row.type ?? `${this.ctx.id.entity}--${this.ctx.id.bundle}`),
      attributes: (row.attributes ?? {}) as TAttributes,
      relationships: row.relationships as Record<string, unknown> | undefined,
    }));
  }

  /** Optional count implementation using JSON:API meta.count when available. */
  public async count(options?: EntityListOptions): Promise<number> {
    const params = options?.jsonapi?.query ?? options?.params;
    const response = await this.ctx.client.call("GET", this.ctx.basePath, { params });
    const meta = (response && response.data && (response.data as any).meta) ? (response.data as any).meta : undefined;
    const countValue = meta && typeof meta.count === "number" ? meta.count : undefined;
    if (typeof countValue === "number") {
      return countValue;
    }
    const data = (response && response.data && Array.isArray((response.data as any).data)) ? (response.data as any).data : [];
    return data.length;
  }
}

export { JsonApiEntityAdapter as Adapter };


