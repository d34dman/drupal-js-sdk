import { CoreInterface, EntityAdapterFactory, EntityAttributes, EntityIdentifier } from "@drupal-js-sdk/interfaces";

import { EntityLoader } from "./EntityLoader";
import { EntityService } from "./EntityService";
import { FluentEntity } from "./FluentEntity";

/**
 * Facade similar to DrupalMenu: accepts Core/Drupal in constructor and
 * proxies to an internal EntityService, preserving the adapter-based design.
 */
export class DrupalEntity {
  private readonly service: EntityService;

  constructor(drupal: CoreInterface) {
    this.service = new EntityService(drupal);
  }

  public registerAdapter(key: string, factory: EntityAdapterFactory): this {
    this.service.registerAdapter(key, factory);
    return this;
  }

  public setDefaultAdapter(key: string): this {
    this.service.setDefaultAdapter(key);
    return this;
  }

  public entity<TAttributes extends EntityAttributes = EntityAttributes>(
    identifier: EntityIdentifier,
    adapterKey?: string
  ): EntityLoader<TAttributes> {
    return this.service.entity<TAttributes>(identifier, adapterKey);
  }

  public node<TAttributes extends EntityAttributes = EntityAttributes>(bundle: string): FluentEntity<TAttributes> {
    return new FluentEntity<TAttributes>(this.service, { entity: "node", bundle });
  }
}


