import {
  EntityAdapter,
  EntityAdapterContext,
  EntityAttributes,
  EntityLoadOptions,
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
}

export { JsonApiEntityAdapter as Adapter };


