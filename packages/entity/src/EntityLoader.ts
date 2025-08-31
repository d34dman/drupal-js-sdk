import { EntityAdapter, EntityAttributes, EntityLoadOptions, EntityRecord, EntityAdapterContext, EntityListOptions } from "@drupal-js-sdk/interfaces";

export class EntityLoader<TAttributes extends EntityAttributes = EntityAttributes> {
  private readonly context: EntityAdapterContext;
  private readonly adapter: EntityAdapter<TAttributes>;

  constructor(context: EntityAdapterContext, adapter: EntityAdapter<TAttributes>) {
    this.context = context;
    this.adapter = adapter;
  }

  public async load(id: string, options?: EntityLoadOptions): Promise<EntityRecord<TAttributes>> {
    return this.adapter.load(id, options);
  }

  public async list(options?: EntityListOptions): Promise<Array<EntityRecord<TAttributes>>> {
    if (typeof (this.adapter as any).list !== "function") {
      throw new Error("Entity adapter does not support list()");
    }
    return (this.adapter as any).list(options);
  }

  public async count(options?: EntityListOptions): Promise<number> {
    if (typeof (this.adapter as any).count !== "function") {
      throw new Error("Entity adapter does not support count()");
    }
    return (this.adapter as any).count(options);
  }
}


