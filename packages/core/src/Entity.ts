import { StorageRecordInterface } from '@drupal-js-sdk/interfaces';

export interface EntityType {
    type: string;
    id: string;
    attributes: StorageRecordInterface;
}
