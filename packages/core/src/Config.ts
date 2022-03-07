import {
  ConfigInterface
} from './interfaces';

import {StorageInMemory} from '@drupal-js-sdk/storage';

/**
 * Common getter setter for a config.
 */
export class Config extends StorageInMemory implements ConfigInterface {}
