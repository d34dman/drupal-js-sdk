import { EntityAdapter, EntityAttributes, EntityLoadOptions, EntityRecord, EntityAdapterContext } from "@drupal-js-sdk/interfaces";

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
}


