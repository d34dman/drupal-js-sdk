import {Config} from './Config';
import {
  CoreInterface,  
  StorageInterface, 
  StorageRecordInterface, 
  StorageValueType
} from '@drupal-js-sdk/interfaces';

export interface DrupalEntityConfig extends StorageRecordInterface {
    entity: string;
    bundle: string;
    identifier: string;
}

export interface JsonApiConfig extends StorageRecordInterface {
    apiEndpoint: string;
    type: string;
}

export class DrupalEntity {
  static readonly JSON_API = 'JSON_API';

  public config: StorageInterface;
  protected drupal: CoreInterface;

  constructor(config: DrupalEntityConfig, drupal: CoreInterface) {
    this.config = new Config(config);
    this.drupal = drupal;
  }

  public setJsonApiConfig(config: JsonApiConfig):
     DrupalEntity {
    this.config.setItem(DrupalEntity.JSON_API, config);
    return this;
  }

  public getJsonApiConfig(): StorageValueType {
    return this.config.getItem(DrupalEntity.JSON_API);
  }
}
