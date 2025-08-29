import { CoreInterface, EntityAdapter, EntityAdapterContext, EntityAdapterFactory, EntityAttributes, EntityIdentifier } from "@drupal-js-sdk/interfaces";
import { EntityLoader } from "./EntityLoader";

export class EntityService {
  private readonly adapters: Map<string, EntityAdapterFactory> = new Map();
  private defaultAdapterKey = "jsonapi";
  private readonly drupal: CoreInterface;

  constructor(drupal: CoreInterface) {
    this.drupal = drupal;
  }

  public setDefaultAdapter(key: string): this {
    this.defaultAdapterKey = key;
    return this;
  }

  public registerAdapter(key: string, factory: EntityAdapterFactory): this {
    this.adapters.set(key, factory);
    return this;
  }

  public entity<TAttributes extends EntityAttributes = EntityAttributes>(
    identifier: EntityIdentifier,
    adapterKey?: string
  ): EntityLoader<TAttributes> {
    const client = this.drupal.getClientService();
    const basePath = `/jsonapi/${identifier.entity}/${identifier.bundle}`;
    const context: EntityAdapterContext = {
      id: identifier,
      basePath,
      client,
      config: this.drupal.getConfigService(),
    };

    const key = adapterKey ?? this.defaultAdapterKey;
    const factory = this.adapters.get(key) as EntityAdapterFactory<TAttributes> | undefined;
    if (!factory) {
      throw new Error(`Unknown entity adapter "${key}"`);
    }
    return new EntityLoader<TAttributes>(context, factory(context));
  }
}


