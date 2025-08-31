export * from '@drupal-js-sdk/error';
export * from '@drupal-js-sdk/storage';
export * from '@drupal-js-sdk/core';
export * from '@drupal-js-sdk/menu';
export * from '@drupal-js-sdk/auth';
export * from '@drupal-js-sdk/entity';
export * from '@drupal-js-sdk/jsonapi';

import { Drupal as CoreDrupal } from '@drupal-js-sdk/core';
import { DrupalAuth } from '@drupal-js-sdk/auth';
import { DrupalMenu } from '@drupal-js-sdk/menu';
import { DrupalEntity } from '@drupal-js-sdk/entity';

/**
 * High-level facade that exposes feature modules from a single entry.
 */
export class DrupalSDK extends CoreDrupal {
  /** Feature: authentication */
  public readonly auth: DrupalAuth;
  /** Feature: menus */
  public readonly menu: DrupalMenu;
  /** Feature: entities */
  public readonly entities: DrupalEntity;

  constructor(config: ConstructorParameters<typeof CoreDrupal>[0]) {
    super(config);
    this.auth = new DrupalAuth(this);
    this.menu = new DrupalMenu(this);
    this.entities = new DrupalEntity(this);
  }
}
