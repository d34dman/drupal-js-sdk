import {
  ConfigInterface
} from './interfaces';

import {StorageInMemory} from './StorageInMemory';

/**
 * Common getter setter for a config.
 */
export class Config extends StorageInMemory implements ConfigInterface {}
