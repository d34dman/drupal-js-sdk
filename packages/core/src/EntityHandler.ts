import {Config} from './Config';
import {DrupalError} from '@drupal-js-sdk/error';
import { StorageRecordInterface } from '@drupal-js-sdk/interfaces';

interface EntityHandlerConfig extends StorageRecordInterface{
    type: string;
    bundle: string;
    keys: {[key: string]: any;};
}

export class EntityHandler extends Config {

  constructor(config: EntityHandlerConfig) {
    super(config);
  }

  public create(data: StorageRecordInterface): {[key: string]: any;} {
    if (data) {
      // @TODO Implement create.
    }
    throw new DrupalError(DrupalError.MISSING_IMPLEMENTATION_ERROR, 'Not Implemented');
  }

  public read(id: string): {[key: string]: any;} {
    if (id) {
      // @TODO Implement read.
    }
    throw new DrupalError(DrupalError.MISSING_IMPLEMENTATION_ERROR, 'Not Implemented');
  }

  public update(data: StorageRecordInterface): {[key: string]: any;} {
    if (data) {
      // @TODO Implement update.
    }
    throw new DrupalError(DrupalError.MISSING_IMPLEMENTATION_ERROR, 'Not Implemented');
  }

  public delete(id: string): {[key: string]: any;} {
    if (id) {
      // @TODO Implement delete.
    }
    throw new DrupalError(DrupalError.MISSING_IMPLEMENTATION_ERROR, 'Not Implemented');

  }

  public query(query: {[key: string]: any;}): {[key: string]: any;} {
    if (query) {
      // @TODO Implement query.
    }
    throw new DrupalError(DrupalError.MISSING_IMPLEMENTATION_ERROR, 'Not Implemented');
  }
}
