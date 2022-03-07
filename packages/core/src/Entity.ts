import { StorageRecordInterface } from '@drupal-js-sdk/storage';

export interface EntityType {
    type: string;
    id: string;
    attributes: StorageRecordInterface;
}
