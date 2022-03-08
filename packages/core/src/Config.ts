import { StorageRecordInterface} from '@drupal-js-sdk/interfaces';
import {StorageInMemory} from '@drupal-js-sdk/storage';

/**
 * Common getter setter for a config.
 */
export class Config extends StorageInMemory {
    public constructor(config: StorageRecordInterface) {
        super();
        this.set(config);
    }
}
